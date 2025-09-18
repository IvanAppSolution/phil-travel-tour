import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  // console.log("Params to sign:", paramsToSign);

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
  );

  return Response.json({ signature });
}
