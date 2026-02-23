//series of http calls to the springboot backend

import { api } from './client'
import type { CountryDetails, CountryListItem, Forecast, FxRate, NewsResponse, WeatherNow } from '../types/api'

export async function fetchCountries(): Promise<CountryListItem[]> {
  const { data } = await api.get<{ countries: CountryListItem[] }>(`/api/borders?action=list`)
  return data.countries
}

export async function fetchBorder(code: string): Promise<any> {
  const { data } = await api.get(`/api/borders?action=border&code=${encodeURIComponent(code)}`)
  return data
}

export async function fetchCountryByCode(code: string): Promise<CountryDetails> {
  const { data } = await api.get<CountryDetails>(`/api/country?code=${encodeURIComponent(code)}`)
  return data
}

export async function fetchCountryByLatLng(lat: number, lng: number): Promise<CountryDetails> {
  const { data } = await api.get<CountryDetails>(`/api/country?lat=${lat}&lng=${lng}`)
  return data
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherNow> {
  const { data } = await api.get<WeatherNow>(`/api/weather?lat=${lat}&lng=${lng}`)
  return data
}

export async function fetchForecast(lat: number, lng: number, days = 5): Promise<Forecast> {
  const { data } = await api.get<Forecast>(`/api/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`)
  return data
}

export async function fetchFx(ccy: string): Promise<FxRate> {
  const { data } = await api.get<FxRate>(`/api/fx?ccy=${encodeURIComponent(ccy)}`)
  return data
}

export async function fetchCities(countryIso2: string): Promise<any> {
  const { data } = await api.get(`/api/geonames/cities?country=${encodeURIComponent(countryIso2)}&lang=en`)
  return data
}

export async function fetchWikipediaBBox(north: number, south: number, east: number, west: number): Promise<any> {
  const { data } = await api.get(`/api/geonames/wikipedia?north=${north}&south=${south}&east=${east}&west=${west}&lang=en`)
  return data
}

export async function fetchEarthquakesBBox(north: number, south: number, east: number, west: number): Promise<any> {
  const { data } = await api.get(`/api/geonames/earthquakes?north=${north}&south=${south}&east=${east}&west=${west}`)
  return data
}

export async function fetchNews(code: string, page = 1, q = '', lang = 'en', category = ''): Promise<NewsResponse> {
  const params = new URLSearchParams({ code, page: String(page), q, lang, category })
  const { data } = await api.get<NewsResponse>(`/api/news?${params.toString()}`)
  return data
}
