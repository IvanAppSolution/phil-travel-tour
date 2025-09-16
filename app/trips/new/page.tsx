import { auth, Session } from "@/auth";
import { redirect } from "next/navigation";
import Content from "./content";
import { prisma } from "@/lib/prisma";

export default async function NewTrip() {
  const session = await auth() as Session;
  const travelsPromise = prisma.travel.findMany();
  console.log('NewTrip-session: ', session);

  if (!session && session?.user?.role !== 'admin') {
    redirect("/login");
  } 

  return (
    <Content travelsPromise={travelsPromise} />
  );
}
