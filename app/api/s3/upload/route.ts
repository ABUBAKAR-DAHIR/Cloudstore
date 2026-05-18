import "dotenv/config"
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from "next/server"
import z, { number, string } from "zod"
import {v4 as uuidv4 } from "uuid"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/s3Client";


const uploadSchema = z.object({
    fileName: string(),
    contentType: string(),
    size: number()
})

export async function POST(request: Request){
    try {
        const body = await request.json()
    
        const validation = uploadSchema.safeParse(body)
    
        if(!validation.success){
            return NextResponse.json({error: "Invalid or missing elements", message: "Some fields are either missing or incorrect format"}, {status: 400});
        }
    
        const {fileName, contentType, size} = validation.data
    
        const uniqueKey = `${uuidv4()}-${fileName}`
    
        const putCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: uniqueKey,
            ContentLength: size,
            ContentType: contentType
        })
    
        const presignedUrl = await getSignedUrl(S3, putCommand, {
            expiresIn: 300 // 5 mins
        })

        console.log("presignedUrl: ", presignedUrl)

        return NextResponse.json({presignedUrl, key: uniqueKey}, {status: 200})
        
    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json({error: "Internal server error", message: "Unexpected server side error ocurred"}, {status: 500});
    }
}