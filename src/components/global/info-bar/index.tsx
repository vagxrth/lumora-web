'use client'

import VideoRecorderIcon from '@/components/icons/video-recorder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton } from '@clerk/nextjs'
import { Search, UploadIcon } from 'lucide-react'
import React from 'react'
import '@/styles/animations.css'

type Props = {}

const InfoBar = (props: Props) => {
  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search
          size={25}
          className="text-[#707070]"
        />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-6">
        <Button 
          className="relative bg-gradient-to-r from-[#9D9D9D] to-[#858585] hover:from-[#858585] hover:to-[#757575] active:from-[#757575] active:to-[#656565] 
          transition-all duration-200 flex items-center gap-2 px-6 shadow-md hover:shadow-lg
          animate-pulse-subtle before:absolute before:inset-0 before:rounded-md before:bg-white/20 before:animate-pulse-glow"
        >
          <div className="relative z-10">
            <VideoRecorderIcon />
          </div>
          <span className="flex items-center gap-2 relative z-10">Record</span>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}

export default InfoBar