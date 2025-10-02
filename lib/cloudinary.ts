import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async (): Promise<void> => {
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
    })
}

export default connectCloudinary
