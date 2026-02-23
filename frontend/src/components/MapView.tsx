import { useEffect, useMemo, useRef, useState } from 'react'
import { LayersControl, MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet'

import type { LatLngBounds } from 'leaflet'
import L from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

import {
  fetchBorder,
  fetchCities,
  fetchCountries,
  fetchCountryByLatLng,
  fetchEarthquakesBBox,
  fetchWikipediaBBox
} from '../api/endpoints'
import { useAppStore } from '../store/useAppStore'
import CountrySelect from './CountrySelect'
import LeafletButtonStack from './LeafletButtonStack'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const defaultCenter: [number, number] = [20, 0]

function MapClickHandler() {
  const setSelected = useAppStore((s) => s.setSelected)
  const setBorder = useAppStore((s) => s.setBorder)

  useMapEvents({
    click: async (e) => {
      try {
        const details = await fetchCountryByLatLng(e.latlng.lat, e.latlng.lng)
        setSelected(details.code, details)

        const border = await fetchBorder(details.code)
        const bbox = geoJsonToBbox(border)
        setBorder(border, bbox)
      } catch {
        //  
      }
    }
  })

  return null
}

function OverlayToggleHandler() {
  const setOverlay = useAppStore((s) => s.setOverlay)

  useMapEvents({
    overlayadd: (e: any) => {
      const name = e?.name as string
      if (name === 'Cities') setOverlay('cities', true)
      if (name === 'Wikipedia Articles') setOverlay('wikipedia', true)
      if (name === 'Earthquakes') setOverlay('earthquakes', true)
      if (name === 'Detailed weather') setOverlay('detailedWeather', true)
    },
    overlayremove: (e: any) => {
      const name = e?.name as string
      if (name === 'Cities') setOverlay('cities', false)
      if (name === 'Wikipedia Articles') setOverlay('wikipedia', false)
      if (name === 'Earthquakes') setOverlay('earthquakes', false)
      if (name === 'Detailed weather') setOverlay('detailedWeather', false)
    }
  })

  return null
}

function FitToBorder() {
  const map = useMap()
  const border = useAppStore((s) => s.borderGeoJson)

  useEffect(() => {
    if (!border) return
    try {
      const layer = L.geoJSON(border)
      const bounds = layer.getBounds()
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.05))
    } catch {
   
    }
  }, [border, map])

  return null
}

function Overlays() {
  const bbox = useAppStore((s) => s.countryBbox)
  const selected = useAppStore((s) => s.selectedCountry)
  const overlays = useAppStore((s) => s.overlays)
  const setOverlay = useAppStore((s) => s.setOverlay)

  // Overlay datasets 
  const [citiesData, setCitiesData] = useState<any | null>(null)
  const [wikiData, setWikiData] = useState<any | null>(null)
  const [eqData, setEqData] = useState<any | null>(null)

  // When switching country clear datasets +and overlay checkboxes (cities, earthquakes and wiki articles) are reset to unticked
  useEffect(() => {
    setCitiesData(null)
    setWikiData(null)
    setEqData(null)

    // This ensures Cities/Wikipedia/Earthquakes reset to unticked on new country
    setOverlay('cities', false)
    setOverlay('wikipedia', false)
    setOverlay('earthquakes', false)
    setOverlay('detailedWeather', false)
  }, [selected?.code, setOverlay])

  // Fetch cities when toggled on
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        if (!selected?.iso2) return
        if (!overlays.cities) return
        if (citiesData) return
        try {
          const data = await fetchCities(selected.iso2)
          if (!cancelled) setCitiesData(data)
        } catch {
          //  
        }
      })()
    return () => {
      cancelled = true
    }
  }, [selected?.iso2, overlays.cities, citiesData])

  // Fetch Wikipedia when toggled on
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        if (!bbox) return
        if (!overlays.wikipedia) return
        if (wikiData) return
        try {
          const data = await fetchWikipediaBBox(bbox.north, bbox.south, bbox.east, bbox.west)
          if (!cancelled) setWikiData(data)
        } catch {
          //  
        }
      })()
    return () => {
      cancelled = true
    }
  }, [bbox, overlays.wikipedia, wikiData])

  // Fetch Earthquakes when toggled on
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        if (!bbox) return
        if (!overlays.earthquakes) return
        if (eqData) return
        try {
          const data = await fetchEarthquakesBBox(bbox.north, bbox.south, bbox.east, bbox.west)
          if (!cancelled) setEqData(data)
        } catch {
          //  
        }
      })()
    return () => {
      cancelled = true
    }
  }, [bbox, overlays.earthquakes, eqData])
//The icons for the cities, earthquakes and wiki articles
  const cityIcon = useMemo(
    () =>
      L.divIcon({
        className: 'bg-primary text-white rounded-circle d-flex align-items-center justify-content-center',
        html: '<div style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;">C</div>',
        iconSize: [26, 26]
      }),
    []
  )

  const wikiIcon = useMemo(
    () =>
      L.divIcon({
        className: 'bg-success text-white rounded-circle d-flex align-items-center justify-content-center',
        html: '<div style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;">W</div>',
        iconSize: [26, 26]
      }),
    []
  )

  const quakeIcon = useMemo(
    () =>
      L.divIcon({
        className: 'bg-danger text-white rounded-circle d-flex align-items-center justify-content-center',
        html: '<div style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;">Q</div>',
        iconSize: [26, 26]
      }),
    []
  )

  return (
    //Logic for the top right hand of the app, the type of map, the overlays (cities, earthquakes, wiki articles) and their respective information i.e population
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Satellite">
        <TileLayer
          attribution="Tiles © Esri — Sources: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Streets">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Positron">
        <TileLayer attribution="&copy; OpenStreetMap &copy; CARTO" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      </LayersControl.BaseLayer>

      <LayersControl.Overlay checked={overlays.cities} name="Cities">
        <MarkerClusterGroup chunkedLoading key={`${selected?.code ?? 'none'}-cities`}>
          {(citiesData?.geonames ?? []).map((c: any) => (
            <Marker key={c.geonameId} position={[Number(c.lat), Number(c.lng)]} icon={cityIcon as any}>
              <Popup>
                <strong>{c.name}</strong>
                <div>Population: {c.population}</div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay checked={overlays.wikipedia} name="Wikipedia Articles">
        <MarkerClusterGroup chunkedLoading key={`${selected?.code ?? 'none'}-wiki`}>
          {(wikiData?.geonames ?? []).map((w: any, idx: number) => (
            <Marker key={`${w.wikipediaUrl ?? w.title}-${idx}`} position={[Number(w.lat), Number(w.lng)]} icon={wikiIcon as any}>
              <Popup>
                <strong>{w.title}</strong>
                <div style={{ maxWidth: 240 }}>{w.summary}</div>
                {w.wikipediaUrl ? (
                  <div>
                    <a href={w.wikipediaUrl.startsWith('http') ? w.wikipediaUrl : `https://${w.wikipediaUrl}`} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </div>
                ) : null}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay checked={overlays.earthquakes} name="Earthquakes">
        <MarkerClusterGroup chunkedLoading key={`${selected?.code ?? 'none'}-eq`}>
          {(eqData?.earthquakes ?? []).map((q: any, idx: number) => (
            <Marker key={`${q.datetime}-${idx}`} position={[Number(q.lat), Number(q.lng)]} icon={quakeIcon as any}>
              <Popup>
                <strong>Magnitude: {q.magnitude}</strong>
                <div>{q.datetime}</div>
                <div>Depth: {q.depth} km</div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay checked={overlays.detailedWeather} name="Detailed weather">
        <></>
      </LayersControl.Overlay>
    </LayersControl>
  )
}

export default function MapView() {
  const setCountries = useAppStore((s) => s.setCountries)
  const selected = useAppStore((s) => s.selectedCountry)

  useEffect(() => {
    fetchCountries().then(setCountries).catch(() => { })
  }, [setCountries])

  return (
    <div className="position-absolute top-0 start-0 w-100 h-100">
      <MapContainer center={defaultCenter} zoom={2} className="h-100 w-100" zoomControl>
        <Overlays />
        <CountryBorderLayer />
        <MapClickHandler />
        <OverlayToggleHandler />
        <FitToBorder />

        <CountrySelect />
        <LeafletButtonStack />
      </MapContainer>

      {!selected ? (
        <div className="position-absolute bottom-0 start-0 m-2 p-2 bg-light border rounded small">Tip: click on the map or pick a country.</div>
      ) : null}
    </div>
  )
}
//bounding box of the selected country - the polygon
function geoJsonToBbox(feature: any): { north: number; south: number; east: number; west: number } | null {
  try {
    const layer = L.geoJSON(feature)
    const b: LatLngBounds = layer.getBounds()
    if (!b.isValid()) return null
    return { north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() }
  } catch {
    return null
  }
}
//when a country is selected, the colour is a slight blue to cover the countries' landmass
function CountryBorderLayer() {
  const map = useMap()
  const border = useAppStore((s) => s.borderGeoJson)
  const layerRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.remove()
      layerRef.current = null
    }

    if (!border) return

    try {
      const layer = L.geoJSON(border, {
        style: () => ({
          weight: 2,
          color: 'var(--fg-border-stroke)',
          fillColor: 'var(--fg-border-fill)',
          fillOpacity: 0.2
        })
      })

      layer.addTo(map)
      layerRef.current = layer
    } catch {
      //  
    }

    return () => {
      if (layerRef.current) {
        layerRef.current.remove()
        layerRef.current = null
      }
    }
  }, [border, map])

  return null
}