import { createContext, useState } from 'react'
import { useContext } from 'react'
import { ProfileContext } from './Pofile'
import { defaultProfile } from '../../utils/context/Pofile'


export const authContext = createContext()

export function AuthProvider({ children }) {
  let isAuthedStorage = JSON.parse(localStorage.getItem('isAuthed'))
  const [isAuthed, setisAuthed] = useState(isAuthedStorage)
  const { setProfile } = useContext(ProfileContext)

  function login() {
    setisAuthed(true)
    localStorage.setItem('isAuthed', JSON.stringify(isAuthed))
  }
  function logout() {
    setisAuthed(false)
    localStorage.setItem('isAuthed', false)
    setProfile('')
    localStorage.setItem('profile', JSON.stringify(defaultProfile))

  }

  return (
    <authContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </authContext.Provider>
  )
}
