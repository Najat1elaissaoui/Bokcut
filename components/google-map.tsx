"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

/**
 * GoogleMap
 * ----------
 * Interactive Google Maps wrapper.
 *
 * Requirements:
 *   • NEXT_PUBLIC_GOOGLE_MAPS_API_KEY must be set.
 *
 * Usage:
 *   <GoogleMap
 *     center={{ lat: 48.8566, lng: 2.3522 }}
 *     markers={[{ position: { lat: 48.8566, lng: 2.3522 }, title: "Paris" }]}
 *     onLocationSelect={(loc) => console.log(loc)}
 *   />
 */

interface GoogleMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    info?: string
  }>
  onLocationSelect?: (loc: { lat: number; lng: number; address: string }) => void
  className?: string
}

export default function GoogleMap({
  center = { lat: 40.7128, lng: -74.006 },
  zoom = 12,
  markers = [],
  onLocationSelect,
  className = "w-full h-96",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialise Google Maps
  useEffect(() => {
    const init = async () => {
      // If no key present, skip loader and set error immediately
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        setMapError("Google Maps API key is missing")
        return
      }

      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        })
        await loader.load()

        if (!mapRef.current || !(window as any).google) {
          setMapError("Google Maps could not initialise.")
          return
        }

        const { google } = window as any

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        // -----  click-to-select  -----
        if (onLocationSelect) {
          map.addListener("click", async (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()

            let address = `${lat}, ${lng}`
            try {
              const geocoder = new google.maps.Geocoder()
              const res = await geocoder.geocode({ location: { lat, lng } })
              if (res.results?.[0]) address = res.results[0].formatted_address
            } catch {
              /* ignore */
            }

            onLocationSelect({ lat, lng, address })
          })
        }

        // -----  markers  -----
        markers.forEach(({ position, title, info }) => {
          const marker = new google.maps.Marker({
            position,
            map,
            title,
          })

          if (info) {
            const infoWindow = new google.maps.InfoWindow({
              content: `<div style="padding:8px;font-family:Arial">${info}</div>`,
            })
            marker.addListener("click", () => infoWindow.open(map, marker))
          }
        })

        setMapLoaded(true)
      } catch (err: any) {
        // The loader rejects with an Error whose message contains the Maps error code
        console.error("Google Maps error:", err)
        setMapError(
          err?.message?.includes("ApiProjectMapError")
            ? "Invalid or unauthorized Google Maps API key"
            : "Failed to load Google Maps",
        )
      }
    }

    init()
  }, [center, zoom, markers, onLocationSelect])

  return (
    <div className={className}>
      {mapError ? (
        /* ----------  Fallback (no API key required)  ---------- */
        <iframe
          title="fallback-map"
          className="w-full h-full rounded-lg border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?q=${center.lat},${center.lng}&zoom=${zoom}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}`}
        />
      ) : (
        <>
          <div ref={mapRef} className="w-full h-full rounded-lg" />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
