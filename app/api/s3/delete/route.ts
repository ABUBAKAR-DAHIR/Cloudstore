import "dotenv/config"
import { S3 } from "@/lib/s3Client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export async function DELETE(request: Request){
    try {
        const {key} = await request.json()
    
        if(!key){
            return NextResponse.json({error: "Missing field(s)", message: "Key is required!"}, {status: 400})
        }

        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key
        })

        await S3.send(deleteCommand)

        return NextResponse.json({message: "File deleted successfully!"}, {status: 200})

        
    } catch (error: any) {
        console.log("SERVER ERROR: ", error.message)
        return NextResponse.json({error: "Server side error", message: "Unexpected error ocurred in the server"}, {status: 500})
    }
}