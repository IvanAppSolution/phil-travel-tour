"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function TravelCard({ travel, key }: { travel: any, key: number }) {

  return (
    <Link key={key} href={`/travels/${travel.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden pt-0 gap-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
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
          <div className="cardDescription text-sm text-gray-500">
            {travel.noOfTravelDays}
          </div>
          <div className="cardTitle text-2xl font-bold">{travel.title}</div>
          <div className="CardSubTitle flex items-start text-sm text-gray-500 ">
            <MapPin className="h-5 w-5 mr-1 text-gray-500" /> 
            {travel.subTitle}
          </div>
          
          <div className="cardDescription h-20 text-sm text-gray-700 my-4 line-clamp-4 overflow-hidden">
            {travel.description}
          </div>
          
          <div className="flex  items-baseline  font-bold text-gray-900">
            <p style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="text-lg font-semibold ">$</span>  
              <span className="text-lg font-semibold mr-1">{travel.pricePerPerson?.toLocaleString('en-US')}</span>
            </p>  
            <span className="font-light text-xs text-gray-500 mb-1"> per person </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
