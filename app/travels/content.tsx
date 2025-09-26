"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import type { Travel } from "@/prisma/generated/prisma";
import { Session } from "@/auth";
import { use } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";


type TripsParam = {
 travelsPromise: Promise<Travel[] | null>
 sessionPromise: Promise <Session | null>
} 

export default function Content({ travelsPromise, sessionPromise }: TripsParam) {
  const travels = use(travelsPromise) || null;
  const session = use(sessionPromise) || null;
  // console.log('travels', travels);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight"> Explore Trips</h1>
      </div>

      <div>
        { session && session.user.role === "admin" ? <Button className="my-4" asChild><Link href="/travel/new">New Travel </Link></Button> : false }
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 col-gap-4 gap-6">
          {travels && travels.map((travel, key) => (
            <Link key={key} href={`/travels/${travel.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden pt-0">
                <CardHeader className="p-0 overflow-hidden h-56 w-full relative">
                  <Image
                    src={travel.imageUrl || ''}
                    alt={travel.title}
                    className="object-cover"
                    priority
                    fill
                  />
                </CardHeader>
                <CardContent>
                  <div className="cardTitle text-2xl font-bold">{travel.title}</div>
                  <div className="CardSubTitle flex items-start text-sm text-gray-500 ">
                    <MapPin className="h-5 w-5 mr-1 text-gray-500" /> 
                    {travel.shortDescription}
                  </div>
                  <div className="cardDescription text-sm text-gray-500">
                    {travel.noOfTravelDays}
                  </div>
                  <div className="cardDescription h-20 text-sm text-gray-700 my-4 line-clamp-4 overflow-hidden">
                    {travel.description}
                  </div>
                  <div className="cardPrice border rounded-sm p-4 mt-6 h-24  flex flex-col items-center justify-center">
                      <div className="flex align-top">
                      <span className="font-semibold mr-1 text-lg ">$</span>  
                      <span className="text-4xl font-bold">{travel.pricePerPerson?.toLocaleString('en-US')}</span>
                    </div>
                    <div className="text-sm mb-1"> {travel.priceDescription} </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>        
      </div>
    </div>
  )
}
