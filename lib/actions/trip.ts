"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function createUpdateTrip(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated.");
  }
 
  const isCreateMode = formData.get("isCreateMode") === "true";  
  const title = formData.get("title")?.toString();
  const subTitle = formData.get("subTitle")?.toString();
  const description = formData.get("description")?.toString();
  const shortDescription = formData.get("shortDescription")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const travelId = formData.get("travelId")?.toString();

  if (!title || !travelId) {
    throw new Error("Title and Travel ID are required.");
  }

  // const startDateStr = formData.get("startDate")?.toString();
  // const endDateStr = formData.get("endDate")?.toString();
  //|| !startDateStr || !endDateStr
  // const startDate = new Date(startDateStr);
  // const endDate = new Date(endDateStr);
   
  if (!isCreateMode) {
    await prisma.trip.update({
    where: { id: formData.get("tripId")?.toString() },
    data: {
      title,
      subTitle: subTitle || null,
      description: description || null,
      shortDescription: shortDescription || null,
      travelId: travelId,
      ...(imageUrl ? { imageUrl } : {})
    },
  });

  } else {
    await prisma.trip.create({
    data: {
      title,
      subTitle: subTitle || null,
      description: description || null,
      shortDescription: shortDescription || null,      
      travelId: travelId,
      ...(imageUrl ? { imageUrl } : {})
    },
  });
  }
  

  redirect("/travels/" + travelId);
}
