import { createContext } from "react";
import { useState } from "react";

export const SizeDashboardContext = createContext()

export const SizeDashboardProvider = ({ children }) => {
    const [formHeight, setFormHeight] = useState(10);
    const [headerHeight, setHeaderHeight] = useState(10);
    let sizeDashbord = window.innerHeight - formHeight - headerHeight + 7

    return (
        <SizeDashboardContext.Provider value={{ setFormHeight, setHeaderHeight, sizeDashbord }}>
          {children}
        </SizeDashboardContext.Provider>
      )
}