import { useState } from 'react';
import Head from 'next/head';
import { getSession } from 'next-auth/client';
import { Watch as Loader } from 'react-loader-spinner';
import Header from '../components/Header';
import Banner from '../components/Banner';
import SmallCard from '../components/SmallCard';
import MediumCard from '../components/MediumCard';
import LargeCard from '../components/LargeCard';
import Footer from '../components/Footer';
import db from '../firebase';

type HomeProps = {
  exploreData: {
    distance: string;
    id: string;
    img: string;
    location: string;
  }[];
  cardsData: {
    id: string;
    img: string;
    title: string;
  }[];
};

export default function Home({ exploreData, cardsData }: HomeProps) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Airbnb</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {loading && (
        <Loader height={38} width={38} wrapperClass='flex items-center justify-center h-screen' color='#FE595E' />
      )}
      <>
        <Header />
        <Banner setLoading={setLoading} />
        <main className='max-w-7xl mx-auto px-8 sm:px-16'>
          <section className='pt-6'>
            <h2 className='text-2xl sm:text-3xl text-gray-800 font-bold pb-5'>Explore nearbly</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {exploreData?.map(({ id, img, location, distance }) => (
                <SmallCard key={id} img={img} location={location} distance={distance} />
              ))}
            </div>
          </section>
          <section>
            <h2 className='text-2xl sm:text-3xl text-gray-800 font-bold py-8'>Live anywhere</h2>
            <div className='flex space-x-3 overflow-scroll scrollbar-hide p-3 -ml-3'>
              {cardsData?.map(({ title, img }) => (
                <MediumCard key={title} img={img} title={title} />
              ))}
            </div>
          </section>
          <LargeCard
            img='https://i.imgur.com/VXh6RBs.jpg'
            title='The Greatest Outdoors'
            description='Wishlists curated by Airbnb'
            btnText='Get Inspired'
          />
        </main>
        <Footer />
      </>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const exploreData = [];
  const exploreQuery = await db.collection('exploreData').get();
  for (const doc of exploreQuery.docs) {
    exploreData.push({ ...doc.data(), id: doc.id });
  }

  const cardsData = [];
  const cardsQuery = await db.collection('cardsData').get();
  for (const doc of cardsQuery.docs) {
    cardsData.push({ ...doc.data(), id: doc.id });
  }

  return {
    props: { exploreData, cardsData, session },
  };
};
