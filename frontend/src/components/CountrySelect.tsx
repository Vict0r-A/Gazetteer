import { useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { fetchBorder, fetchCountryByCode } from '../api/endpoints'
import { useAppStore } from '../store/useAppStore'


// This component renders the country dropdown on top of the map. When you pick a country, it fetches the country details and border GeoJSON, stores them in the app state, and zooms the map to fit the border. On first load (if nothing is selected yet), it also tries to use browser geolocation to pan/zoom the map near the user. It includes a helper that converts the border GeoJSON into a bounding box
export default function CountrySelect() {
  //Leaflet map instance
  const map = useMap()



  const countries = useAppStore((s) => s.countries)
  const selectedCode = useAppStore((s) => s.selectedCode)
  const setSelected = useAppStore((s) => s.setSelected)
  const setBorder = useAppStore((s) => s.setBorder)

  const [busy, setBusy] = useState(false)
// Only include country objects that have a valid ISO2 or ISO3 code
  const options = useMemo(() => countries.filter((c) => c.iso2 || c.iso3), [countries])


  //function for when a country is selected in the dropdown
  const onChange = async (code: string) => {
    if (!code) return
    setBusy(true)
    try {
      //attempt to get country details
      const details = await fetchCountryByCode(code)
      setSelected(details.code, details)

      const border = await fetchBorder(details.code)
      const bbox = geoJsonToBbox(border)
      setBorder(border, bbox)

    //attempt to fit the map to focus on the country
      try {
        const layer = L.geoJSON(border)
        const bounds = layer.getBounds()
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.05))
      } catch {
      
      }
    } finally {
      setBusy(false)
    }
  }
//// Attempt to auto-geolocate the user of the app 
  useEffect(() => {
     
    if (selectedCode) return
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
 
          const { latitude, longitude } = pos.coords
     //set the map to the location of the user
          map.setView([latitude, longitude], 5)
        } catch {
        
        }
      },
      () => {
   
      },
      { enableHighAccuracy: true, timeout: 6000 }
    )
  }, [map, selectedCode])

  return (
    //Creation of a dropdown box of all countries
    <div className="position-absolute top-0 start-50 translate-middle-x mt-2" style={{ zIndex: 1000, width: 340 }}>
      <div className="input-group shadow-sm">
        <span className="input-group-text">Country</span>
        <select
          className="form-select"
          value={selectedCode ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={busy || options.length === 0}
        >
          <option value="">Select…</option>
          {options.map((c) => (
            <option key={c.iso3 ?? c.name} value={c.iso2 ?? c.iso3 ?? ''}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
//the geoJSON coordinates layer/polygon
function geoJsonToBbox(feature: any): { north: number; south: number; east: number; west: number } | null {
  try {
    const layer = L.geoJSON(feature)
    const b = layer.getBounds()
    if (!b.isValid()) return null
    return { north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() }
  } catch {
    return null
  }
}
