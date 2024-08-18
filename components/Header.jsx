"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const Header = () => {
  const router = useRouter();
  const logOutHandler = () => {
    console.log("Logging out");

    signOut(auth)
      .then(() => {
        console.log("Logged out");
        toast.success("Logged out successfully");
        router.push("/sign-in");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error logging out:", error);
      });
  };
  return (
    <div className="border-b w-screen px-20 mb-10  h-16 ">
      <div className="flex justify-between items-center">
        <Link href="/">
          <img src="/logo.png" alt="logo" width="100" height="100" />
        </Link>
        <div>
          <button
            className="bg-[#5eb1af] text-gray-200 px-4 py-3 rounded-md  hover:bg-[#5eb1af]/80"
            onClick={logOutHandler}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
