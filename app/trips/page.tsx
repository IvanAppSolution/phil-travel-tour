import { auth, type Session, type User } from "@/auth";
import { prisma } from "@/lib/prisma";
import ClientContent from "./client-content";


export default async function TripsPage() {
  const sessionPromise = auth();
  const tripsPromise = prisma.trip.findMany();
 
  return (
    <ClientContent tripsPromise={tripsPromise} sessionPromise={sessionPromise as Promise<Session | null>} />
  );
}
