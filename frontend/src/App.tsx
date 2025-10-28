import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 overflow-y-auto" >
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={ <Dashboard /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
