"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Travel } from "@/prisma/generated/prisma";
import { Session } from "@/auth";
import { use } from "react";
import TravelCard from "@/components/travel-card";

type TripsParam = {
 travelsPromise: Promise<Travel[] | null>
 sessionPromise: Promise <Session | null>
} 

export default function Content({ travelsPromise, sessionPromise }: TripsParam) {
  const travels = use(travelsPromise) || null;
  const session = use(sessionPromise) || null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight"> Explore Trips</h1>
      </div>

      <div>
        { session && session.user.role === "admin" ? <Button className="my-4" asChild><Link href="/travels/new">New Travel </Link></Button> : false }
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 col-gap-4 gap-6">
          {travels && travels.map((travel, key) => (
            <TravelCard key={key} travel={travel} />
          ))}
        </div>        
      </div>
    </div>
  )
}
