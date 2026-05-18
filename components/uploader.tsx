"use client"
import { useCallback, useState } from 'react'
import {FileRejection, useDropzone} from "react-dropzone"
import { Card } from './ui/card'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {v4 as uuidv4} from "uuid"
import axios from 'axios'
import { X } from 'lucide-react'
import { SP } from 'next/dist/shared/lib/utils'
import { Spinner } from './ui/spinner'

function Uploader() {

    const [files, setFiles] = useState<Array<{
        id: string
        file: File
        key: string
        uploading: boolean
        progress: number
        isDeleting: boolean
        error: boolean
        objectUrl: string
    }>>([])

    const uploadFile = async(file: File) => {
        console.log("uploading...", file)

        setFiles((prevFiles) => [
            ...prevFiles.map((prevFile) => prevFile.file === file ? {...prevFile, uploading: true} : prevFile)
        ])

        try {
            const presignedUrlRes = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size
                })
            })

            const res = await presignedUrlRes.json()

            if(!presignedUrlRes.ok){
                toast.error("Failed to generate presigned URL!")
                console.log(res)
            }

            const {presignedUrl, key} = res

            setFiles((prevFiles) => (
                prevFiles.map(f => f.file === file ? {...f, key} : f)
            ))

            const upload = await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type" : file.type
                },

                onUploadProgress(progressEvent) {
                    const progress = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 100)

                    setFiles((prevFiles) => (
                        prevFiles.map(f => f.file === file ? {...f, progress: progress} : f)
                    ))
                    
                },
            })

            if(upload.status === 200 || upload.status === 204){
                toast.success("File uploaded successfully!")

                setFiles((prevFiles) => (
                    prevFiles.map(f => f.file === file ? {...f, uploading: false, error: false} : f)
                ))
            }

            else {
                toast.error("Failed to upload File!")

                setFiles((prevFiles) => (
                    prevFiles.map(f => f.file === file ? {...f, uploading: false, error: true, progress: 0} : f)
                ))

                console.log(upload.data, upload.statusText)
            }

        } catch (error : any) {
            console.error("Frontend fetch error: ", error.message)
            toast.error("Failed to upload!")

            toast.error("Failed to upload File!")

            setFiles((prevFiles) => (
                prevFiles.map(f => f.file === file ? {...f, uploading: false, error: true, progress: 0} : f)
            ))
        }


    }   

    const removeFile = async(file: File) => {
        console.log("Deleting file...", file.name)
        setFiles((prevFiles) => (
            prevFiles.map(f => f.file === file ? {...f, isDeleting: true} : f)
        ))

        try {
            const delRes = await fetch("/api/s3/delete", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    key: files.find(f => f.file === file)?.key
                })
            })

            if(delRes.ok){
                toast.success("File deleted successfully")
                setFiles((prevFiles) => (
                    prevFiles.map(f => f.file === file ? {...f, isDeleting: false} : f)
                ))
                
                files.map(f => f.file === file ? URL.revokeObjectURL(f.objectUrl) : f)
                setFiles((prevFiles) => prevFiles.filter(f => f.file !== file))
            }
            else{
                setFiles((prevFiles) => (
                    prevFiles.map(f => f.file === file ? {...f, isDeleting: false, error: true} : f)
                ))
                toast.error("Failed to delete the file!")
            }
        } catch (error: any) {
            console.log("Frontend error: ", error.message)
            setFiles((prevFiles) => (
                prevFiles.map(f => f.file === file ? {...f, isDeleting: false, error: true} : f)
            ))
            toast.error("Failed to delete the file!")
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        console.log("accepted files: ", acceptedFiles)
        if(acceptedFiles.length > 0){

            setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles.map((file: File) => ({
                    id: uuidv4(),
                    file: file,
                    key: "string",
                    uploading: false,
                    progress: 0,
                    isDeleting: false,
                    error: false,
                    objectUrl: URL.createObjectURL(file)
                }))
            ])

            acceptedFiles.map(uploadFile)
        }
    }, [])

    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        
        if(fileRejections.length > 0){
            const fileTooBig = fileRejections.find((fileRejection: FileRejection) => fileRejection.errors[0].code === "file-too-large")
            const tooManyFiles = fileRejections.find((fileRejection: FileRejection) => fileRejection.errors[0].code === "too-many-files")
            const invalidFileType = fileRejections.find((fileRejection: FileRejection) => fileRejection.errors[0].code === "file-invalid-type")
            
            
            if(fileTooBig){
                toast.error("File too big of a size!")
            }
            
            if(tooManyFiles || files.length > 5){
                toast.error("You can only upload 5 images at a time!")
            }

            if(invalidFileType){
                toast.error("You can only upload images")
            }
            
            console.log("file rejections: ", fileRejections)
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        onDropRejected,
        maxFiles: 5,
        maxSize: 1024 * 1024 * 5,
        accept: {
            "image/*": []
        }
    })
    return (
        <div className='w-full h-full min-h-screen py-10 flex gap-y-8 flex-col items-center justify-center'>
            <h1 className='text-3xl max-sm:text-2xl font-semibold capitalize text-center'>upload files with s3 📁</h1>
            <Card {...getRootProps()} className={cn('p-4 w-180 h-90 max-md:w-4/5 max-md:h-80 max-md:px-8 flex items-center justify-center gap-y-4 border-2 shadow-none hover:border-primary duration-500', isDragActive ? "border-2 border-primary bg-primary/10" : "border-dashed")}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p className='text-center'>Drop the files here ...</p> :
                    (
                        <div className='flex flex-col items-center justify-center gap-y-4'>
                            <p className='text-center'>Drag 'n' drop some files here, or click to select files</p>
                            <Button className='py-6 px-8 capitalize border-2 border-primary hover:bg-transparent hover:text-primary duration-500 cursor-pointer'>select files</Button>
                        </div>
                    )
                }

            </Card>

            <div className='w-180 max-md:w-4/5 h-full px-4 grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-4'>
                {
                    files.map(file => (
                            <div key={file.id} className=' size-[100px] md:size-24 xl:size-28 my-4 max-md:my-2'>
                                <div className="relative size-[100px] md:size-24 xl:size-28 border-2 rounded-md border-black dark:border-white">
                                    <Image src={file.objectUrl} alt={file.file.name} fill className='rounded-md aspect-square'/>

                                    {
                                        file.uploading && <div className='absolute inset-0 z-2 bg-black/60 w-full h-full rounded-md'/>
                                    }
                                    {
                                        file.uploading && <p className='text-sm z-4 absolute inset-0 flex items-center justify-center text-white'>{file.progress}%</p>
                                    }
                                    
                                    {
                                        !file.uploading && file.progress === 100 &&(
                                            <div onClick={() => removeFile(file.file)} className={cn('absolute top-0 right-0  size-5 -translate-y-2.5 translate-x-2.5 z-2 text-black bg-white p-1 flex items-center justify-center rounded-full border cursor-pointer  duration-200 group', !file.isDeleting && "hover:size-5.5" )}>
                                                {
                                                    file.isDeleting ?
                                                    <Spinner className = ""/>
                                                    :
                                                    <X className='group-hover:text-red-700'/>
                                                }
                                            </div>
                                        ) 
                                    }
                                </div>
                                <p className='text-sm truncate text-center capitalize'>{file.file.name}</p>
                            </div>
                    ))
                
                }

            </div>
        </div>
    )
}

export default Uploader