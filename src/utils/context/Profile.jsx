import React, { useState, createContext } from 'react'

export const defaultProfile = {
  pseudo: '',
  token: '',
  avatar: '',
  userId: '',
  describe: '',
  role: '',
}

export const ProfileContext = createContext()

export const ProfilePovider = ({ children }) => {
  const [expiredToken, setExpiredToken] = useState(false)
  let getProfile = JSON.parse(localStorage.getItem('profile'))
  const [profile, setProfile] = useState(getProfile)
  localStorage.setItem('profile', JSON.stringify(profile))

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, expiredToken, setExpiredToken }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
