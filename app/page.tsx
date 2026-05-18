"use client"
import Themer from '@/components/Themer'
import { Button } from '@/components/ui/button'
import Uploader from '@/components/uploader'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {  useRouter } from 'next/navigation'
import React from 'react'

function HomePage() {
  const router = useRouter()
  return (
    <div>
      <div className='w-full flex items-end justify-end px-10 py-6 max-md:py-4'>
        <Button className='flex cursor-pointer group ' variant="link" onClick={() => router.push("/files")}>
          <span> Go to Uploaded files </span>
          <ArrowRight className='transition-all group-hover:translate-x-1 duration-200'/>
        </Button>
        <Themer />
      </div>
      <Uploader />
    </div>
  )
}

export default HomePage