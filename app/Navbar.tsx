"use client";
import Image from "next/image";
import { GrMoreVertical } from "react-icons/gr";
import { BsBellFill } from "react-icons/bs";
import { LuMessagesSquare } from "react-icons/lu";
import { BsShieldLockFill } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaPowerOff } from "react-icons/fa";
import logo from "../assets/brand.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { removeUserContext } from "../auth/auth-context";
import { useRouter } from "next/navigation";
import { showSuccess } from "../components/Toast";

export default function Navbar() {
  const [showPop, setShowPop] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleDocClick = (e: any) => {
      if (e.target.textContent === " Logout") {
        removeUserContext();
        router.push("/institute-selection");
        showSuccess("Logout successfully");
      }
      setShowPop(false);
    };
    document.body.addEventListener("click", handleDocClick);

    return () => {
      document.body.removeEventListener("click", handleDocClick);
    };
  }, [router]);

  return (
    <div className="flex text-black justify-between items-center relative px-4 bg-[#03d4d4] h-[60px] mb-3">
      <div>
        <Image src={logo} alt="logo" width={100} height={100} />
      </div>
      <div className="flex justify-between gap-6">
        <Link href="/messages">
          <LuMessagesSquare
            size={20}
            className="hover:scale-125 duration-500 text-white"
          />
        </Link>
        <Link href="/news-events">
          <BsBellFill
            size={20}
            className="hover:scale-125 duration-500 text-white"
          />
        </Link>
        <GrMoreVertical
          onClick={() => setShowPop(true)}
          size={20}
          className="hover:scale-125 duration-500 text-white"
        />
        {showPop && (
          <div className="w-48 bg-gray-100 shadow-xl rounded-md flex flex-col absolute top-12 right-1 ">
            <Link href="/change-password">
              <p
                className="px-4 py-2 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-gray-400 text-base"
              >
                <BsShieldLockFill size={20} /> Change Password
              </p>
            </Link>
            <p
              className="px-4 py-2 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-gray-400 text-base"
            >
              <HiOutlineLogout size={20} /> Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
