import { useSession, signIn } from "next-auth/client";
import Image from "next/image";
import { HeartIcon as HeartOutline } from "@heroicons/react/outline";
import { StarIcon, HeartIcon as HeartSolid } from "@heroicons/react/solid";
import { useDispatch, useContextState } from "../context";

const InfoCard = ({ id, img, location, title, description, star, price, total, liked, createCheckoutSession }) => {
  const { items } = useContextState();
  const dispatch = useDispatch();
  const [session] = useSession();

  const isInBasket = items.find((i) => i.id === id);

  return (
    <div className="flex flex-col sm:flex-row py-7 px-2 border-b cursor-pointer hover:opacity-80 hover:shadow-lg transition duration-200 ease-out first:border-t">
      <div className="relative h-52 w-80 flex-shrink-0">
        <Image src={img} layout="fill" alt="" objectFit="cover" className="rounded-2xl" />
      </div>
      <div className="flex flex-col flex-grow sm:pl-5 pt-5">
        <div className="flex justify-between">
          <p>{location}</p>
          {!liked ? (
            <HeartOutline className="h-7 cursor-pointer" onClick={() => dispatch("LIKE", id)} />
          ) : (
            <HeartSolid className="h-7 cursor-pointer text-red-400" onClick={() => dispatch("LIKE", id)} />
          )}
        </div>
        <h4 className="text-xl">{title}</h4>
        <div className="border-b w-10 pt-2" />
        <p className="pt-2 text-sm text-gray-500 flex-grow">{description}</p>
        <div className="flex justify-between items-end pt-5">
          <p className="flex items-center">
            <StarIcon className="h-5 text-red-400" />
            {star}
          </p>
          <div className="text-right">
            <p className="text-lg font-semibold pb-2 lg:text-2xl">£{price} / night</p>
            <p className="font-extralight">£{total} total</p>
            <button
              onClick={() => {
                !session && signIn();
                isInBasket
                  ? createCheckoutSession()
                  : dispatch("BOOK", {
                      id,
                      img,
                      title,
                      description,
                      total,
                    });
              }}
              className="bg-red-400 py-1.5 rounded-xl mt-2 shadow-md transition transform duration-200 ease-out hover:scale-105 active:scale-90 font-semibold px-3"
            >
              {!session ? "Sign in to book" : !isInBasket ? "Book Now" : "Preceed to checkout"}
            </button>
            {isInBasket && (
              <button
                onClick={() => dispatch("CANCEL", id)}
                className={`mr-auto bg-red-400 py-1.5 rounded-xl mt-2 shadow-md transition transform duration-200 ease-out hover:scale-105 active:scale-90 font-semibold px-3 ${
                  isInBasket && "ml-2"
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
