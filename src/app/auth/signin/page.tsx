"use client";
export const dynamic = "force-dynamic";

import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-primary">
            Or{" "}
            <a
              href="/auth/signup"
              className="font-medium text-text-primary hover:text-text-primary"
            >
              create a new account
            </a>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 