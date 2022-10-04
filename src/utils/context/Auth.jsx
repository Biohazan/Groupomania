import { createContext, useState } from 'react'
import { useContext } from 'react'
import { ProfileContext } from './Profile'
import { defaultProfile } from './Profile'

export const authContext = createContext()

export function AuthProvider({ children }) {
  let isAuthedStorage = JSON.parse(localStorage.getItem('isAuthed'))
  const [isAuthed, setIsAuthed] = useState(isAuthedStorage)
  const { setProfile } = useContext(ProfileContext)

  function login() {
    setIsAuthed(true)
    localStorage.setItem('isAuthed', true)
  }
  function logout() {
    setIsAuthed(false)
    localStorage.setItem('isAuthed', false)
    setProfile('')
    localStorage.setItem('profile', JSON.stringify(defaultProfile))
  }

  return (
    <authContext.Provider value={{ isAuthed, login, logout, setIsAuthed }}>
      {children}
    </authContext.Provider>
  )
}
