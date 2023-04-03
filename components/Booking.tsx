import BookingItem, { BookingItemProps } from './BookingItem';

type BookingProps = {
  amount: number;
  items: BookingItemProps[];
  timestamp: string;
};

const Booking = ({ amount, items, timestamp }: BookingProps) => {
  return (
    <div className='pb-10'>
      <p className='pb-2'>{timestamp}</p>
      <hr className='mb-5 border-gray-600' />
      <div className='border rounded-lg bg-gray-300 sm:mx-10'>
        <div className='flex flex-col justify-center'>
          {items.map(({ id, img, title, total, description }) => (
            <BookingItem img={img} key={id} title={title} total={total} description={description} />
          ))}
        </div>
        <p className='text-xl text-right pb-4 pr-4'>Total: £{amount}</p>
      </div>
    </div>
  );
};

export default Booking;
