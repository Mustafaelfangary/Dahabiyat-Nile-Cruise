"use client";
export const dynamic = "force-dynamic";

import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-[400px]">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-text-primary">
            Enter your details to create your account
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 