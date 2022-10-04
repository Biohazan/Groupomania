import { useLocation } from 'react-router-dom'
import { authContext } from '../utils/context/Auth'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

function RequireAuth({ children }) {
  const { isAuthed } = useContext(authContext)
  const location = useLocation()

  return ((isAuthed === true))
    ? children
    : <Navigate to="/" replace state={{ path: location.pathname }} />
}

export default RequireAuth
