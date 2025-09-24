import { auth, Session } from "@/auth";
import { redirect } from "next/navigation";
import UpdateContent from "./update-content";
import { prisma } from "@/lib/prisma";
import { Travel } from "@/prisma/generated/prisma";
import { Suspense } from "react";

export default async function UpdateTravel({
  params,
}: {
  params: Promise<{ travelId: string }>;
}) {
  const session = await auth() as Session;

  if (!session) { // && session?.user?.role !== 'admin'
    redirect("/login");
  } 

  const { travelId } = await params;
  // console.log('UpdateTravel-travelId: ', travelId);
  const travel = await prisma.travel.findFirst({
      where: { id: travelId },
      include: {
        trips: {
          include: {
            locations: true
          }
        }
      },
    }) as Travel | null;

  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <UpdateContent travel={travel} />
    </Suspense>
  );
}
