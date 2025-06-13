import { TabsContent } from '@/components/ui/tabs'
import React from 'react'

type Props = {
  transcript: string
}

const VideoTranscript = ({ transcript }: Props) => {
  return (
    <TabsContent
      value="Transcript"
      className="rounded-xl flex flex-col gap-y-6 px-4 pt-6 pb-4"
    >
      <p className="text-[#a7a7a7] leading-relaxed">{transcript}</p>
    </TabsContent>
  )
}

export default VideoTranscript