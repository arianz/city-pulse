import { useCity } from '../context/CityContext'
import { useState, useEffect } from 'react'

const WeatherDetail = () => {
  const { weather, coordinates, weatherLoading, weatherError, city } = useCity()
  const [forecast, setForecast] = useState([])
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastError, setForecastError] = useState(null)
  const [isCelsius, setIsCelsius] = useState(true)

  const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

  const convertTemp = (temp) => {
    return isCelsius ? Math.round(temp) : Math.round(temp * 9/5 + 32)
  }
  const unit = isCelsius ? '°C' : '°F'

  useEffect(() => {
    if (!coordinates) return

    const fetchForecast = async () => {
      setForecastLoading(true)
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
        )
        if (!response.ok) throw new Error('Gagal ambil prakiraan cuaca')
        const data = await response.json()

        const dailyMap = new Map()
        data.list.forEach(item => {
          const dateKey = new Date(item.dt * 1000).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })

          if (!dailyMap.has(dateKey)) {
            dailyMap.set(dateKey, {
              date: dateKey,
              temp_max: item.main.temp_max,
              temp_min: item.main.temp_min,
              description: item.weather[0].description,
              icon: item.weather[0].icon
            })
          } else {
            const existing = dailyMap.get(dateKey)
            existing.temp_max = Math.max(existing.temp_max, item.main.temp_max)
            existing.temp_min = Math.min(existing.temp_min, item.main.temp_min)
          }
        })

        const forecastDays = Array.from(dailyMap.values())
          .map(day => ({
            ...day,
            temp_max: Math.round(day.temp_max),
            temp_min: Math.round(day.temp_min),
            description: day.description.charAt(0).toUpperCase() + day.description.slice(1)
          }))
          .slice(1, 6)

        setForecast(forecastDays)
      } catch (err) {
        setForecastError(err.message)
      } finally {
        setForecastLoading(false)
      }
    }

    fetchForecast()
  }, [coordinates])

  return (
    <div className="py-3">
      <div className="container">
        <h2 className="display-5 text-center mb-5">
          Cuaca Terkini di <span className="fw-medium">{city || 'Kota Kamu'}</span>
        </h2>

        {!coordinates && !weatherLoading && !weatherError && (
          <div className="text-center my-5 py-5">
            <i className="bi bi-geo-alt-fill fs-1 text-muted mb-3 d-block"></i>
            <p className="fs-4 text-muted">Lokasi belum terdeteksi!</p>
          </div>
        )}

        {coordinates && (
          <div className="row g-5 align-items-start">
            <div className="col-lg-6 col-12 order-lg-1 order-1">
              <div className="card shadow-sm rounded-4 h-100">
                {weatherLoading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {weatherError && (
                  <div className="alert alert-danger m-4 text-center">{weatherError}</div>
                )}

                {weather && (
                  <div className="card-body text-center py-5">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                      alt={weather.description}
                      className="mb-4"
                      style={{ width: '180px' }}
                    />

                    <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                      <h1 className="display-1 fw-bold" style={{ fontSize: '5rem' }}>
                        {convertTemp(weather.temp)}{unit}
                      </h1>
                      <button
                        onClick={() => setIsCelsius(!isCelsius)}
                        className="btn btn-outline-primary btn-lg rounded-pill px-4"
                      >
                        {isCelsius ? '°F' : '°C'}
                      </button>
                    </div>

                    <p className="fs-3 text-capitalize text-secondary mb-5">
                      {weather.description}
                    </p>

                    <div className="row g-5">
                      <div className="col-6">
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-droplet-half fs-1 text-primary mb-3"></i>
                          <p className="fs-3 fw-bold mb-0">{weather.humidity}%</p>
                          <small className="text-muted">Kelembaban</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-wind fs-1 text-primary mb-3"></i>
                          <p className="fs-3 fw-bold mb-0">{weather.wind} m/s</p>
                          <small className="text-muted">Kecepatan Angin</small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6 col-12 order-lg-2 order-2">
              <h3 className="text-center mb-4 fw-medium d-lg-block d-none">
                Prakiraan Beberapa Hari ke Depan
              </h3>
              <h3 className="text-center mb-4 fw-medium d-lg-none">
                Prakiraan Beberapa Hari ke Depan
              </h3>

              {forecastLoading && (
                <div className="text-center mb-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading forecast...</span>
                  </div>
                </div>
              )}

              {forecastError && (
                <div className="alert alert-danger text-center mb-4">{forecastError}</div>
              )}

              <div className="d-flex overflow-x-auto overflow-lg-visible gap-4 pb-3 d-lg-block">
                <div className="d-flex d-lg-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                  {forecast.length > 0 ? (
                    forecast.map((day, index) => (
                      <div
                        key={index}
                        className="card shadow-sm text-center flex-shrink-0 flex-lg-shrink-1 rounded-3"
                        style={{ minWidth: '150px' }}
                      >
                        <div className="card-body py-4">
                          <p className="fw-bold mb-3">{day.date}</p>
                          <img
                            src={`https://openweathermap.org/img/wn/${day.icon.replace('n', 'd')}@2x.png`}
                            alt={day.description}
                            style={{ width: '80px' }}
                            className="mb-3"
                          />
                          <p className="fs-5 fw-bold mb-2">
                            {convertTemp(day.temp_max)}{unit} / {convertTemp(day.temp_min)}{unit}
                          </p>
                          <small className="text-capitalize text-muted d-block">{day.description}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    !forecastLoading && !forecastError && (
                      <p className="text-center text-muted w-100 my-5">
                        Prakiraan akan muncul setelah lokasi terdeteksi
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherDetail