import { auth, type Session } from "@/auth";
import { prisma } from "@/lib/prisma";
import Content from "./content";


export default async function TripsPage() {
  const sessionPromise = auth();
  const tripsPromise = prisma.trip.findMany();
 
  return (
    <Content tripsPromise={tripsPromise} sessionPromise={sessionPromise as Promise<Session | null>} />
  );
}
