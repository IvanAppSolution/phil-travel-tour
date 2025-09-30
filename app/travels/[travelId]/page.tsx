import { auth } from "@/auth";
import DetailContent from "./detail-content";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export default async function TravelDetail({
  params,
}: {
  params: Promise<{ travelId: string }>;
}) {
  const { travelId } = await params;

  const session = auth() as Promise<Session | null>;

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

  return <DetailContent travelPromise={travelPromise} sessionPromise={session} />;
}
