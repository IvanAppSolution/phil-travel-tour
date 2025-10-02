"use client";
import { RenderImageContext, RenderImageProps, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {Cloudinary} from "@cloudinary/url-gen";
// @ts-expect-error: react-image-gallery has incomplete type definitions for ref handling
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";
import { useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { Travel } from "@/prisma/generated/prisma";
import type { Photo } from "react-photo-album";

type GalleryPhoto = {
  original: string;
};

export default function CoverImageGallery({ travel, coverPhotos = []  }: { travel: Travel, coverPhotos?: Photo[] }) {

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  // const [isOpenFullGallery, setIsOpenFullGallery] = useState(false);
  const imageGalleryRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(undefined as number | undefined);


  const onClickOpenFullscreenHandler = (index:number) => {    
    if (imageGalleryRef.current) {
      // setIsOpenFullGallery(true);
      setSlideIndex(index)
      // @ts-expect-error: ImageGallery instance method 'fullScreen' is not included in type definitions
      imageGalleryRef.current.fullScreen();
    }
  };

  // const onClickCloseFullscreenHandler = () => {
  //   setIsOpenFullGallery(false);
  // };

  const handleOpenGallery = () => { setIsOpenGallery(true); initGalleryPhotos();};
  const handleCloseGallery = () => setIsOpenGallery(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
    }
  });
  
  function renderNextImage({ alt = "", title, sizes }: RenderImageProps, { photo, width, height, index }: RenderImageContext) {                   
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
          onClick={()=>onClickOpenFullscreenHandler(index)} 
        />
      </div>
    );
  }

  
  function initGalleryPhotos() {
    if (travel && travel.coverImagesUrl.length) {
      const photos = travel.coverImagesUrl.map((url) => {
      const imageId = url.split("/").pop()?.split(".")[0] || "";
      const fullSizeUrl = cld.image(imageId)
                          .quality('auto')
                          .format('auto')
                          // .resize(scale().width(100))
                          .toURL();
        return { original: fullSizeUrl };
      });

      setGalleryPhotos(photos);
    }

  }

  return (
    <div>
        <div className="w-full grid grid-cols-2 gap-2 relative z-1 bg-white">
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
      </div>
      <div className="absolute inset-0 z-0" > 
        <ImageGallery className="z-0" items={galleryPhotos} ref={imageGalleryRef} showThumbnails={false} startIndex={slideIndex} showPlayButton={false} />
      </div> 
      {/* Gallery Dialog */}
      <Dialog open={isOpenGallery} onOpenChange={setIsOpenGallery}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0 z-1" showCloseButton={false}>
          <DialogOverlay className="bg-white z-0" />
          <DialogHeader className="z-1">
            <DialogTitle>Photos</DialogTitle>
            <DialogClose onClick={handleCloseGallery} className="absolute top-10 right-14">
              <span className="flex items-center gap-2">
                Close
                <XIcon className=" " />
              </span>
            </DialogClose>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(90vh-30px)] w-full">
            <div className="pb-6 z-100">
              <RowsPhotoAlbum
                photos={coverPhotos}
                render={{ image: renderNextImage }}
                defaultContainerWidth={1200}
                sizes={{
                  size: "1168px",
                  sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
                }}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}