const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { items, email } = req.body;

  const transformedItems = items.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: "pln",
      unit_amount: item.total * 100,
      product_data: {
        name: item.title,
        images: [item.img],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_HOST}/success`,
    cancel_url: process.env.NEXT_PUBLIC_HOST,
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.img)),
      titles: JSON.stringify(items.map((item) => item.title)),
    },
  });

  res.status(200).json({ id: session.id });
}
