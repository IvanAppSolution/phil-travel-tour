import { auth, type Session, type User } from "@/auth";
import { prisma } from "@/lib/prisma";
import ClientContent from "./client-content";


export default async function TripsPage() {
  const sessionPromise = auth();
  const travelsPromise = prisma.travel.findMany();
 
  return (
    <ClientContent travelsPromise={travelsPromise} sessionPromise={sessionPromise as Promise<Session | null>} />
  );
}
