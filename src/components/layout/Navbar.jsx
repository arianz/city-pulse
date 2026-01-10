import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-3">
          <img 
            src="/logo.png"
            alt="City Pulse Logo" 
            style={{ height: '40px' }}
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-pill text-center ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-light hover-bg-primary-opacity'
                  }`
                }
                style={{ minWidth: '100px' }}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/weather"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-pill text-center ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-light hover-bg-primary-opacity'
                  }`
                }
              >
                Cuaca
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-pill text-center ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-light hover-bg-primary-opacity'
                  }`
                }
              >
                Berita
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/places"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-pill text-center ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-light hover-bg-primary-opacity'
                  }`
                }
              >
                Landmark
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .hover-bg-primary-opacity {
          transition: background-color 0.3s ease;
        }
        .hover-bg-primary-opacity:hover {
          background-color: rgba(13, 110, 253, 0.25) !important;
          border-radius: 50px;
        }
        @media (max-width: 991px) {
          .navbar-nav .nav-link {
            width: fit-content;
            margin: 0 auto;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar