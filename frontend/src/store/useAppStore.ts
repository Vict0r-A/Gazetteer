import { create } from 'zustand'
import type { CountryDetails, CountryListItem, FxRate, Forecast, NewsResponse, WeatherNow } from '../types/api'




//what type of modal
export type ModalKey = 'country' | 'currency' | 'weather' | 'wikipedia' | 'news'
//states the data types of the app
type AppState = {
  countries: CountryListItem[]
  selectedCode: string | null
  selectedCountry: CountryDetails | null
  borderGeoJson: any | null
  countryBbox: { north: number; south: number; east: number; west: number } | null

  weather: WeatherNow | null
  forecast: Forecast | null
  fx: FxRate | null
  news: NewsResponse | null

  modals: Record<ModalKey, boolean>

  overlays: {
    cities: boolean
    wikipedia: boolean
    earthquakes: boolean
    detailedWeather: boolean
  }

  setCountries: (c: CountryListItem[]) => void
  setSelected: (code: string | null, details: CountryDetails | null) => void
  setBorder: (geo: any | null, bbox: AppState['countryBbox']) => void
  setWeather: (w: WeatherNow | null) => void
  setForecast: (f: Forecast | null) => void
  setFx: (fx: FxRate | null) => void
  setNews: (n: NewsResponse | null) => void

  openModal: (k: ModalKey) => void
  closeModal: (k: ModalKey) => void

  setOverlay: (k: keyof AppState['overlays'], v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  countries: [],
  selectedCode: null,
  selectedCountry: null,
  borderGeoJson: null,
  countryBbox: null,

  weather: null,
  forecast: null,
  fx: null,
  news: null,

  modals: { country: false, currency: false, weather: false, wikipedia: false, news: false },

  overlays: { cities: false, wikipedia: false, earthquakes: false, detailedWeather: false },

  setCountries: (countries) => set({ countries }),
  setSelected: (selectedCode, selectedCountry) =>
    set((s) => {
      const prev = s.selectedCode
      const next = selectedCode
      const changed = prev !== next

      return {
        selectedCode,
        selectedCountry,
        overlays: changed
          ? { cities: false, wikipedia: false, earthquakes: false, detailedWeather: false }
          : s.overlays,
      }
    }),
  setBorder: (borderGeoJson, countryBbox) => set({ borderGeoJson, countryBbox }),
  setWeather: (weather) => set({ weather }),
  setForecast: (forecast) => set({ forecast }),
  setFx: (fx) => set({ fx }),
  setNews: (news) => set({ news }),

  openModal: (k) => set((s) => ({ modals: { ...s.modals, [k]: true } })),
  closeModal: (k) => set((s) => ({ modals: { ...s.modals, [k]: false } })),

  setOverlay: (k, v) => set((s) => ({ overlays: { ...s.overlays, [k]: v } }))
}))
