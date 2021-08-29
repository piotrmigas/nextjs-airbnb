import { CheckCircleIcon } from "@heroicons/react/solid";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import Header from "../components/Header";

const Success = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col p-10 bg-white">
          <div className="flex items-center justify-center space-x-2 mb-5">
            <CheckCircleIcon className="text-green-500 h-10" />
            <h1 className="text-lg sm:text-3xl font-semibold">
              Thank you, your location has been successfully booked!
            </h1>
          </div>
          <button onClick={() => router.push("/")} className="bg-red-400 rounded-xl font-semibold py-2 mt-8">
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Success;
