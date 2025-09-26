import { auth, Session } from "@/auth";
import { redirect } from "next/navigation";
import NewContent from "./new-content";
import { prisma } from "@/lib/prisma";
import { Trip } from "@/prisma/generated/prisma";

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function NewTrip({ searchParams }: PageProps) {
  const session = await auth() as Session;
  if (!session && session?.user?.role !== 'admin') {
    redirect("/login");
  }

  const travelId = await searchParams?.travelId || undefined;
  console.log('NewTrip-travelId: ', travelId);

  const tripId = await searchParams?.tripId || undefined;
  console.log('NewTrip-travelId: ', travelId);

  let trip = Promise.resolve<Trip | null>(null);
  if (tripId) {
    trip = prisma.trip.findFirst({
      where: { id: tripId as string },
      include: {
          locations: true
      },
    });
  }

  const travel = prisma.travel.findMany({
    select: { id: true, title: true }
  });
  // console.log('NewTrip-session: ', session);

  return (
    <NewContent travelPromise={travel} tripPromise={trip as Promise<Trip>} travelId={travelId as string | undefined} />
  );
}
