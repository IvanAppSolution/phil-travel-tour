"use client";

import { Location, Travel, Trip } from "@/prisma/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Pen, XIcon, MapPinPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useEffect, useRef, useState } from "react";
import Map from "./map";
import SortableItinerary from "./sortable-itinerary";
import { User } from "@/auth"
import { RenderImageContext, RenderImageProps, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import type { Photo } from "react-photo-album";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {Cloudinary} from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { set } from "zod";

export type TravelWithTripWithLocation = Travel & {
  trips: (Trip & {
    locations: Location[];
  })[];
};

interface ContentProps {
  travelPromise: Promise<TravelWithTripWithLocation | null>;
  user: User | undefined;
}

type GalleryPhoto = {
  original: string;
};


export default function DetailContent({ travelPromise, user }: ContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const travel = use(travelPromise);
  const [locations, setLocations] = useState<Location[]>([]);
  const [coverPhotos, setCoverPhotos] = useState<Photo[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const imageGalleryRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(undefined as number | undefined);
  

  const onClickHandler = (index:number) => {
    console.log("clicked image index: ", index);
    console.log("imageGalleryRef: ", imageGalleryRef);
    if (imageGalleryRef.current) {
      setSlideIndex(index)
      // @ts-ignore
      imageGalleryRef.current.fullScreen();
    }
  };

  const handleOpenGallery = () => {setIsOpenGallery(true); initGalleryPhotos();};
  const handleCloseGallery = () => setIsOpenGallery(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
    }
  });

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

  function initGalleryPhotos() {
    if (travel && travel.coverImagesUrl.length) {
      const photos = travel.coverImagesUrl.map((url, i) => {
        const imageId = url.split("/").pop()?.split(".")[0] || "";
        const fullSizeUrl = cld.image(imageId)
                            .quality('auto')
                            .format('auto')
                            // .resize(scale().width(100))
                            .toURL();
        return { original: fullSizeUrl };
      });
      // console.log("gallery photos: ", photos);
      setGalleryPhotos(photos);
    }

  }
  
  
  function renderNextImage({ alt = "", title, sizes }: RenderImageProps, { photo, width, height, index }: RenderImageContext) {
    // "https://res.cloudinary.com/deji2i8fj/image/upload/v1758254274/moalboal-sardine-run-700-4_y4p4uj.jpg",
    // const imageId = photo.src.split("/").pop()?.split(".")[0] || "";        
    // const imgSrc = cld.image(imageId)
    //                         .quality('auto')
    //                         .format('auto')
    //                         .resize(scale().width(400))
    //                         .toURL();
    // console.log("sizes: ", sizes);      
    // console.log("imgSrc: ", imgSrc);                     
    return (
      <div
        style={{
          width: width,
          position: "relative",
          aspectRatio: `${width} / ${height}`,
        }}
      >
        
        {/* <img style={{width:"100%", height:"100%", position:"absolute", inset:"0"}} src={imgSrc} alt={title} loading="lazy" onClick={()=>onClickHandler(index)} />                       */}
        <Image
          fill
          src={photo}
          alt={alt}
          title={title}
          sizes={sizes}
          placeholder={"blurDataURL" in photo ? "blur" : undefined}
        />
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="w-full h-80 md:h-80 overflow-hidden rounded-xl shadow-lg relative">
          {travel && travel.coverImagesUrl && travel?.coverImagesUrl.length ? (
            <div className="w-full grid grid-cols-2 gap-2 relative  ">
                <div className="group relative flex h-80  items-end overflow-hidden  bg-gray-100 shadow-lg">
                  <Image
                    src={travel.coverImagesUrl[0]}
                    alt={travel.title}
                    fill
                    sizes="(max-width: 672px) 100vw, 600px"
                    priority
                    className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    onClick={handleOpenGallery}
                  /> 
                </div>
                <div className="grid grid-flow-row grid-cols-2 gap-2">  
                  {travel.coverImagesUrl.slice(1, 5).map((url, idx) => {                  
                    return  <div key={idx} className="group relative items-end overflow-hidden bg-gray-100 shadow-lg max-w-xl">
                      <Image
                        key={idx}
                        src={url}
                        alt={travel.title}
                        fill
                        sizes="(max-width: 384px) 100vw, 300px"
                        priority
                        className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                        onClick={handleOpenGallery}
                    />
                    </div>
                  }
                 )}   
                </div>
                {galleryPhotos.length ? <ImageGallery  items={galleryPhotos} ref={imageGalleryRef} lazyLoad={true} showThumbnails={false} startIndex={slideIndex} showPlayButton={false} /> : null}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 rounded-t-lg">
              <span className="text-gray-500">No Image</span>
            </div>
          )
          }
        </div>
   
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
                  <h3 className="text-lg font-medium mb-2">Included Trips
                  { user && user.role === "admin" ? <Link className="" href={`/trips/0?travelId=${travel.id}`}><Button className="ml-3 w-24" size="icon"  variant="outline"><MapPinPlus className="h-5 w-5" />Add Trip </Button></Link> : false }
                  </h3>
                  <ul className="list-disc pl-5">
                    {travel && travel.trips.map(trip => (
                      <li key={trip.id} className="mb-2">
                        <span className="font-medium inline-flex items-center justify-center">{trip.title}&nbsp;{ user && user.role === "admin" ? <Link className="" href={`/trips/${trip.id}?travelId=${travel.id}`}> <Pen className="h-4 w-4" /></Link> : false }</span>  
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

                    {/* Add Booking Column */}
                  
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
        <Link href={`/trips`}>
          <Button> Back to Trips</Button>
        </Link>
      </div>

      
      <Dialog open={isOpenGallery} onOpenChange={setIsOpenGallery} >
        <DialogContent className="max-w-11/12 relative" showCloseButton={false}>
          <DialogOverlay className="bg-white z-0" />
          <DialogHeader className="z-1">
            <DialogTitle>Photos</DialogTitle>
            <DialogClose onClick={handleCloseGallery} className="absolute top-4 right-4" >
              <span className=" flex ">
              Close
              <XIcon className="h-6 w-6" />
              </span>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="h-9/12 w-full rounded-md border mb-4 border-none">            
              <RowsPhotoAlbum
                  photos={coverPhotos}
                  render={{ image: renderNextImage }}
                  defaultContainerWidth={1200}   
                  sizes={{
                    size: "1168px",
                    sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
                  }}
                />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    
    </div>  
    </>
    
  );
}
