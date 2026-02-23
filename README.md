# Gazetteer
An interactive, full-stack web application that allows exploaration of any country, with access to its key information such as its borders, weather, exchange rates, and Wikipedia information.

# Tech Stack
- Frontend: HTML5, JavaScript (ES6), jQuery, Leaflet, MarkerCluster, Toastify, Bootstrap, Font Awesome
- Backend: Java (Springboot) 
- Data/APIs: Rest Countries, OpenCage, OpenWeather, Open Exchange Rates, GeoNames
- APIs:
  - OpenCage Geocoding - (https://opencagedata.com/)
  - OpenWeather - (https://openweathermap.org/api)
  - RestCountries - (https://restcountries.com/)
  - Open Exchange Rates - (https://openexchangerates.org/)
  - GeoNames - (https://www.geonames.org/)
  - OpenMeteo - (https://open-meteo.com/)
- Data file: `libs/data/countryBorders.geo.json` (data for country borders)

# Functionality
- Attempts to detect your current location and highlight your country. If location permissions are denied, the UK is the default country highlighted
- Displays country information:
  - Such as name, capital, population, currency, weather + USD exchange rate, news and highlights the countries' region with its borders

  

 ![App in action](https://github.com/user-attachments/assets/9a6aff68-082e-436c-9042-7133973edda8)

 [Click this to see the live app](https://www.victoradams.co.uk/project1/public/)


# Setup 
1. clone git repository 
   
   git clone https://github.com/Vict0r-A/Gazetteer.git
   cd <VictorAdams>project1

2. Create your api_key file
   - cp php/api_key.template.php php/api_key.php
   - open php/api_key.php and fill in you API keys/usernames
3. 
  -  Run it locally. using php's built in server php -S localhost:8000 -t public
  - then open  http://localhost:8000 in your browser


## Authors
Victor Adams






# gazetteer (React + TypeScript + Spring Boot)
An interactive

This is a rebuild of your **Project 1 Gazetteer** app with:

- Frontend: **React + TypeScript (Vite)**, **Bootstrap 5**, **Leaflet**, **FontAwesome**
- Backend: **Java 17 + Spring Boot**, REST endpoints equivalent to your original PHP endpoints

## 1) Prereqs

- Node.js 18+ (or 20+ recommended)
- Java 17+
- Maven 3.9+

## 2) API keys

Set these environment variables before starting the backend:

- `OPENCAGE_KEY` (reverse geocoding)
- `OPENWEATHER_KEY` (current weather)
- `OPENEXCHANGERATES_KEY` (FX)
- `GEONAMES_USER` (wiki summary + overlays)
- `WORLDNEWS_KEY` (news)

(Optional)
- `FRONTEND_ORIGIN` (defaults to `http://localhost:5173`)

## 3) Run (dev)

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

Vite proxies `/api/*` to `http://localhost:8080`.

## 4) Endpoints (backend)

These mirror your Project 1 PHP contracts:

- `GET /api/borders?action=list`
- `GET /api/borders?action=border&code=GB`
- `GET /api/country?code=GB` or `GET /api/country?lat=..&lng=..`
- `GET /api/weather?lat=..&lng=..`
- `GET /api/weather/forecast?lat=..&lng=..&days=5`
- `GET /api/fx?ccy=GBP`
- `GET /api/geonames/cities?country=GB&lang=en`
- `GET /api/geonames/wikipedia?north=..&south=..&east=..&west=..&lang=en`
- `GET /api/geonames/earthquakes?north=..&south=..&east=..&west=..`
- `GET /api/news?code=GB&page=1&q=&lang=en&category=`

## Notes

- The map click selects a country using reverse geocoding (OpenCage), then loads borders.
- Overlays (Cities / Wikipedia / Earthquakes) load from GeoNames and cluster markers.
- Modals are Bootstrap-styled via `react-bootstrap` (no jQuery).
