"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createUpdateTrip } from "@/lib/actions/trip";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/upload-thing";
import { use, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Travel, Trip } from "@/prisma/generated/prisma";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

type TravelName = {
  id: string;
  title: string;
}
interface ContentProps {
  travelPromise: Promise<TravelName[] | []>;
  tripPromise: Promise<Trip | null>;
  travelId?: string | undefined;
}

export default function NewContent({ travelPromise, tripPromise, travelId } : ContentProps) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const travels: TravelName[] = use(travelPromise) || [];
  const trip = use(tripPromise);
  const [selectedTravelId, setSelectedTravelId] = useState('');
    const [isCreateMode, setIsCreateMode] = useState(false);
  // const [selectedTravelTitle, setSelectedTravelTitle] = useState('');
  console.log("travels:", travels);
  console.log("trip:", trip);
  // const { travelId: paramTravelId } = useParams();

  useEffect(() => {
    // console.log("paramTravelId:", travelId);
    // console.log("travels:", travels);
    if (travelId && travels && travels.length > 0) {
      const selectedTravel = travels.find(travel => travel.id === travelId);
      if (selectedTravel) {
        console.log("Found travel for paramTravelId:", selectedTravel.id);
        setSelectedTravelId(selectedTravel.id);
        // setSelectedTravelTitle(selectedTravel.title);
      }
    }
  }, [travelId, travels]);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader> Create Trip</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              if (imageUrl) {
                formData.append("imageUrl", imageUrl);
              }

              if (isCreateMode){
                formData.append("isCreateMode", "true");
              }

              startTransition(() => {
                createUpdateTrip(formData);
              });
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {" "}
                Travel Name
              </label>
              <Select name="travelId" value={selectedTravelId}  >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Travel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {travels.length && travels.map((travel) => (
                      <SelectItem key={travel.id} value={travel.id} >
                        {travel.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {" "}
                Title
              </label>
              <input
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
              <textarea
                name="shortDescription"
                placeholder="Sub title"
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}                
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Trip description..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
            </div> */}
            
            <div>
              <label> Trip Image</label>

              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Trip Preview"
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                  width={300}
                  height={100}
                />
              )}
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0].ufsUrl) {
                    setImageUrl(res[0].ufsUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error: ", error);
                }}
              />
            </div>
            {trip ? <div>
              <div className="text-center p-4">
                <p>Add locations to see them on the map.</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button>
                    {" "}
                    <Plus className="mr-2 h-5 w-5" /> Add Location
                  </Button>
                </Link>
              </div> 

            </div>: false }

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
