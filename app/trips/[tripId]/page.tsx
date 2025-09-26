import { auth } from "@/auth";
// import TripDetailClient from "./trip-detail";
import { prisma } from "@/lib/prisma";
import TripContent from "./trip-content";
import { Trip } from "@/prisma/generated/prisma";

interface PageProps {
  params: { tripId: string };
  searchParams: { [key: string]: string | string[] | undefined };
} 

export default async function TripDetail({ params, searchParams }: PageProps) {
  const tripId = params.tripId;
  const travelId = searchParams.travelId as string | undefined;
  console.log('travelId: ', travelId);

  const session = await auth();

  if (!session) {
    return <div> Please sign in.</div>;
  }

  let trip = Promise.resolve<Trip & { locations: any[] } | null>(null);
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
  
  return <TripContent travelPromise={travel} tripPromise={trip} travelId={travelId as string | undefined} />
}
