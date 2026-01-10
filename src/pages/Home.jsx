import { useCity } from '../context/CityContext'

const Home = () => {
  const { city, loading, error } = useCity()

  return (
    <div className="py-5">
      <div className="text-center mb-5">
        <h2 className="display-5 mb-4">
          Selamat Datang di <span className="fw-medium">City Pulse</span>!
        </h2>
        <p className="lead text-muted col-md-10 col-lg-8 mx-auto">
          Aplikasi ini otomatis mendeteksi lokasi kamu dan menampilkan informasi terkini.
        </p>
      </div>

      <div className="text-center mb-5">
        {loading && (
          <div>
            <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-4 text-muted fs-5">Sedang mendeteksi lokasi...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-warning col-md-8 col-lg-6 mx-auto">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {city && !loading && !error && (
          <div className="alert alert-secondary col-md-8 col-lg-6 mx-auto d-flex align-items-center justify-content-center">
            <i className="bi bi-geo-alt-fill me-2 fs-4"></i>
            Lokasi saat ini:<strong className="ms-2">{city}</strong>
          </div>
        )}
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100 text-center p-4 border-primary">
            <i className="bi bi-cloud-sun fs-1 text-primary mb-3"></i>
            <h5 className="card-title text-primary fw-bold">Cuaca Terkini</h5>
            <p className="card-text text-muted">
              Suhu, kelembaban, dan prakiraan harian
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100 text-center p-4 border-success">
            <i className="bi bi-newspaper fs-1 text-success mb-3"></i>
            <h5 className="card-title text-success fw-bold">Berita Lokal</h5>
            <p className="card-text text-muted">
              Headline terbaru dari kota kamu
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100 text-center p-4 border-warning">
            <i className="bi bi-geo-alt-fill fs-1 text-warning mb-3"></i>
            <h5 className="card-title text-warning fw-bold">Tempat Ikonik</h5>
            <p className="card-text text-muted">
              Landmark, mall, museum, dan spot hits di sekitarmu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home