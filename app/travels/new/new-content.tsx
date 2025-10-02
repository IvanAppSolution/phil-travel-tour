"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createTravel } from "@/lib/actions/travel";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

export default function Content() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
            <label className="block text-sm font-medium text-gray-700 mb-1"> Product Photo (1 Photo) <ImageUploader onUploadSuccess={handleImageUploaded} /></label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1"> Cover Photos (up to 10 Photos)  <ImageUploader onUploadSuccess={handleCoverImagesUploaded} /></label>
            {coverImagesUrl.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {coverImagesUrl.map((imageUrl, index) => (
                    <div className="relative group" key={index}>
                      <Image
                        src={imageUrl || ''}
                        alt={`imageProductUrl`}
                        width={300}
                        height={300}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <Button
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
              {isPending ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
