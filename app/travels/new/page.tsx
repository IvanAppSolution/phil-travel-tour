import { auth, Session } from "@/auth";
import { redirect } from "next/navigation";
import Content from "./new-content";

export default async function NewTravel() {
  const session = await auth() as Session | null;

  if (!session) {
    redirect("/login");
  } 

  return (
    <Content />
  );
}
