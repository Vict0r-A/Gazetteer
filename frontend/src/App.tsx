import MapView from './components/MapView'
import LauncherPanel from './components/LauncherPanel'
import CountryDetailsModal from './modals/CountryDetailsModal'
import CurrencyModal from './modals/CurrencyModal'
import WeatherModal from './modals/WeatherModal'
import WikipediaModal from './modals/WikipediaModal'
import NewsModal from './modals/NewsModal'

export default function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <MapView />
      <LauncherPanel />
      <CountryDetailsModal />
      <CurrencyModal />
      <WeatherModal />
      <WikipediaModal />
      <NewsModal />
    </div>
  )
}
