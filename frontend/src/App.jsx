import './App.css'
import Index from './pages/Index'
import { MainProvider } from "./context/MainContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar, { SidebarItem } from './components/Sidebar'
import { FaHouse } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Home from './pages/Home';
import Control from './pages/Control';
import ProyeccionesClimaticas from './pages/Proyections';
import { TiWeatherPartlySunny } from "react-icons/ti";
function App() {

  return (
    <MainProvider>
      <BrowserRouter>
        <div className="flex bg-background-light dark:bg-background-dark">
          <Sidebar>
            <SidebarItem to="/" icon={<FaHouse size={20} />} text="Inicio" />
            <SidebarItem to="/buscar" icon={<FaSearch size={20} />} text="Buscar" />
            <SidebarItem to="/weather" icon={<TiWeatherPartlySunny size={20} />} text="Clima" />
            <hr className="my-3 dark:border-border-dark/60" />
            <SidebarItem to="/settings" icon={<FaUserGear size={20} />} text="Control" />
          </Sidebar>
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/buscar' element={<Index />} />
              <Route path='/settings' element={<Control />} />
              <Route path='/weather' element={<ProyeccionesClimaticas />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </MainProvider>
  )
}

export default App
