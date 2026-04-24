import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Event Manager",
  description: "Sign in or sign up to Event Manager",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
