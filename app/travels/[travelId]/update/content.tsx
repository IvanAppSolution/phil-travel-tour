"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { updateTravel } from "@/lib/actions/travel";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/upload-thing";
import { use, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { MultipleImageUploadButton, SingleImageUploadButton } from "@/components/ui/image-upload";
import { Travel } from "@/prisma/generated/prisma";
import { set } from "zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function Content({ travel }: {travel: Travel | null}) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [coverImagesUrl, setCoverImagesUrl] = useState<string[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);


  
  const handleImageUploaded = (urls: string[]) => {
    setImageUrl(urls);
  };

  const handleCoverImagesUploaded = (urls: string[]) => {
    setCoverImagesUrl(urls);
  };

  const handleImagesUploaded = (urls: string[]) => {
    setImagesUrl(urls);
  };

  if (!travel) {
    return <div>No travel data found.</div>;
  }

  useEffect(() => {
    // console.log('travel data in update form:', travel);
    setImageUrl(travel.imageUrl ? [travel.imageUrl] : []);
    setCoverImagesUrl(travel.coverImagesUrl || []);
    setImagesUrl(travel.imagesUrl || []);
  }, [travel]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader><h1>Update Travel</h1></CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              if (imageUrl.length > 0) {
                formData.append("imageUrl", imageUrl[0]);
              }
              if (coverImagesUrl.length > 0) {
                formData.append("coverImagesUrl", coverImagesUrl.join(","));
              }
              if (imagesUrl.length > 0) {
                formData.append("imagesUrl", imagesUrl.join(","));
              }
              startTransition(() => {
                updateTravel(formData);
              });
            }}
          >
            <input
                type="hidden"
                name="id"
                value={travel.id}
              />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {" "}
                Title
              </label>
              <Input
                type="text"
                name="title"
                placeholder=""
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
                defaultValue={travel.title}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub title
              </label>
              <Textarea
                name="subTitle"
                placeholder="Sub title"
                defaultValue={travel.subTitle || ''}             
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <Textarea
                name="shortDescription"
                placeholder="short description"
                defaultValue={travel.shortDescription || ''}                
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Trip description..."
                defaultValue={travel.description || ''}                 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days of Travel
              </label>
              <Input
                name="noOfTravelDays"
                placeholder="Days of Travel"
                             
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Person
              </label>
              <Input
                name="pricePerPerson"
                type="number"
                placeholder=""
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}    
                defaultValue={travel.pricePerPerson || ''}              
              />
            </div>
             
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Product Photo (1 Photo)</label>
              <SingleImageUploadButton
                defaultImages={imageUrl || []}
                onImagesUploaded={handleImageUploaded}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Cover Photos (up to 10 Photos)</label>
              <MultipleImageUploadButton
                onImagesUploaded={handleCoverImagesUploaded}
                maxFiles={10}
                defaultImages={coverImagesUrl || []}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Travel Photos (up to 10 Photos)</label>
              <MultipleImageUploadButton
                onImagesUploaded={handleImagesUploaded}
                maxFiles={10}
                defaultImages={imagesUrl || []}
              />
            </div>


            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Saving..." : "Save Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
