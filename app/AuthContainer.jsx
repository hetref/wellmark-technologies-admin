"use client";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const AuthContainer = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
        // toast.error("User ");
        router.push("/sign-in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);
  return <div>{children}</div>;
};

export default AuthContainer;
