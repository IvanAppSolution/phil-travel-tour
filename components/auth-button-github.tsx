"use client";

import { useRouter } from "next/navigation";
import { loginGithub } from "@/lib/auth-actions";

interface AuthButtonProps {
  isLoggedIn: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AuthButtonGithub({
  isLoggedIn,
  className,
  children,
}: AuthButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    if (isLoggedIn) {
      router.push("/trips");
    } else {
      await loginGithub();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
