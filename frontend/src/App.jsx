import './App.css'
import Index from './pages/Index'
import { MainProvider } from "./context/MainContext";
function App() {

  return (
    <MainProvider>
      <Index />
    </MainProvider>
  )
}

export default App
