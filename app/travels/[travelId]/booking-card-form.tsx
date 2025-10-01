"use client";
import { parseDate } from "chrono-node"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { CalendarIcon, UserRound, Baby, UsersRound, Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingCardForm({ customerInq, updateTravelCost, travel }: { customerInq: any, updateTravelCost:any, travel: any }) {
 
    // Calendar variables
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [month, setMonth] = React.useState<Date | undefined>(date)

  function formatDate(date: Date | undefined) {
    if (!date) {
      return ""
    }
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <h3 className=" text-3xl font-bold" style={{ fontFamily: 'var(--font-sans)' }}>${customerInq.travelCost}</h3>
            <span className="  text-sm text-gray-500 ">per person</span>
          </div>
          <div className="h-px bg-gray-300 my-2 -mt-1"></div>

          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <CalendarIcon className="h-5 w-5 mr-1 text-gray-500 inline" />   
              <label className="item-end text-sm text-gray-700 mb-1 mr-2 font-medium">
                Date: 
              </label>
            </div>
            <div className="w-3/4 relative flex gap-2">
              <Input
                id="date"
                value={value}
                placeholder="Schedule Date"
                className="bg-background pr-10"
                onChange={(e) => {
                  setValue(e.target.value)
                  const date = parseDate(e.target.value)
                  if (date) {
                    setDate(date)
                    setMonth(date)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setOpen(true)
                  }
                }}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="ghost"
                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                  >
                    <CalendarIcon className="size-3.5" />
                    <span className="sr-only">Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                  <Calendar 
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={(date) => {
                      setDate(date)
                      setValue(formatDate(date))
                      setOpen(false)
                    }}
                    required={false}
                  />
                </PopoverContent>
              </Popover>
            </div> 
          </div>

          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <UserRound className="h-5 w-5 mr-1 text-gray-500 inline" />   
              <label className="item-end text-sm text-gray-700 mb-1 mr-2 font-medium">
                Name: 
              </label>
            </div>
            <Input
              className="w-3/4"
              name="name"
              placeholder=""  
              type="text"
            />
          </div>  

          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <Mail className="h-5 w-5 mr-1 text-gray-500 inline" />   
              <label className="item-end text-sm text-gray-700 mb-1 mr-2 font-medium">
                Email: 
              </label>
            </div>
            <Input
              className="w-3/4"
              name="email"
              placeholder=""
              type="email"
            />
          </div>  

          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <Phone className="h-5 w-5 mr-1 text-gray-500 inline" />   
              <label className="item-end text-sm text-gray-700 mb-1 mr-2 font-medium">
                Phone: 
              </label>
            </div>
            <Input
              className="w-3/4"
              name="phone"
              placeholder=""
            />
          </div>  

          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <Globe className="h-4 w-4  text-gray-500 inline" />   
              <label className="item-end text-xs text-gray-700  font-medium">
                Nationality: 
              </label>
            </div>
            <Input
              className="w-3/4"
              name="nationality"
              placeholder=""
            />
          </div>  

          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <UsersRound className="h-5 w-5 mr-1 text-gray-500 inline" />   
              <label className="item-end text-sm text-gray-700 mb-1 mr-2 font-medium">
                Adult: 
              </label>
            </div>
            <div className="w-3/4">
              <Input
                className="w-1/2"
                name="numAdults"
                placeholder=""  
                defaultValue={1}  
                type="number"
                min="0" max="20"
                onChange={(e) => updateTravelCost(Number(e.target.value) , customerInq.numChildren, travel.pricePerPerson || 0)}
              />
            </div>
          </div>   
          <div className="flex items-center  ">
            <div className="w-1/3 flex ">
              <Baby className="h-5 w-5 mr-1 text-gray-500 inline" />   
              <label className="item-end text-sm text-gray-700 mb-1 mr-2 font-medium">
                Child: 
              </label>
            </div>
            <div className="w-3/4">
              <Input
                className="w-1/2"
                name="numChildren"
                placeholder=""  
                defaultValue="0"  
                type="number"
                min="0" max="20"
                onChange={(e) => updateTravelCost(customerInq.numAdults, Number(e.target.value), travel.pricePerPerson || 0)}
              />
            </div>  
          </div>  

          <div className="flex items-center  ">
              <Button className="w-full cursor-pointer" > Book Now </Button>
          </div>                  
        </div>
      </CardContent>
    </Card>
  )
}