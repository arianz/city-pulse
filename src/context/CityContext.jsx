import { createContext, useContext, useState, useEffect } from 'react'

const CityContext = createContext()

export const useCity = () => useContext(CityContext)

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState(null)

  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsError, setNewsError] = useState(null)

  const [places, setPlaces] = useState([])
  const [placesLoading, setPlacesLoading] = useState(false)
  const [placesError, setPlacesError] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

  const NEWSDATA_API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY

  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY

  const getCityFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
      )
      const data = await response.json()
      return data.city || data.principalSubdivision || data.countryName || 'Lokasi Tidak Diketahui'
    } catch (err) {
      throw new Error('Gagal ambil nama kota')
    }
  }

  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
      )
      if (!response.ok) throw new Error('Gagal ambil data cuaca')
      const data = await response.json()
      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed
      })
    } catch (err) {
      setWeatherError(err.message)
    } finally {
      setWeatherLoading(false)
    }
  }

  const fetchNews = async (cityName) => {
    setNewsLoading(true)
    try {
      const response = await fetch(
        `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&q=${cityName}&country=id&language=id&size=9`
      )
      if (!response.ok) throw new Error('Gagal ambil berita')
      const data = await response.json()
      setNews(data.results || [])
    } catch (err) {
      setNewsError(err.message)
    } finally {
      setNewsLoading(false)
    }
  }

  const fetchPlaces = async (lat, lon) => {
    setPlacesLoading(true)
    try {
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=tourism.sights,commercial.shopping_mall,entertainment.museum,entertainment.zoo,beach,natural.mountain&filter=circle:${lon},${lat},30000&limit=20&apiKey=${GEOAPIFY_API_KEY}`
      )
      if (!response.ok) throw new Error('Gagal ambil data tempat')
      const data = await response.json()

      const placesList = data.features.map(feature => ({
        name: feature.properties.name || 'Tempat Tidak Bernama',
        type: feature.properties.categories[0]?.split('.').pop() || 'Tempat',
        address: feature.properties.address_line2 || feature.properties.formatted,
        lat: feature.properties.lat,
        lon: feature.properties.lon
      }))

      setPlaces(placesList)
    } catch (err) {
      setPlacesError(err.message)
    } finally {
      setPlacesLoading(false)
    }
  }

  useEffect(() => {
    const detectLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation tidak didukung browser kamu')
        setLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          setCoordinates({ lat, lon })

          try {
            const cityName = await getCityFromCoords(lat, lon)
            setCity(cityName)

            await fetchWeather(lat, lon)
            await fetchNews(cityName)
            await fetchPlaces(lat, lon)
          } catch (err) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          setError('Izin lokasi ditolak atau gagal. Coba izinkan lokasi di browser.')
          setLoading(false)
        }
      )
    }

    detectLocation()
  }, [])

  return (
    <CityContext.Provider value={{
      city, coordinates, loading, error, setCity,
      weather, weatherLoading, weatherError,
      news, newsLoading, newsError,
      places, placesLoading, placesError
    }}>
      {children}
    </CityContext.Provider>
  )
}