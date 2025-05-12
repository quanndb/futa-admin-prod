"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/login");
    }
  }, [router, path]);
  return <div>{children}</div>;
}
