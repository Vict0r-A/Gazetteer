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

  



 # App in Action
 <img width="1440" height="807" alt="Screenshot 2026-02-23 at 12 38 50" src="https://github.com/user-attachments/assets/3f967e73-886f-4256-83d6-c30bf049bce6" />

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




