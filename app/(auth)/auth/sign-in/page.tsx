"use client";

import { useSearchParams } from "next/navigation";
import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error && (
        <p className="text-red-500 font-semibold mb-4">Auth Error: {error}</p>
      )}

      <Image
        src="/login.svg"
        alt="Login Image"
        height={300}
        width={300}
        className="m-6 object-cover"
      />

      <SignInFormClient />
    </div>
  );
};

export default Page;
