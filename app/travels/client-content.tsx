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
import type { Travel, Trip } from "@/prisma/generated/prisma";
import { Session, User } from "@/auth";
import { use } from "react";
import Image from "next/image";


type TripsParam = {
 travelsPromise: Promise<Travel[] | null>
 sessionPromise: Promise <Session | null>
} 

export default function ClientContent({ travelsPromise, sessionPromise }: TripsParam) {
  const travels = use(travelsPromise) || null;
  const session = use(sessionPromise) || null;
  console.log('travels', travels);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight"> Explore Trips</h1>
      </div>

      <div>
        { session && session.user.role === "admin" ? <Button className="my-4" asChild><Link href="/travel/new">New Travel </Link></Button> : false }
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {travels && travels.map((travel, key) => (
            <Link key={key} href={`/travels/${travel.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <Image
                    src={travel.imageUrl || ''}
                    alt={travel.title}
                    className="object-cover"
                    width={200}
                    height={150}
                    priority
                  />
                </CardHeader>
                <CardContent>
                  <div className="cardTitle">{travel.title}</div>
                  <div className="CardSubTitle">{travel.subTitle}</div>
                  <div className="cardDescription">
                    {travel.description}
                  </div>
                  <div className="cardPrice">
                    {travel.pricePerPerson ? `$${travel.pricePerPerson} per person` : 'Price on request'}
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
