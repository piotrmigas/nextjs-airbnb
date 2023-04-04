import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/client';
import db from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfoCard from '../components/InfoCard';
import { useContextState, useDispatch } from '../context';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const Search = () => {
  const [session] = useSession();
  const router = useRouter();
  const { location, startDate, endDate, numberOfGuests } = router.query;
  const dispatch = useDispatch();
  const { searchResults, items } = useContextState();

  useEffect(() => {
    const fetchResults = async () => {
      const res = await db
        .collection('searchResults')
        .get()
        .then((snap) => snap.docs.map((doc) => ({ ...doc.data(), id: doc.id, liked: false })));

      dispatch('GET_RESULTS', res);
    };
    fetchResults();
  }, []);

  const formattedStartDate = dayjs(startDate as string).format('DD MMMM YY');
  const formattedEndDate = dayjs(endDate as string).format('DD MMMM YY');
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post('/api/create-checkout-session', {
      items,
      email: session?.user?.email,
    });

    const result = await stripe.redirectToCheckout({ sessionId: checkoutSession.data.id });
    if (result.error) alert(result.error.message);
  };

  return (
    <>
      <Header placeholder={`${location} | ${range} | ${numberOfGuests}`} />
      <main className='flex'>
        <section className='flex-grow pt-14 px-6'>
          <p className='text-xs'>
            300+ Stays - {range} - for {numberOfGuests} guests
          </p>
          <h1 className='text-3xl font-semibold mt-2 mb-6'>Stays in {location}</h1>
          <div className='hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap'>
            <p className='button'>Cancellation Flexibility</p>
            <p className='button'>Type of Place</p>
            <p className='button'>Price</p>
            <p className='button'>Rooms and Beds</p>
            <p className='button'>More filters</p>
          </div>
          <div className='flex flex-col'>
            {searchResults.map(({ id, img, location, title, price, description, total, star, liked }) => (
              <InfoCard
                key={id}
                img={img}
                description={description}
                total={total}
                location={location}
                title={title}
                price={price}
                star={star}
                id={id}
                liked={liked}
                createCheckoutSession={createCheckoutSession}
              />
            ))}
          </div>
        </section>
        <section className='hidden xl:inline-flex xl:min-w-[600px]'>
          <Map searchResults={searchResults} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Search;
