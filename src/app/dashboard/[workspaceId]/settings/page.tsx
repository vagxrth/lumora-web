'use client'
import { enableFirstView, getFirstView } from '@/actions/user'
import { DarkMode } from '@/components/theme/dark-mode'
import { LightMode } from '@/components/theme/light-mode'
import { SystemMode } from '@/components/theme/system-mode'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const SettingsPage = () => {
  const [firstView, setFirstView] = useState<undefined | boolean>(undefined)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    if (firstView !== undefined) return
    const fetchData = async () => {
      const response = await getFirstView()
      if (response.status === 200) setFirstView(response?.data)
    }
    fetchData()
  }, [firstView])

  const switchState = async (checked: boolean) => {
    const view = await enableFirstView(checked)
    if (view) {
      toast(view.status === 200 ? 'Success' : 'Failed', {
        description: view.data,
      })
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold">Theme</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Choose your preferred theme mode for the application interface.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-4 flex lg:flex-row flex-col items-start gap-6">
            <div
              className={cn(
                'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent transition-all hover:opacity-90',
                theme == 'system' && 'border-purple-800'
              )}
              onClick={() => setTheme('system')}
            >
              <SystemMode />
            </div>
            <div
              className={cn(
                'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent transition-all hover:opacity-90',
                theme == 'light' && 'border-purple-800'
              )}
              onClick={() => setTheme('light')}
            >
              <LightMode />
            </div>
            <div
              className={cn(
                'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent transition-all hover:opacity-90',
                theme == 'dark' && 'border-purple-800'
              )}
              onClick={() => setTheme('dark')}
            >
              <DarkMode />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-neutral-800 w-full" />

      <div>
        <h2 className="text-2xl font-bold">Video Sharing Settings</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Enabling this feature will send you notifications when someone watched
          your video for the first time. This feature can help during client
          outreach.
        </p>
        <div className="flex items-center gap-x-4">
          <span className="text-md">Enable First View</span>
          <Switch
            onCheckedChange={switchState}
            disabled={firstView === undefined}
            checked={firstView}
            onClick={() => setFirstView(!firstView)}
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage