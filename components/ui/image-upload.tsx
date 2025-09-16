"use client";

import { useEffect, useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/upload-thing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MultipleImageUploadProps {
  onImagesUploaded?: (urls: string[]) => void;  
  maxFiles?: number;
  defaultImages?: string[];
}

export function MultipleImageUpload({
  onImagesUploaded,
  maxFiles = 10,
  defaultImages = [],
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (res: { url: string }[]) => {
    const urls = res.map((file) => file.url);
    setImages((prevImages) => [...prevImages, ...urls]);
    setIsUploading(false);
    if (onImagesUploaded) {
      onImagesUploaded([...images, ...urls]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    
    if (onImagesUploaded) {
      onImagesUploaded(images.filter((_, index) => index !== indexToRemove));
    }
  };

  useEffect(() => {
    setImages(defaultImages);
  }, [defaultImages]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <Image
              src={imageUrl || ''}
              alt={`Uploaded image ${index + 1}`}
              width={300}
              height={300}
              className="rounded-lg object-cover w-full h-48"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {images.length < maxFiles && (
        <div className="mt-4">
          {isUploading ? (
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <UploadDropzone
                endpoint="multipleImageUploader"
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={(res) => handleUploadComplete(res)}
                onUploadError={(error) => {
                  console.error("Error uploading:", error);
                  setIsUploading(false);
                }}
              />
              <div className="mt-2">
                <p className="text-sm text-gray-500 text-center">
                  {images.length > 0
                    ? `${images.length}/${maxFiles} images uploaded`
                    : "No images uploaded yet"}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function MultipleImageUploadButton({
  onImagesUploaded,
  defaultImages = [],
  maxFiles = 10,
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages);

  const handleUploadComplete = (res: { url: string }[]) => {
    const urls = res.map((file) => file.url);
    setImages((prevImages) => [...prevImages, ...urls]);
    if (onImagesUploaded) {
      onImagesUploaded([...images, ...urls]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    
    if (onImagesUploaded) {
      onImagesUploaded(images.filter((_, index) => index !== indexToRemove));
    }
  };

  useEffect(() => {
    setImages(defaultImages);
  }, [defaultImages]);

  return (
    <div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={imageUrl || ''}
                alt={`Uploaded image ${index + 1}`}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-48"
              />
              <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            </div>
          ))}
        </div>
      )}
      {images.length < maxFiles && (  
      <UploadButton
        className="mt-4"
        endpoint="multipleImageUploader"
        onClientUploadComplete={(res) => handleUploadComplete(res)}
        onUploadError={(error) => {
          console.error("Error uploading:", error);
        }}
      />
      )}
    </div>
  );
}

export function SingleImageUploadButton({
  onImagesUploaded,
  defaultImages = [],
  maxFiles = 1,
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages);

  const handleUploadComplete = (res: { url: string }[]) => {
    const urls = res.map((file) => file.url);
    setImages((prevImages) => [...prevImages, ...urls]);
    if (onImagesUploaded) {
      onImagesUploaded([...images, ...urls]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    
    if (onImagesUploaded) {
      onImagesUploaded(images.filter((_, index) => index !== indexToRemove));
    }
  };

  useEffect(() => {   
    setImages(defaultImages);    
  }, [defaultImages]);

  return (
    <div>
      {images.length > 0 && images[0] !== '' && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={imageUrl || ''}
                alt={`Uploaded image ${index + 1}`}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-48"
              />
              <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            </div>
          ))}
        </div>
      )}
      {images.length < maxFiles && (  
      <UploadButton
        className="mt-4"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => handleUploadComplete(res)}
        onUploadError={(error) => {
          console.error("Error uploading:", error);
        }}
      />
      )}
    </div>
  );
}
