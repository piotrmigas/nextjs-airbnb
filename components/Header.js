import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { SearchIcon, UserCircleIcon, GlobeAltIcon, MenuIcon, UsersIcon } from "@heroicons/react/solid";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { signIn, signOut, useSession } from "next-auth/client";

const Header = ({ placeholder }) => {
  const [menu, setMenu] = useState(false);
  const [session] = useSession();
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const router = useRouter();

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const search = () => {
    router.push({
      pathname: "/search",
      query: {
        location: searchInput,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfGuests,
      },
    });
  };

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 grid grid-cols-2 sm:grid-cols-3 md:px-10 transition duration-300 ease-in-out bg-white shadow-md ${
        !scroll && router.pathname === "/" && "bg-transparent shadow-none"
      } p-5`}
    >
      <div className="relative flex items-center h-10 cursor-pointer my-auto">
        <Image
          src="/img/logo.png"
          layout="fill"
          alt=""
          objectFit="contain"
          objectPosition="left"
          onClick={() => router.push("/")}
        />
      </div>
      <div className="hidden sm:flex items-center md:border-2 rounded-full py-2 bg-white">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow pl-5 bg-transparent outline-none text-sm placeholder-gray-500"
          type="text"
          placeholder={placeholder || "Start your search"}
        />
        <SearchIcon className="inline-flex h-8 bg-red-400 text-white rounded-full p-2 md:mx-2" />
      </div>
      <div
        className={`flex space-x-4 items-center justify-end ${scroll ? "text-gray-600" : "text-white"} ${
          router.pathname !== "/" && "text-gray-600"
        }`}
      >
        <p className="hidden lg:inline cursor-pointer">Become a host</p>
        <GlobeAltIcon className="hidden lg:block h-6 cursor-pointer" />
        <div className="flex space-x-2 items-center border-2 p-2 rounded-full bg-white text-gray-600">
          <MenuIcon className="w-5 cursor-pointer" onClick={() => setMenu(!menu)} />
          {session ? (
            <img src={session.user.image} alt="" className="w-7 rounded-full" />
          ) : (
            <UserCircleIcon className="w-7" />
          )}
        </div>
      </div>
      {menu && (
        <ul className="rounded-md absolute top-20 right-5 sm:right-10 bg-white text-center cursor-pointer border-2">
          <li className="px-5 font-semibold" onClick={session ? signOut : signIn}>
            {session ? "Log out" : "Log in"}
          </li>
          <div className="border-b" />
          <Link href="/profile">
            <a className="px-5">Profile</a>
          </Link>
        </ul>
      )}
      {searchInput && (
        <div className="hidden sm:flex absolute inset-x-0  justify-center top-20">
          <div className="flex flex-col col-span-3 bg-white rounded-xl p-4 mt-5 mx-auto">
            <DateRangePicker
              ranges={[selectionRange]}
              minDate={new Date()}
              rangeColors={["#FD5B61"]}
              onChange={handleSelect}
            />
            <div className="flex items-center border-b mb-4">
              <h2 className="text-2xl flex-grow font-semibold">Number of Guests</h2>
              <UsersIcon className="h-5 text-gray-800" />
              <input
                type="number"
                className="w-12 pl-2 text-lg outline-none text-red-400"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                min={1}
              />
            </div>
            <div className="flex">
              <button className="flex-grow text-gray-500" onClick={() => setSearchInput("")}>
                Cancel
              </button>
              <button className="flex-grow text-white bg-red-400 rounded-md py-1" onClick={search}>
                <a>Search</a>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
