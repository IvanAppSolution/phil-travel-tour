import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TripContent from "./trip-content";
// import { Location, Trip } from "@/prisma/generated/prisma";

interface PageProps {
  params: Promise<{ tripId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TripDetail({ params, searchParams }: PageProps) {
  const { tripId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const travelId = resolvedSearchParams.travelId as string | undefined;
  const session = await auth();

  if (!session) {
    return <div> Please sign in.</div>;
  }

  // Create trip promise
  const tripPromise = prisma.trip.findFirst({
    where: { 
      id: tripId !== "0" ? tripId : undefined 
    },
    include: {
      locations: true
    },
  }).then(trip => trip || null);

  // Get travels for dropdown
  const travelPromise = prisma.travel.findMany({
    select: { 
      id: true, 
      title: true 
    }
  });

  return <TripContent
    tripPromise={tripPromise} 
    travelPromise={travelPromise} 
    travelId={travelId} 
  />
}
