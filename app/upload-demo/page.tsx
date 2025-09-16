"use client";

import { useState } from "react";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadDemo() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedUrls(urls);
    console.log("Uploaded image URLs:", urls);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Multiple Image Upload Demo</CardTitle>
          <CardDescription>
            Upload multiple images using UploadThing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload
            onImagesUploaded={handleImagesUploaded}
            maxFiles={10}
          />

          {uploadedUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Image URLs:</h3>
              <pre className="bg-slate-100 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(uploadedUrls, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
