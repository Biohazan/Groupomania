import { useState} from "react";

export function useViewPass() {
    const [passType, setpassType] = useState('password')
    const [colorViewState, setColorView] = useState('white')
const colorView = {
    color: colorViewState,
  }
  function viewPass() {
    if (passType === 'password') {
      setpassType('text')
      setColorView('red')
    } else {
      setpassType('password')
      setColorView('white')
    }
  }

  return {colorView, passType, viewPass}
}
