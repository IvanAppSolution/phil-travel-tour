"use client";

import { Location, Travel, Trip } from "@/prisma/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Pen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useEffect, useState } from "react";
import Map from "./map";
import SortableItinerary from "./sortable-itinerary";
import { User } from "@/auth"

export type TravelWithTripWithLocation = Travel & {
  trips: (Trip & {
    locations: Location[];
  })[];
};

interface ContentProps {
  travelPromise: Promise<TravelWithTripWithLocation | null>;
  user: User | undefined;
}

export default function Content({ travelPromise, user }: ContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const travel = use(travelPromise);
  const [locations, setLocations] = useState<Location[]>([]);
  console.log('travels in detail', travelPromise);

  if (!travel) {
    return <div> Travel not found.</div>;
  }

  useEffect(() => {
    const allLocations = travel.trips.flatMap((trip) => trip.locations);
    setLocations(allLocations);
  }, [travel]);

  console.log('travel in detail - user:', user);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {" "}
      {travel && travel.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          {" "}
          <Image
            src={travel.imageUrl}
            alt={travel.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}
    
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="">
            <TabsTrigger value="overview" className="text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg">
              Map
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 gap-6">
            <div className="grid grid-cols-3">
              <div className="my-6 md:col-span-2">
                <div className="">
                  <h1 className="text-4xl font-extrabold text-gray-900">
                    {" "}
                    {travel.title} 
                    { user && user.role === "admin" ? <Link className="" href={`/travels/${travel.id}/update`}><Button className="ml-3 w-16" size="icon"  variant="outline"><Pen className="h-5 w-5" />Edit </Button></Link> : false }
                  </h1>
                  <p className="text-gray-500 mt-2">{travel.subTitle}</p>
                  <p className="text-gray-500 mt-1 flex"> <Calendar className="h-5 w-5 mr-1" /> {travel.noOfTravelDays}</p>
                </div>
                
                <div className="my-4 text-gray-600 leading-relaxed">
                  {travel.description}
                </div>

              
                <div className="my-6">
                  <h3 className="text-lg font-medium mb-2">Included Trips</h3>
                  <ul className="list-disc pl-5">
                    {travel.trips.map(trip => (
                      <li key={trip.id} className="mb-2">
                        <span className="font-medium">{trip.title}</span>  
                        <div>
                          
                        <div className="flex items-start text-sm text-gray-500 mt-1">  
                          <MapPin className="h-5 w-5 mr-1 text-gray-500" />                         
                          {trip.locations.length && trip.locations.map((loc) => (
                            <span key={loc.id}> {loc.locationTitle}, </span>
                          )) }
                        </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              

                <div className="my-6 h-72 rounded-lg overflow-hidden shadow">
                  <Map itineraries={locations} />
                </div>
              </div>

               {/* COLUMN Booking */}
              <div>

                    {/* Add Booking Column */}
              </div>
            </div>  
          </TabsContent>
          
          {/* ITINERARY */}
          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold"> Full Itinerary</h2>
            </div>

            {travel.trips.length === 0 ? (
              <div className="text-center p-4">
                <p>No trips available for this travel package.</p>
              </div>
            ) : (
              <div>
                {travel.trips.map((trip) => (
                  <div key={trip.id} className="mb-6">
                    <h3 className="text-xl font-medium mb-2">{trip.title}</h3>
                    {trip.locations.length === 0 ? (
                      <div className="text-center p-4">
                        <p>No locations available for this trip.</p>
                      </div>
                    ) : (
                      <SortableItinerary locations={trip.locations} tripId={trip.id} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* MAP */}
          <TabsContent value="map" className="space-y-6">
            <div className="h-72 rounded-lg overflow-hidden shadow">
              <Map itineraries={travel.trips.flatMap(trip => trip.locations)} />
            </div>
            {travel.trips.flatMap(trip => trip.locations).length === 0 && (
              <div className="text-center p-4 mt-4">
                <p>No locations available to display on the map.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="text-center">
        <Link href={`/trips`}>
          <Button> Back to Trips</Button>
        </Link>
      </div>
    </div>
  );
}
