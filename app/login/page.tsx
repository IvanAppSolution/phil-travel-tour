import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialLoginButtons } from "./social-login-buttons";
// import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage() {
  // const session = await getSession();
  const session = await auth();

  if (session) redirect("/home");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
     <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <SocialLoginButtons />
        <div className="flex gap-x-2 item-center justify-center my-6" >
          <Separator className=" " style={{marginTop: '8px'}} />
          <span className="text-muted-foreground text-xs uppercase whitespace-nowrap">Or Continue With</span>
          <Separator className=" " style={{marginTop: '8px'}} />
        </div>
        
        <div className="flex flex-col gap-y-2" >
          <Label>Email</Label>
          <Input placeholder="Email" type="email" />
          <Label>Password</Label>
          <Input placeholder="Password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create an account</Button>
      </CardFooter>
     </Card>
    </div> 
  );
}
