import { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCoins, faCloudSun, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons'

import { useAppStore } from '../store/useAppStore'
import { fetchFx, fetchForecast, fetchNews, fetchWeather } from '../api/endpoints'
 //parse a currency code, returning 3-letter currency ISO code, if not found then return null
function parseCurrencyCode(currencyText: string): string | null {
  
  const m = currencyText.match(/\(([A-Z]{3})\)/)
  return m ? m[1] : null
}
//controls the layout of the modals on the LHS of the screen below 'zoom in/out' buttons
export default function LeafletButtonStack() {
  const selected = useAppStore((s) => s.selectedCountry)
  const openModal = useAppStore((s) => s.openModal)
  const setWeather = useAppStore((s) => s.setWeather)
  const setForecast = useAppStore((s) => s.setForecast)
  const setFx = useAppStore((s) => s.setFx)
  const setNews = useAppStore((s) => s.setNews)
  // Disable buttons if no country is selected - cannot be clicked
  const disabled = !selected
  // Tooltip shown when user hasn't selected a country yet

  const title = useMemo(() => (disabled ? 'Select a country first' : ''), [disabled])

  return (
    <div className="position-absolute top-50 start-0 translate-middle-y ms-2" style={{ zIndex: 1000 }}>
      <div className="fg-control p-2 d-flex flex-column gap-2">
         {/* Country info button */}
        <button
          className="btn border fg-btn-country"
          title={disabled ? title : 'Country details'}
          disabled={disabled}
          onClick={() => openModal('country')}
        >
          <FontAwesomeIcon icon={faCircleInfo} size="lg" />
        </button>
         {/* Currency button */}
        <button
          className="btn border fg-btn-currency"
          title={disabled ? title : 'Currency exchange'}
          disabled={disabled}
          onClick={async () => {
            if (!selected) return
            const ccy = parseCurrencyCode(selected.currency)
            if (ccy) {
              try {
                setFx(await fetchFx(ccy))
              } catch {
                setFx(null)
              }
            } else {
              setFx(null)
            }
            openModal('currency')
          }}
        >
          <FontAwesomeIcon icon={faCoins} size="lg" />
        </button>
           {/* Weather button */}
        <button
          className="btn border fg-btn-weather"
          title={disabled ? title : 'Weather'}
          disabled={disabled}
          onClick={async () => {
            if (!selected) return

            const bbox = useAppStore.getState().countryBbox
            const lat = bbox ? (bbox.north + bbox.south) / 2 : 0
            const lng = bbox ? (bbox.east + bbox.west) / 2 : 0
            try {
              setWeather(await fetchWeather(lat, lng))
              setForecast(await fetchForecast(lat, lng, 5))
            } catch {
              setWeather(null)
              setForecast(null)
            }
            openModal('weather')
          }}
        >
          <FontAwesomeIcon icon={faCloudSun} size="lg" />
        </button>
           {/* Wikipedia button */}
        <button
          className="btn border fg-btn-wiki"
          title={disabled ? title : 'Wikipedia'}
          disabled={disabled}
          onClick={() => openModal('wikipedia')}
        >
          <FontAwesomeIcon icon={faWikipediaW} size="lg" />
        </button>
           {/* News button */}
        <button
          className="btn border fg-btn-news"
          title={disabled ? title : 'News'}
          disabled={disabled}
          onClick={async () => {
            if (!selected) return
            try {
              setNews(await fetchNews(selected.code, 1, '', 'en', ''))
            } catch {
              setNews(null)
            }
            openModal('news')
          }}
        >
          <FontAwesomeIcon icon={faNewspaper} size="lg" />
        </button>
      </div>
    </div>
  )
}