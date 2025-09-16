"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type { Trip } from "@/prisma/generated/prisma";
import { Session, User } from "@/auth";
import { use } from "react";
import Image from "next/image";


type TripsParam = {
 tripsPromise: Promise<Trip[] | null>
 sessionPromise: Promise <Session | null>
} 

export default function ClientContent({ tripsPromise, sessionPromise }: TripsParam) {
  const trips = use(tripsPromise) || null;
  const session = use(sessionPromise) || null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight"> Explore Trips</h1>
      </div>

      <div>
        { session && session.user.role === "admin" ? <Button className="my-4" asChild><Link href="/trips/new">New Trip </Link></Button> : false }
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {trips && trips.map((trip, key) => (
            <Link key={key} href={`/trips/${trip.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <Image
                              src={trip.imageUrl || ''}
                              alt={trip.title}
                              className="object-cover"
                              width={200}
                              height={150}
                              priority
                            />
                </CardHeader>
                <CardContent>
                  <div className="cardTitle">{trip.title}</div>
                  <div className="CardSubTitle">{trip.subTitle}</div>
                  <div className="cardDescription">
                    {trip.description}
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
