"use client";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthContainer = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
        router.push("/sign-in");
      }
      setLoading(false); // Set loading to false after the user state is checked
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <h1 className="text-2xl font-semibold animate-pulse">Loading...</h1>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthContainer;
