import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h2 className="display-4 fw-bold">404</h2>
      <p className="lead mb-4">Halaman tidak ditemukan</p>
      <Link to="/" className="btn btn-primary btn-lg">
        Kembali ke Home
      </Link>
    </div>
  )
}

export default NotFound