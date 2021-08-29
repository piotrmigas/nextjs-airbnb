import { getSession, signIn } from "next-auth/client";
import dayjs from "dayjs";
import db from "../firebase";
import Booking from "../components/Booking";
import Header from "../components/Header";

const Profile = ({ session, bookings }) => {
  if (!session) signIn();

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto md:px-8 lg:px-16">
        <section className="pt-6">
          <div className="flex flex-col px-7">
            <h1 className="text-xl text-center sm:text-left">
              Logged as <span className="font-semibold">{session.user.name}</span>
            </h1>
            <h2 className="text-lg my-5 text-center">Recent bookings:</h2>
            {bookings.map(({ id, items, amount, timestamp }) => (
              <Booking id={id} key={id} items={items} amount={amount} timestamp={timestamp} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  const query = await db
    .collection("users")
    .doc(session.user.email)
    .collection("bookings")
    .orderBy("timestamp", "desc")
    .get();

  const bookings = [];

  for (const doc of query.docs) {
    bookings.push({
      timestamp: dayjs(doc.data().timestamp.seconds * 1000).format("DD MMMM YY"),
      id: doc.id,
      amount: doc.data().amount,
      items: doc.data().items,
    });
  }

  return {
    props: {
      session,
      bookings,
    },
  };
};
