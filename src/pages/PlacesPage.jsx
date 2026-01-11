import { useCity } from '../context/CityContext'

const PlacesPage = () => {
  const { places, placesLoading, placesError, city } = useCity()

  return (
    <div className="py-3">
      <div className="container">
        <h2 className="display-5 text-center mb-5">
          Daftar Tempat Ikonik di <span className="fw-bold">{city || 'Kota Kamu'}</span>
        </h2>

        {placesLoading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
              <span className="visually-hidden">Loading tempat...</span>
            </div>
          </div>
        )}

        {placesError && (
          <div className="alert alert-danger text-center mb-5">{placesError}</div>
        )}

        <div 
          className="border border-2 border-dark p-4"
          style={{ 
            maxHeight: '80vh', 
            overflowY: 'auto'
          }}
        >
          {places.length > 0 ? (
            <div className="row g-4">
              {places.map((place, index) => (
                <div key={index} className="col-lg-6 col-12">
                  <div className="card border-2 border-dark shadow-sm rounded-4 overflow-hidden">
                    <div className="card-body py-4">
                      <h5 className="card-title fw-bold fs-4 mb-3 text-dark">
                        {place.name}
                      </h5>

                      <p className="text-muted mb-4 d-flex align-items-start">
                        <i className="bi bi-geo-alt-fill text-primary me-2 flex-shrink-0"></i>
                        <span>{place.address || 'Alamat tidak tersedia'}</span>
                      </p>

                      {place.lat && place.lon && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + city)}&query_place_id=${place.lat},${place.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary rounded-pill px-5 py-2 shadow-sm"
                        >
                          <i className="bi bi-map me-2"></i>
                          Buka di Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !placesLoading && !placesError && (
              <div className="text-center my-5 py-5">
                <i className="bi bi-building fs-1 text-muted mb-3"></i>
                <p className="fs-4 text-muted">Tidak ada rekomendasi saat ini!</p>
              </div>
            )
          )}
        </div>

        <style jsx>{`
          div[style*="maxHeight"]::-webkit-scrollbar {
            width: 8px;
          }
          div[style*="maxHeight"]::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          div[style*="maxHeight"]::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          div[style*="maxHeight"]::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </div>
    </div>
  )
}

export default PlacesPage