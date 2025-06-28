import {
  getAllUserVideos,
  getWorkspaceFolders,
  verifyAccessToWorkspace
} from '@/actions/workspace'
import CreateFolders from '@/components/global/create-folders'
import Folders from '@/components/global/folders'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { requireValidSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

import React from 'react'

type Props = {
  params: Promise<{ workspaceId: string }>
}

const Page = async ({ params }: Props) => {
  // Validate session and get user
  const session = await requireValidSession()
  
  const { workspaceId } = await params
  
  // Verify user has access to this specific workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId)
  if (hasAccess.status !== 200) {
    redirect('/dashboard') // Redirect to main dashboard if no access
  }
  
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
          <CreateFolders workspaceId={workspaceId} />
        </div>
        <Folders workspaceId={workspaceId} />
      </div>
    </HydrationBoundary>
  )
}

export default Page