export type BookingItemProps = {
  id?: string;
  img: string;
  title: string;
  total: number;
  description: string;
};

const BookingItem = ({ img, title, total, description }: BookingItemProps) => {
  return (
    <div className='mx-8 sm:mx-9 md:mx-10 my-4 bg-white shadow-md h-96 rounded-3xl flex flex-col justify-around items-center overflow-hidden md:flex-row md:h-52 md:w-auto'>
      <img className='h-1/2 w-full md:h-full md:w-1/3 object-cover' src={img} alt='' />
      <div className='flex-1 w-full flex flex-col items-baseline justify-around h-1/2 pl-6 md:h-full md:items-baseline md:w-1/2'>
        <div className='flex flex-col justify-start items-baseline'>
          <h1 className='text-lg mb-0 text-gray-600'>{title}</h1>
        </div>
        <p className='text-sm text-gray-500 w-4/5'>{description}</p>
        <div className='w-full flex justify-between items-center'>
          <h1 className='font-bold text-gray-500'>Price: £{total}</h1>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;
