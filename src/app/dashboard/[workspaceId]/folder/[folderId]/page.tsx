import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import FolderInfo from '@/components/global/folders/folder-info'
import Videos from '@/components/global/videos'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import React from 'react'

type Props = {
  params: Promise<{
    folderId: string
    workspaceId: string
  }>
}

const page = async ({ params }: Props) => {
  const { folderId, workspaceId } = await params
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ['folder-videos'],
    queryFn: () => getAllUserVideos(folderId),
  })

  await query.prefetchQuery({
    queryKey: ['folder-info'],
    queryFn: () => getFolderInfo(folderId),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex flex-col gap-12 py-8">
        <FolderInfo folderId={folderId} />
        <Videos
          workspaceId={workspaceId}
          folderId={folderId}
          videosKey="folder-videos"
        />
      </div>
    </HydrationBoundary>
  )
}

export default page