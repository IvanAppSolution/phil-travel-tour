"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createUpdateTrip } from "@/lib/actions/trip";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/upload-thing";
import { use, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Location, Travel, Trip } from "@/prisma/generated/prisma";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { set } from "zod";
import { useRouter } from "next/navigation";

type TravelName = {
  id: string;
  title: string;
}
interface ContentProps {
  travelPromise: Promise<TravelName[] | []>;
  tripPromise: Promise<(Trip & {
      locations: Location[];
    }) | null>;
  travelId?: string | undefined;
}

export default function TripContent({ travelPromise, tripPromise, travelId } : ContentProps) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const travels: TravelName[] = use(travelPromise) || null;
  const trip = use(tripPromise) || null;
  const [selectedTravelId, setSelectedTravelId] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(false);
  const router = useRouter();
  // const [selectedTravelTitle, setSelectedTravelTitle] = useState('');
  // console.log("travels:", travels);
  console.log("trip:", trip);
  // const { travelId: paramTravelId } = useParams();

  useEffect(() => {
    // console.log("trip:", trip);
    // console.log("travels:", travels);  

    if (trip) {
      setIsCreateMode(false);
      setImageUrl(trip.imageUrl || null);
      setSelectedTravelId(trip.travelId);

    } else{
      setIsCreateMode(true);
    }
 

    if (travelId) {
      setSelectedTravelId(travelId); 
    }

  }, [travelId, travels, trip]);

 

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader className="text-2xl"> {isCreateMode ? "Create Trip" : "Update Trip" }</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              if (imageUrl) {
                formData.append("imageUrl", imageUrl);
              }

              if (isCreateMode){
                formData.append("isCreateMode", "true");
              } else {
                formData.append("isCreateMode", "false");
                formData.append("tripId", trip?.id || '');
              }
              
              startTransition(() => {
                startTransition(() => {
                  createUpdateTrip(formData);
                });
              });
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Name 
              </label>
              <Select name="travelId" value={selectedTravelId}  onValueChange={(v) => {console.log('v:',v); v ? setSelectedTravelId(v) : false;}}  >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Travel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {travels.length && travels.map((travel) => (
                      <SelectItem key={travel.id} value={travel.id}>
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
                defaultValue={trip?.title || ''}
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
                defaultValue={trip?.shortDescription || ''}
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
                defaultValue={trip?.description || ''}
                placeholder="Trip description..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>
            
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
              <div className="flex items-start text-sm text-gray-500 mt-1">
                {trip.locations.length > 0 && trip.locations.map((loc) => (
                  <div key={loc.id} className="flex flex-row items-center mr-4 mb-2">
                  <MapPin className="h-5 w-5 mr-1 text-gray-500" />
                  <span key={loc.id}>{loc.locationTitle}</span>
                  </div>
                )) }
              </div>
            </div>: false }

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : isCreateMode ? "Create Trip" : "Update Trip"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}  >
                Cancel 
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
