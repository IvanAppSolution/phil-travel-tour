"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createTravel } from "@/lib/actions/travel";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/upload-thing";
import { useState, useTransition } from "react";
import Image from "next/image";
import { MultipleImageUploadButton } from "@/components/ui/multiple-image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Content() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [coverImagesUrl, setCoverImagesUrl] = useState<string[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);


  const handleCoverImagesUploaded = (urls: string[]) => {
    setCoverImagesUrl(urls);
  };

  const handleImagesUploaded = (urls: string[]) => {
    setImagesUrl(urls);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader> New Travel</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              if (imageUrl) {
                formData.append("imageUrl", imageUrl);
              }
              if (coverImagesUrl.length > 0) {
                formData.append("coverImagesUrl", coverImagesUrl.join(","));
              }
              if (imagesUrl.length > 0) {
                formData.append("imagesUrl", imagesUrl.join(","));
              }
              startTransition(() => {
                createTravel(formData);
              });
            }}
          >
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub title
              </label>
              <Textarea
                name="shortDescription"
                placeholder="Sub title"              
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <Textarea
                name="shortDescription"
                placeholder="short description"               
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Trip description..."              
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
              />
            </div>
             
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Product Photo (1 Photo)</label>

              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Trip Preview"
                  className="mb-4 rounded-md max-h-48 object-cover"
                  width={300}
                  height={100}
                />
              )}
              { imageUrl === null ? <UploadButton
                className="justify-items-start"
                endpoint="multipleImageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0].ufsUrl) {
                    setImageUrl(res[0].ufsUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error: ", error);
                }}
              /> : false }
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Cover Photos (up to 10 Photos)</label>
              <MultipleImageUploadButton
                onImagesUploaded={handleCoverImagesUploaded}
                maxFiles={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Travel Photos (up to 10 Photos)</label>
              <MultipleImageUploadButton
                onImagesUploaded={handleImagesUploaded}
                maxFiles={10}
              />
            </div>


            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
