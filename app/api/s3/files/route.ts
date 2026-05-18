import "dotenv/config"
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { S3 } from "@/lib/s3Client"

export async function GET(request: Request){
    try {
        const getCommand = new ListObjectsV2Command({
            Bucket: process.env.S3_BUCKET_NAME!
        })

        const imageBlobs = await S3.send(getCommand)

        const images = imageBlobs.Contents?.map(imageBlob => {
            const key = encodeURIComponent(imageBlob.Key!)
            // const imageUrl = `${process.env.AWS_ENDPOINT_URL_S3!}/${process.env.S3_BUCKET_NAME!}/${key}`
            const imageUrl = `https://uploader-bucket.t3.tigrisfiles.io/${key}`
            console.log(imageBlob)
            console.log(imageBlob.Key!)

            const name = imageBlob.Key!.slice(37) 

            const rawKey = imageBlob.Key!

            const image = {name, imageUrl, key: rawKey}

            console.log(image)
            
            return image
        })

        return NextResponse.json({images}, {status: 200})
        

    } catch (error: any) {
        console.log("BACKEND ERROR: ", error.message)
        return NextResponse.json({error: "Server side error", message: "Unexpected error ocurred in the server"}, {status: 500})
 }
}