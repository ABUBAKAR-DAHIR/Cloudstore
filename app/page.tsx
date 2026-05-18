"use client"
import Themer from '@/components/Themer'
import { Button } from '@/components/ui/button'
import Uploader from '@/components/uploader'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import {  useRouter } from 'next/navigation'
import React from 'react'

function HomePage() {
  const router = useRouter()
  const {theme} = useTheme()
  return (
    <div>
      <div className='w-full flex items-center justify-between px-10 py-6 max-md:py-4'>
        <div>
          {
              theme === "light" ? <Image src="/logo.svg" width={55} height={55} alt='logo' />  :   <Image src="/logo-dark.svg" width={55} height={55} alt='logo' />               
          }
        </div>
        <div className='flex '>
          <Button className='flex cursor-pointer group ' variant="link" onClick={() => router.push("/files")}>
            <span> Go to Uploaded files </span>
            <ArrowRight className='transition-all group-hover:translate-x-1 duration-200'/>
          </Button>
          <Themer />
        </div>
      </div>
      <Uploader />
    </div>
  )
}

export default HomePage