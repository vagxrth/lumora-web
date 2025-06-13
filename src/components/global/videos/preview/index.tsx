'use client'
import { getPreviewVideo, sendEmailForFirstView } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { VideoProps } from '@/types/index.type'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import CopyLink from '../copy-link'
import { Download } from 'lucide-react'
import TabMenu from '../../tabs'
import VideoTranscript from '../../video-transcript'
import Comments from '../../comments'
import EditVideo from '../edit'
import DeleteVideoModal from '../delete-video-modal'

type Props = {
  videoId: string
}

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter()

  const { data, isPending } = useQueryData(['preview-video'], () =>
    getPreviewVideo(videoId)
  )

  const notifyFirstView = async () => await sendEmailForFirstView(videoId)

  // Always call hooks at the top level - handle navigation side effect
  useEffect(() => {
    if (data && (data as VideoProps).status !== 200) {
      router.push('/')
    }
  }, [data, router])

  // Always call hooks at the top level - handle first view notification
  useEffect(() => {
    if (data && (data as VideoProps).status === 200) {
      const { data: video } = data as VideoProps
      if (video && video.views === 0) {
        notifyFirstView()
      }
    }
    return () => {
      if (data && (data as VideoProps).status === 200) {
        notifyFirstView()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Handle loading state
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  // Handle undefined data or invalid response
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-white text-lg">Loading video...</p>
      </div>
    )
  }

  const { data: video, status, author } = data as VideoProps

  // Return early if status is not 200 or video is undefined
  if (status !== 200 || !video) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-white text-lg">Video not found</p>
      </div>
    )
  }

  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {author ? (
              <div className="flex gap-x-2">
                <EditVideo
                  videoId={videoId}
                  title={video.title as string}
                  description={video.description as string}
                />
                <DeleteVideoModal
                  videoId={videoId}
                  videoTitle={video.title as string}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9D9D9D] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          preload="metadata"
          className="w-full aspect-video opacity-50 rounded-xl"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
          />
        </video>
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="text-[#BDBDBD] text-semibold">Description</p>
            {author ? (
              <div className="flex gap-x-2">
                <EditVideo
                  videoId={videoId}
                  title={video.title as string}
                  description={video.description as string}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <p className="text-[#9D9D9D] text-lg text-medium">
            {video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-6 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full bg-white px-10"
            videoId={videoId}
          />
          <Download className="text-[#4d4c4c]" />
        </div>
        <div>
          <TabMenu
            defaultValue="Transcript"
            triggers={['Transcript', 'Comments']}
          >
            <VideoTranscript transcript={video.summary ?? ''} />
            <Comments
              author={video.User?.firstname ?? 'Anonymous'}
              videoId={videoId}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  )
}

export default VideoPreview