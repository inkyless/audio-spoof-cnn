import { BrowserRouter, Routes,Route } from "react-router-dom"
import HomePage from "./components/mainpages/HomePage"
import ResultPage from "./components/mainpages/ResultPage"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result/:session_id" element={<ResultPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
