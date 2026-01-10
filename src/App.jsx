import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import WeatherDetail from './pages/WeatherDetail'
import NewsPage from './pages/NewsPage'
import PlacesPage from './pages/PlacesPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="weather" element={<WeatherDetail />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="places" element={<PlacesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App