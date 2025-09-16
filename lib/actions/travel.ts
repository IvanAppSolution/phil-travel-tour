"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function createTravel(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated.");
  }

  const title = formData.get("title")?.toString();
  const subTitle = formData.get("subTitle")?.toString();
  const shortDescription = formData.get("shortDescription")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const coverImagesUrl = formData.get("coverImagesUrl")?.toString().split(",") || [];
  const imagesUrl = formData.get("imagesUrl")?.toString().split(",") || [];
  const pricePerPerson = Number(formData.get("pricePerPerson")?.toString() || 0);
  const noOfTravelDays = formData.get("noOfTravelDays")?.toString();

  if (!title || !description ) {
    throw new Error("All fields are required.");
  }

  // const startDateStr = formData.get("startDate")?.toString();
  // const endDateStr = formData.get("endDate")?.toString();
  //|| !startDateStr || !endDateStr
  // const startDate = new Date(startDateStr);
  // const endDate = new Date(endDateStr);
   

  await prisma.travel.create({
    data: {
      title,
      subTitle,
      description,
      shortDescription,
      imageUrl,
      coverImagesUrl,
      imagesUrl,
      noOfTravelDays,
      pricePerPerson,
      createdById: session.user.id,
    },
  });

  redirect("/travels");
}

export async function updateTravel(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Not authenticated.");
  }

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const subTitle = formData.get("subTitle")?.toString();
  const shortDescription = formData.get("shortDescription")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const coverImagesUrl = formData.get("coverImagesUrl")?.toString().split(",") || [];
  const imagesUrl = formData.get("imagesUrl")?.toString().split(",") || [];
  const pricePerPerson = Number(formData.get("pricePerPerson")?.toString() || 0);
  const noOfTravelDays = formData.get("noOfTravelDays")?.toString();

  if (!title || !description ) {
    throw new Error("All fields are required.");
  }

  // const startDateStr = formData.get("startDate")?.toString();
  // const endDateStr = formData.get("endDate")?.toString();
  //|| !startDateStr || !endDateStr
  // const startDate = new Date(startDateStr);
  // const endDate = new Date(endDateStr);
   

  await prisma.travel.update({ where:{id},
    data: {
      title,
      subTitle,
      description,
      shortDescription,
      imageUrl,
      coverImagesUrl,
      imagesUrl,
      noOfTravelDays,
      pricePerPerson,
      createdById: session.user.id,
    },
  });

  redirect("/travels");
}
