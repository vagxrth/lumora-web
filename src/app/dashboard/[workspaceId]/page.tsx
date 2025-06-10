import {
  getAllUserVideos,
  getWorkspaceFolders
} from '@/actions/workspace'
import CreateFolders from '@/components/global/create-folders'
import CreateWorkspace from '@/components/global/create-workspace'
import Folders from '@/components/global/folders'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import React from 'react'

type Props = {
  params: Promise<{ workspaceId: string }>
}

const Page = async ({ params }: Props) => {
  const { workspaceId } = await params
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId),
  })

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceId),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="mt-6">
        <div className="flex justify-end gap-x-3">
          <CreateWorkspace />
          <CreateFolders workspaceId={workspaceId} />
        </div>
        <Folders workspaceId={workspaceId} />
      </div>
    </HydrationBoundary>
  )
}

export default Page