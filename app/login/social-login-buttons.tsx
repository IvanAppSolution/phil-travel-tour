"use client";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginGithub, loginGoogle } from "@/lib/auth-actions";

export const SocialLoginButtons = () => {
  const signInWithGithub = async () => await loginGithub();

  const signInWithGoogle = async () => await loginGoogle();

  return (
      <div className="flex items-center justify-between">
        <Button 
          onClick={signInWithGithub}
          className="w-[45%]" variant="outline"><FaGithub/> Github</Button>
        <Button 
          onClick={signInWithGoogle}
          className="w-[45%]" variant="outline"><FcGoogle/> Google</Button>
      </div>
  )

}