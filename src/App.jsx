import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IFSC_search from './Component/IFSC_search'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <IFSC_search/>
    </>
  )
}

export default App
