import { buffer } from "micro";
import * as admin from "firebase-admin";

const serviceAccount = require("../../permissions.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const endpointSecret = process.env.NEXT_PUBLIC_STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  const lineItems = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] });
  console.log(lineItems.line_items.data);
  const items = lineItems.line_items.data.map(({ id, description, amount_total }, index) => ({
    id,
    title: JSON.parse(session.metadata.titles)[index],
    description,
    total: amount_total / 100,
    img: JSON.parse(session.metadata.images)[index],
  }));

  return await app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("bookings")
    .doc(session.id)
    .set({
      items,
      amount: session.amount_total / 100,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("Error", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
