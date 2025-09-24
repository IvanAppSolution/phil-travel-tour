import { auth, type Session, type User } from "@/auth";
import { prisma } from "@/lib/prisma";
import Content from "./content";


export default async function TripsPage() {
  const sessionPromise = auth();
  const travelsPromise = prisma.travel.findMany();
 
  return (
    <Content travelsPromise={travelsPromise} sessionPromise={sessionPromise as Promise<Session | null>} />
  );
}
