"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  const router = useRouter();
  const { isLoggedIn, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated || isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Event Manager
          </h1>
          <p className="text-gray-600">
            Join us and start managing your events
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
