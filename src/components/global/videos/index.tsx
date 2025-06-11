'use client'
import { getAllUserVideos } from '@/actions/workspace'
import VideoRecorderDuotone from '@/components/icons/video-recorder-duotone'
import { useQueryData } from '@/hooks/useQueryData'
import { cn } from '@/lib/utils'
import React from 'react'
import VideoCard from './video-card'
import { Loader } from 'lucide-react'

type VideoData = {
  id: string
  title: string | null
  createdAt: Date
  source: string
  processing: boolean
  Folder: {
    id: string
    name: string
  } | null
  User: {
    firstname: string | null
    lastname: string | null
    image: string | null
  } | null
}

type VideoResponse = {
  status: number
  data?: VideoData[]
}

type Props = {
  folderId: string
  videosKey: string
  workspaceId: string
}

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
  const { data: videoData, isPending } = useQueryData<VideoResponse>([`workspace-videos-${workspaceId}`], () =>
    getAllUserVideos(folderId)
  )

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex justify-center items-center w-full">
          <Loader className="w-6 h-6 text-neutral-400 animate-spin" />
        </div>
      )
    }

    if (!videoData || videoData.status !== 200 || !videoData.data) {
      return (
        <p className="text-neutral-400 text-center">No videos in workspace</p>
      )
    }

    return videoData.data.map((video: VideoData) => (
      <VideoCard
        key={video.id}
        workspaceId={workspaceId}
        {...video}
      />
    ))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#BDBDBD] text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          (!videoData || videoData.status !== 200)
            ? 'flex justify-center items-center min-h-[200px]'
            : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
        )}
      >
        {renderContent()}
      </section>
    </div>
  )
}

export default Videos