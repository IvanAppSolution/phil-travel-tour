import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { UTFiles } from "uploadthing/server";
import Resizer from "react-image-file-resizer";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
    
  // Define a multiple image uploader
  multipleImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10
    }
  })
    .middleware(async ({ req, files }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      const fileOverrides = files.map((file) => {
      // const newName = file.name.replace(/\.[^/.]+$/, "") + "-" + Date.now();
      const myIdentifier = session.user?.id;
        return { ...file, customId: myIdentifier };
      });

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id, [UTFiles]: fileOverrides  };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Multiple upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

async function handleImageUpload (event:any) {
  try {
    const file = event.target.files[0];
    const resizedImageUri = await resizeFile300(file);
    // console.log(resizedImageUri); // Use the resized image URI
  } catch (err) {
    console.error(err);
  }
};

function resizeFile300 (file: File) {
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,        // The image file to resize
      300,         // maxWidth
      300,         // maxHeight
      "JPEG",      // compressFormat (e.g., "JPEG", "PNG", "WEBP")
      80,         // quality (0-100)
      0,           // rotation
      (uri) => {   // Callback function with the resized image URI
        resolve(uri);
      },
      "base64"     // outputType (e.g., "base64", "blob")
    );
  })
};

function resizeFile600 (file: File) {
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,        // The image file to resize
        600,         // maxWidth
        600,         // maxHeight
        "JPEG",      // compressFormat (e.g., "JPEG", "PNG", "WEBP")
        80,         // quality (0-100)
        0,           // rotation
        (uri) => {   // Callback function with the resized image URI
          resolve(uri);
        },
        "base64"     // outputType (e.g., "base64", "blob")
      );
    })
  };
