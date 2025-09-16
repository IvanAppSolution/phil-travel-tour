"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const SignoutButton = () => {
  const router = useRouter();
  const signOut = async () => await authClient.signOut({
    fetchOptions: {
      onSuccess: () => router.push("/login"),
    },
  });

  return (
    <Button 
      onClick={signOut}
      variant="outline">
        Sign Out
    </Button>
  )

}