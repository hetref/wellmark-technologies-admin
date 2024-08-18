"use client";
import { auth } from "@/firebase/config";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const signInHandler = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      alert("Please fill in all the fields");
      return;
    } else {
      console.log(email, password);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User signed in successfully");

          console.log("User:", user);
          router.push("/");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error("Invalid credentials");
          console.log("Error signing in:", errorCode, errorMessage);
        });
    }
    setEmail("");
    setPassword("");
  };
  const resetHandler = () => {
    if (email === "") {
      alert("Please enter your email");
      return;
    }
    console.log("Resetting password");
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Email sent if you are already registered");
      })
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          alert("You don't have an account with this email");
        } else {
          alert(err.message);
        }
      });
  };

  return (
    <div className="w-96 mx-auto">
      <div className="flex items-center justify-center">
        <div className="bg-gray-300 mb-3 rounded-full w-32 h-32 flex items-center justify-center border-2 ">
          <img
            src="/logo.png"
            alt="logo"
            className="w-full h-full border border-gray-300 rounded-full "
          />
        </div>
      </div>

      <form
        action="submit"
        className="p-8 rounded-lg border-2  flex flex-col gap-4"
      >
        <h2 className="text-lg text-gray-600 text-center">
          Log In to Admin Panel
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-gray-500 font-bold ">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border-2 border-gray-300 p-3 rounded-xl"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-gray-500 font-bold ">
            {" "}
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="border-2 border-gray-300 p-3 rounded-xl"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <p
            className="text-sm cursor-pointer text-blue-600 underline font-bold"
            onClick={resetHandler}
          >
            Forget Password?
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="submit"
            className="p-4 bg-[#5eb1af] hover:bg-[#5eb1af]/80 text-white rounded-lg"
            onClick={signInHandler}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
