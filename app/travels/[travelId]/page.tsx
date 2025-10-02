import { auth, Session } from "@/auth";
import DetailContent from "./detail-content";
import { prisma } from "@/lib/prisma";
 

export default async function TravelDetail({
  params,
}: {
  params: Promise<{ travelId: string }>;
}) {
  const { travelId } = await params;

  const session = await auth() as Session | null;

  // if (!session) {
  //   return <div> Please sign in.</div>;
  // }

  const travelPromise = prisma.travel.findFirst({
    where: { id: travelId },
    include: {
      trips: {
        include: {
          locations: true
        }
      }
    },
  });

  return <DetailContent travelPromise={travelPromise} session={session} />;
}
