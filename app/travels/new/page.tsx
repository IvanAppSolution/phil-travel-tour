import { auth, Session } from "@/auth";
import { redirect } from "next/navigation";
import Content from "./content";

export default async function NewTravel() {
  const session = await auth() as Session;
  // console.log('NewTrip-session: ', session);

  if (!session && session?.user?.role !== 'admin') {
    redirect("/login");
  } 

  return (
    <Content />
  );
}
