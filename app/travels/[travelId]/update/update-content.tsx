"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { updateTravel } from "@/lib/actions/travel";
import { cn } from "@/lib/utils";
import { use, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Travel } from "@/prisma/generated/prisma";
import { set } from "zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
// import { uploadImage } from "@/lib/actions/uploadImage";


export default function UpdateContent({ travel }: {travel: Travel | null}) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [coverImagesUrl, setCoverImagesUrl] = useState<string[]>([]);
  
  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleCoverImagesUploaded = (url: string) => {
    setCoverImagesUrl((prevImages) => [...prevImages, url]);
  };


  //Remove image handlers
  const handleRemoveImage = () => {
    setImageUrl("");    
  };

  const handleRemoveCoverImage = (indexToRemove: number) => {
    setCoverImagesUrl((prevImages) => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );    
  };


  if (!travel) {
    return <div>No travel data found.</div>;
  }

  useEffect(() => {
    setImageUrl(travel.imageUrl ? travel.imageUrl : "");
    setCoverImagesUrl(travel.coverImagesUrl || []);
  }, [travel]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader><h1>Update Travel</h1></CardHeader>
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
                defaultValue={travel.noOfTravelDays || ''}             
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Photo (1 Photo)
                <ImageUploader onUploadSuccess={handleImageUploaded} />
              </label>
              {imageUrl && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     
                      <div className="relative group">
                        <Image
                          src={imageUrl || ''}
                          alt={`imageUrl`}
                          width={300}
                          height={300}
                          className="rounded-lg object-cover w-full h-48"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage()}
                        >
                        <X className="h-4 w-4" />
                      </Button>
                      </div>
                    
                  </div>
                )} 
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photos (up to 10 Photos)
                <ImageUploader onUploadSuccess={handleCoverImagesUploaded} />
              </label>
              {coverImagesUrl.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {coverImagesUrl.map((imageUrl, index) => (
                      <div className="relative group" key={index}>
                        <Image
                          key={index}
                          src={imageUrl || ''}
                          alt={`imageProductUrl`}
                          width={300}
                          height={300}
                          className="rounded-lg object-cover w-full h-48"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveCoverImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      </div>
                    ))}
                  </div>
                )} 
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
