import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[650px] 2xl:h-[700px] -mt-24">
      <Image src="/img/banner.webp" layout="fill" alt="" objectFit="cover" />
      <div className="absolute top-1/2 w-full text-center transform -translate-y-1/2">
        <p className="sm:text-3xl font-semibold">Not sure where to go? Perfect.</p>
        <button className="text-white bg-gray-900 py-2 px-5 sm:py-4 sm:px-10 shadow-md rounded-lg font-semibold mt-4 hover:shadow-xl active:scale-90 transition duration-150">
          I&apos;m flexible
        </button>
      </div>
    </div>
  );
};

export default Banner;
