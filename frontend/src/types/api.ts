//frontend TypeScript API response types
//This file defines the shape of how the backend should return data

export type CountryListItem = {
  name: string
  iso2: string | null
  iso3: string | null
}

export type CountryDetails = {
  code: string
  iso2: string | null
  iso3: string | null
  numericCode: string | null
  name: string
  capital: string
  population: number | null
  area_km2: number | null
  region: string
  subregion: string
  flagPng: string
  currency: string
  languages: Record<string, string>
  wiki: string
  wikiUrl: string | null
}

export type FxRate = { pair: string; rate: number }

export type WeatherNow = {
  provider: string
  temp: number
  feels_like: number
  humidity: number
  pressure: number
  wind_speed: number
  clouds: number
  visibility: number
  desc: string
  icon: string
  name?: string
}

// export type Forecast = {
//   provider: string
//   lat: number
//   lng: number
//   days: number
//   icon?: string;
//   forecast: Array<{ date: string; min: number; max: number; precip: number, icon?: string; }
//   >
// }
export type Forecast = {
  provider: string
  lat: number
  lng: number
  days: number
  icon?: string
  forecast: Array<{
    date: string
    min: number
    max: number
    precip: number
    icon?: string
  }>
}
export type NewsResponse = {
  provider: string
  country: string
  total: number | null
  articles: Array<{
    title: string
    summary: string
    source: string
    url: string
    image_url: string
    pubDate: string
  }>
  next_page: number | null
}
