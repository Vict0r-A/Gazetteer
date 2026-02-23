# Gazetteer
An interactive, full-stack web application that allows exploaration of any country, with access to its key information such as its borders, weather, exchange rates, and Wikipedia information.

# Tech Stack
- Frontend: React and Typescript
- Backend: Java (Springboot) 
- Data/APIs: Rest Countries, OpenCage, OpenWeather, Open Exchange Rates, GeoNames
- APIs:
  - OpenCage Geocoding - (https://opencagedata.com/)
  - OpenWeather - (https://openweathermap.org/api)
  - RestCountries - (https://restcountries.com/)
  - Open Exchange Rates - (https://openexchangerates.org/)
  - GeoNames - (https://www.geonames.org/)
  - OpenMeteo - (https://open-meteo.com/)
- Data file: `src/data/countryBorders.geo.json` (data for country borders)

# Functionality
- Attempts to detect your current location and highlight your country. If location permissions are denied, the UK is the default country highlighted
- Displays country information:
  - Such as name, capital, population, currency, weather + USD exchange rate, news and highlights the countries' region with its borders

  


 ![App in action](<img width="1440" height="807" alt="Screenshot 2026-02-23 at 12 38 50" src="https://github.com/user-attachments/assets/3f967e73-886f-4256-83d6-c30bf049bce6" />)

 [Click this to see the live app](https://www.victoradams.co.uk/project1/public/)


# Setup 
1. clone git repository 
   
   git clone https://github.com/Vict0r-A/Gazetteer.git


2. Create your own api keys 
   
3. 
  -  Run it locally -From project root:
  -   cd backend
  -  mvn spring-boot:run
  -  open  http://localhost:8080 in your browser
  -  From project root
  -  cd frontend
  -  npm run dev
  -   open  http://localhost:5173 in your browser


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
