import { Spinner } from '@/components/global/loader/spinner'
import React from 'react'

const WorkspaceLoading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export default WorkspaceLoading