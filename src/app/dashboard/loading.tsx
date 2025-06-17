import { Spinner } from '@/components/global/loader/spinner'
import React from 'react'

type Props = {}

const DashboardLoading = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#171717]">
      <Spinner />
    </div>
  )
}

export default DashboardLoading 