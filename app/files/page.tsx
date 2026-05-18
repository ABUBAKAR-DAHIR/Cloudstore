"use client"
import Themer from '@/components/Themer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

async function getFiles(){
    try {
        const imagesRes = await fetch("/api/s3/files")
        const images = await imagesRes.json()

        return images.images
    } catch (error: any) {
        console.log("fetch error: ", error.message)
    }
}

function FilesPage() {
    const {data: images, isLoading, error} = useQuery({
        queryKey: ["files"],
        queryFn: getFiles
    })

    const router = useRouter()
    // const file = new File(10, "sdj", "sgsdg");
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [deleted, setDeleted] = useState<boolean>(false)

    const {theme} = useTheme()

    const removeFile = async(key: string) => {
        console.log("Deleting file...", key)
        setIsDeleting(true)
        try {
            const delRes = await fetch("/api/s3/delete", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    key: key
                })
            })

            if(delRes.ok){
                toast.success("File deleted successfully")
                setDeleted(true)
                router.refresh()
                window.location.reload()
            }
            else{
                toast.error("Failed to delete the file!")
            }
        } catch (error: any) {
            console.log("Frontend error: ", error.message)
            
            toast.error("Failed to delete the file!")
        }
        finally{
            setIsDeleting(false)
        }
    }
    
    return (
        <div>
            <div className='w-full px-4 py-6 flex justify-around items-center'>
                <Button className='flex cursor-pointer group' variant="link" onClick={() => router.back()}>
                    <ArrowLeft className='transition-all group-hover:-translate-x-1 duration-200'/>
                    <span>Go Back</span>
                <div>
                    {
                        theme === "light" ? <Image src="/logo.svg" width={55} height={55} alt='logo' />  :   <Image src="/logo-dark.svg" width={55} height={55} alt='logo' />               
                    }
                </div>
                </Button>
                <Themer />
            </div>
            <Card className='w-200 min-h-100 mx-auto mt-10 max-xl:w-4/5 mb-8'>
                <CardHeader>
                    <h1 className='text-2xl font-semibold capitalize text-center'>Uploaded images</h1>
                </CardHeader>

                <CardContent>
                    {
                        isLoading ?
                        <div>
                            {
                                Array.from({length:6}).map((_, i) => (
                                    <Skeleton key={i} className='w-full h-30 my-4'/>
                                ))
                            }
                        </div>
                        :
                        images && images.length > 0 ?
                        images.map((image: {name: string, imageUrl: string, key: string}) => (
                            <div key={image.imageUrl} className='flex flex-col items-center justify-center gap-y-4 min-w-55 border p-2'>
                                <div className="relative size-48 ">
                                    <Image src={image.imageUrl} alt={image.imageUrl} fill loading="eager" />

                                    <Dialog>
                                        <DialogTrigger>
                                            <div  className={cn('absolute top-0 right-0  size-5 -translate-y-2.5 translate-x-2.5 z-2 text-black bg-white p-1 flex items-center justify-center rounded-full border cursor-pointer  duration-200 group', !isDeleting && "hover:size-5.5" )}>
                                                {
                                                    isDeleting ?
                                                    <Spinner className = ""/>
                                                    :
                                                    <X className='group-hover:text-red-700'/>
                                                }
                                            </div>
                                        </DialogTrigger>

                                        <DialogContent className='py-8'>
                                            <DialogHeader>
                                                <h1 className='font-bold uppercase text-center p-2 border rounded-md mx-4 mr-6 bg-red-500/10'>File deletion</h1>
                                            </DialogHeader>
                                            
                                            <div className='relative'>

                                                <div className={cn("relative", isDeleting && "opacity-10")}>
                                                    <h2 className='font-semibold text-center text-[16px]'>Are you sure you want to delete the file!</h2>
                                                    <p className='text-center my-4 text-[13px] mb-8'>The file will be permanently deleted if you proceed with the process. you can cancel it if you want.</p>

                                                    <div className="flex justify-around mt-4">
                                                        <DialogClose>
                                                            <Button variant="secondary" className='cursor-pointer capitalize py-5 px-8'>Go back</Button>
                                                        </DialogClose>
                                                        <Button variant="destructive" className='cursor-pointer capitalize py-5 px-8 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white duration-300 dark:hover:bg-red-500' onClick={() => removeFile(image.key)} >Delete</Button>
                                                    </div>
                                                </div>
                                                
                                                {
                                                    isDeleting && (
                                                        <div className='absolute inset-0 w-full h-full flex items-start justify-center'>
                                                            <Spinner className='size-35'strokeWidth={1}/>
                                                        </div>
                                                    )
                                                }

                                                
                                                <p className={cn('font-semibold  text-[16px] capitalize text-center my-4 duration-500 transition-all ease-in-out', isDeleting ? "w-full h-full opacity-100" : "w-0 h-0 opacity-0")}>deleting file...</p>
                                                

                                            </div>

                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <p className='text-sm truncate text-center capitalize'>{image.name}</p>
                            </div>
                        ))
                        : 

                        <div className='flex w-full h-full items-center justify-center'>
                            <p className='text-center text-[16px] md:my-20'>No images Uploaded yet</p>
                        </div>

                        
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default FilesPage