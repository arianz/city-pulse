import { useCity } from '../context/CityContext'

const NewsPage = () => {
  const { news, newsLoading, newsError, city } = useCity()

  return (
    <div className="py-3">
      <div className="container">
        <h2 className="display-5 text-center mb-5">
          Berita Terkini di <span className="fw-medium">{city || 'Kota Kamu'}</span>
        </h2>

        {newsLoading && (
          <div className="text-center my-5">
            <div className="spinner-border text-success" style={{ width: '4rem', height: '4rem' }} role="status">
              <span className="visually-hidden">Loading berita...</span>
            </div>
          </div>
        )}

        {newsError && (
          <div className="alert alert-danger text-center mb-5">{newsError}</div>
        )}

        {news.length > 0 ? (
          <div className="masonry-grid">
            {news.map((article, index) => (
              <div key={index} className="masonry-item mb-4 break-inside-avoid">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <div className="position-relative overflow-hidden rounded-4 shadow-sm hover-shadow">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-100"
                        style={{ height: '320px', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center text-white"
                        style={{ height: '320px' }}
                      >
                        <i className="bi bi-newspaper fs-1"></i>
                      </div>
                    )}

                    <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white"
                         style={{
                           background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                         }}>
                      <h5 className="fw-medium mb-2 fs-5 lh-base">
                        {article.title}
                      </h5>
                      <p className="small mb-0 opacity-90">
                        <i className="bi bi-calendar-event me-1"></i>
                        {new Date(article.pubDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                        {' - '}
                        <i className="bi bi-globe me-1"></i>
                        {article.source_name || 'Sumber tidak diketahui'}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          !newsLoading && !newsError && (
            <div className="text-center my-5 py-5">
              <i className="bi bi-newspaper fs-1 text-muted mb-3 d-block"></i>
              <p className="fs-4 text-muted mb-0">
                Tidak ada berita saat ini!
              </p>
            </div>
          )
        )}
      </div>

      <style jsx>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .masonry-grid {
            column-count: 2;
          }
        }
        @media (min-width: 1200px) {
          .masonry-grid {
            column-count: 3;
          }
        }
        .masonry-item {
          break-inside: avoid;
        }
        .hover-shadow {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}

export default NewsPage