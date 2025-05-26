import { BrowserRouter, Routes,Route } from "react-router-dom"
import HomePage from "./components/mainpages/HomePage"
import ResultPage from "./components/mainpages/ResultPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
