'use client'

import VideoRecorderIcon from '@/components/icons/video-recorder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton } from '@clerk/nextjs'
import { Search, UploadIcon } from 'lucide-react'
import React from 'react'
import '@/styles/animations.css'

const InfoBar = () => {
  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search
          size={25}
          className="text-[#707070]"
        />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-6">
        <Button 
          className="relative text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl
          transform transition-all duration-300 ease-out
          hover:scale-105 hover:-translate-y-1 active:scale-95
          animate-pulse-subtle
          before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r 
          before:from-transparent before:via-white/20 before:to-transparent
          before:translate-x-[-100%] hover:before:translate-x-[100%]
          before:transition-transform before:duration-700 before:ease-out
          overflow-hidden group"
          style={{
            background: 'linear-gradient(to right, #007FFF, #0066CC)',
            boxShadow: '0 8px 25px rgba(0, 127, 255, 0.25)',
            border: '2px solid rgba(0, 127, 255, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #0099FF, #007FFF)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 127, 255, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(0, 127, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #007FFF, #0066CC)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 127, 255, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(0, 127, 255, 0.5)';
          }}
        >
          {/* Pulsing glow ring */}
          <div className="absolute -inset-1 rounded-xl blur opacity-30 
                          animate-pulse group-hover:opacity-50 transition-opacity duration-300"
               style={{background: 'linear-gradient(to right, #0099FF, #007FFF)'}} />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-xl animate-pulse opacity-50"
               style={{background: 'linear-gradient(to right, rgba(0, 127, 255, 0.2), rgba(0, 102, 204, 0.2))'}} />
          
          <div className="relative z-10 flex items-center gap-2">
            <VideoRecorderIcon />
            <span className="font-bold tracking-wide">Record</span>
          </div>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}

export default InfoBar