"use client";

import { Location, Travel, Trip } from "@/prisma/generated/prisma";
import Image from "next/image";
import {  MapPin, Pen, XIcon, MapPinPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useEffect, useRef, useState } from "react";
import Map from "./map";
import { CalendarIcon } from "lucide-react"
import { Session } from "@/prisma/generated/prisma";
import * as React from "react"
import type { Photo } from "react-photo-album";
import { fa } from "zod/v4/locales";
import { CustomerInq } from "@/lib/types";
import BookingCardForm from "./booking-card-form";
import CoverImageGallery from "./cover-image-gallery";

export type TravelWithTripWithLocation = Travel & {
  trips: (Trip & {
    locations: Location[];
  })[];
};

interface ContentProps {
  travelPromise: Promise<TravelWithTripWithLocation | null>;
  sessionPromise: Promise<Session | null>;
}




export default function DetailContent({ travelPromise, sessionPromise }: ContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const travel = use(travelPromise);
  const session = use(sessionPromise) as Session | null;
  const [locations, setLocations] = useState<Location[]>([]);
  const [coverPhotos, setCoverPhotos] = useState<Photo[]>([]);

  const [customerInq, setCustomerInq] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    travelDate: "",
    numAdults: 1,
    numChildren: 0,
    message: "",
    pricePerPerson: travel?.pricePerPerson || 0,
    travelCost: travel?.pricePerPerson || 0,
    travelId: travel?.id || "",
  } as CustomerInq);

  const updateTravelCost = (numAdults: number, numChildren: number, pricePerPerson: number) => {
    const adultCost = numAdults * pricePerPerson;
    const childCost = numChildren * (pricePerPerson * 0.5); // Assuming children cost half    
    setCustomerInq({
      ...customerInq,
      numAdults,
      numChildren,
      travelCost: adultCost + childCost,
    });
  }
 


  if (!travel) {
    return <div> Travel not found.</div>;
  }

  useEffect(() => {
    const allLocations = travel.trips.flatMap((trip) => trip.locations);
    setLocations(allLocations);
    initCoverPhotos();
    
  }, [travel]);

  function initCoverPhotos() {
    if (travel && travel.coverImagesUrl.length) {
      let width = 800;
      let height = 400; 
      const photos = travel.coverImagesUrl.map((url, i) => {

        if (i % 5 === 0 || i % 5 === 1) {
          width = 400;
          height = 233; 
        } else {
          width = 200;
          height = 133; 
        }   

        return { src: url, width, height } as Photo;
      });

      setCoverPhotos(photos);      
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="w-full h-80 md:h-80 overflow-hidden rounded-xl shadow-lg relative">
          {travel && travel.coverImagesUrl && travel?.coverImagesUrl.length ? (
             <CoverImageGallery travel={travel} coverPhotos={coverPhotos}   />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 rounded-t-lg">
              <span className="text-gray-500">No Image</span>
            </div>
          )
          }
      </div>
   
      <div className="bg-white p-6 shadow rounded-lg relative z-1">
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
          <TabsContent value="overview" className="space-y-6 gap-6 relative z-1">
            <div className="grid grid-cols-3 z-2">
              <div className="my-6 md:col-span-2">
                <div className="">
                  <h1 className="text-4xl font-extrabold text-gray-900">
                    {" "}
                    {travel.title} 
                    { session && session.user?.role === "admin" ? <Link className="" href={`/travels/${travel.id}/update`}><Button className="ml-3 w-16" size="icon"  variant="outline"><Pen className="h-5 w-5" />Edit </Button></Link> : false }
                  </h1>
                  <p className="text-gray-500 mt-2">{travel.subTitle}</p>
                  <p className="text-gray-500 mt-1 flex"> <CalendarIcon className="h-5 w-5 mr-1" /> {travel.noOfTravelDays}</p>
                </div>
                
                <div className="my-4 text-gray-600 leading-relaxed mr-4">
                  {travel.description}
                </div>

              
                <div className="my-6">
                  <h3 className="text-lg font-medium mb-2">Included Trips
                  { session && session.user?.role === "admin" ? <Link className="" href={`/trips/0?travelId=${travel.id}`}><Button className="ml-3 w-24" size="icon"  variant="outline"><MapPinPlus className="h-5 w-5" />Add Trip </Button></Link> : false }
                  </h3>
                  <ul className="list-disc pl-5">
                    {travel && travel.trips.map(trip => (
                      <li key={trip.id} className="mb-2">
                        <span className="font-medium inline-flex items-center justify-center">{trip.title}&nbsp;{ session && session.user.role === "admin" ? <Link className="" href={`/trips/${trip.id}?travelId=${travel.id}`}> <Pen className="h-4 w-4" /></Link> : false }</span>  
                        <div>                          
                        <div className="flex items-start text-sm text-gray-500 mt-1">  
                          <MapPin className="h-5 w-5 mr-1 text-gray-500" />                         
                          {trip.locations.length && trip.locations.map((loc) => (
                            <span key={loc.id}>{loc.locationTitle},</span>
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
                    {/* Booking card form */}
                  <BookingCardForm customerInq={customerInq} updateTravelCost={updateTravelCost} travel={travel} />                  
              </div>
              
            </div> 
            
          </TabsContent>
          
          {/* ITINERARY */}
          <TabsContent value="itinerary" className="space-y-6">
            {travel.trips.length === 0 ? (
              <div className="text-center p-4">
                <p>No trips available for this travel package.</p>
              </div>
            ) : (
              <div>
                {travel.trips.map((trip) => (
                  <div key={trip.id} className="grid grid-cols-4 gap-2 h-64 mb-8 p-4">                    
                      <div className="col-span-2">
                        <h3 className="text-xl font-medium mb-2">{trip.title}</h3>
                        <p className="text-gray-500 mb-4">{trip.description}</p>
                      </div>
                      <div className="h-full w-full relative overflow-hidden rounded-lg shadow">
                        {trip.imageUrl ? (
                          <Image
                            src={trip.imageUrl}
                            alt={trip.title}
                            className="object-cover"
                            fill
                            // width={200}
                            // height={150}
                          />
                        ) : false }
                      </div>
                      <div className="h-full w-full rounded-lg overflow-hidden shadow">
                        {trip.locations.length > 0 ? (
                            <Map itineraries={trip.locations} />
                            // <SortableItinerary locations={trip.locations} tripId={trip.id} />
                        )
                        : false }
                      </div>
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
        <Link href={`/travels`}>
          <Button> Back to Travels</Button>
        </Link>
      </div>
    </div>
  );
}
