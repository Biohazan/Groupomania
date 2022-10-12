import { useRef } from 'react'
import { createContext } from 'react'
import { useState } from 'react'

export const SizeDashboardContext = createContext()

export const SizeDashboardProvider = ({ children }) => {
  const [formHeight, setFormHeight] = useState(49)
  const [headerHeight, setHeaderHeight] = useState('')
  const sizeDashbord = useRef()
  let windowHeigth = window.innerHeight

  return (
    <SizeDashboardContext.Provider
      value={{
        setFormHeight,
        setHeaderHeight,
        formHeight,
        headerHeight,
        windowHeigth,
        sizeDashbord,
      }}
    >
      {children}
    </SizeDashboardContext.Provider>
  )
}
