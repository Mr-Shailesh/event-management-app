"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, isHydrated } = useAuth();

  // Redirect to login if not logged in
  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated || !isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <DashboardHeader />
      <main className="mx-auto w-full">{children}</main>
    </div>
  );
}
