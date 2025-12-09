import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { SignupPage } from "./pages/Signup"
import { SigninPage } from "./pages/Signin"

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 overflow-y-auto" >
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/signup" element={ <SignupPage /> } />
          <Route path="/signin" element={ <SigninPage /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
