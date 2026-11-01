'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Camera, CameraOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QrScanner({ onDetected }) {
  const regionId = `qr-region-${useId().replace(/:/g, '')}`
  const scannerRef = useRef(null)
  const handledRef = useRef(false)
  const [state, setState] = useState('idle')
  const [error, setError] = useState(null)

  async function stop() {
    const scanner = scannerRef.current
    scannerRef.current = null
    if (!scanner) return
    try {
      if (scanner.isScanning) await scanner.stop()
      scanner.clear()
    } catch {
      // Scanner may already be stopped; nothing to clean up.
    }
  }

  async function start() {
    setError(null)
    setState('starting')
    handledRef.current = false
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(regionId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      })
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: (w, h) => ({ width: Math.min(w, h) * 0.7, height: Math.min(w, h) * 0.7 }) },
        async (decodedText) => {
          if (handledRef.current) return
          handledRef.current = true
          await stop()
          setState('idle')
          onDetected(decodedText)
        },
        () => {},
      )
      setState('scanning')
    } catch (err) {
      await stop()
      setState('idle')
      const message = String(err?.message ?? err)
      setError(
        /permission|NotAllowed/i.test(message)
          ? 'Camera access was denied. Allow camera permission in your browser, or enter the invoice number manually.'
          : 'No camera available. Enter the invoice number manually instead.',
      )
    }
  }

  useEffect(() => () => void stop(), [])

  const active = state !== 'idle'

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-foreground/95 sm:aspect-video">
        <div id={regionId} className="size-full [&_video]:size-full [&_video]:object-cover" />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-background">
            <div className="relative size-28">
              <span className="absolute top-0 left-0 size-6 rounded-tl-md border-t-2 border-l-2 border-background/70" />
              <span className="absolute top-0 right-0 size-6 rounded-tr-md border-t-2 border-r-2 border-background/70" />
              <span className="absolute bottom-0 left-0 size-6 rounded-bl-md border-b-2 border-l-2 border-background/70" />
              <span className="absolute right-0 bottom-0 size-6 rounded-br-md border-r-2 border-b-2 border-background/70" />
              <Camera className="absolute inset-0 m-auto size-8 text-background/70" aria-hidden="true" />
            </div>
            <p className="max-w-xs text-sm text-background/80">
              Point your device camera at the QR code printed on the invoice.
            </p>
          </div>
        )}
      </div>

      {error ? (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {active ? (
        <Button
          variant="outline"
          size="lg"
          className="h-11"
          onClick={async () => {
            await stop()
            setState('idle')
          }}
        >
          <CameraOff aria-hidden="true" />
          Stop camera
        </Button>
      ) : (
        <Button size="lg" className="h-11" onClick={start}>
          {state === 'starting' ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Camera aria-hidden="true" />}
          Start camera scan
        </Button>
      )}
    </div>
  )
}
