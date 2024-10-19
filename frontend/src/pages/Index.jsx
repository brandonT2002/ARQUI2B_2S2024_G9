import { FilterContainer } from "../components/FilterContainer"
import ThemeToggle from "../components/ThemeToggle"
import { MdSensors } from "react-icons/md";
import { FaCalendarDay, FaTemperatureEmpty, FaDroplet, FaLightbulb, FaCloud } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Button } from "../components/Button";
import { SelectInput } from '../components/SelectInput'
import { useState } from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import ChartComponent from "../components/Chart";
import { GiUltrasound } from "react-icons/gi";
import { MdDoNotDisturb } from "react-icons/md";
import { useMain } from "../context/MainContext";

function Index() {

    const [selectedSensor, setselectedSensor] = useState('')
    const { getSensorData, sensorData } = useMain()

    const handleSelectBook = (value) => {
        if (value) {
            setselectedSensor(value)
        }
    }

    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });

    const options = [
        { icon: <FaTemperatureEmpty />, id: 1, nombre: 'temperature' },
        { icon: <FaDroplet />, id: 2, nombre: 'humidity' },
        { icon: <FaLightbulb />, id: 3, nombre: 'light' },
        { icon: <FaCloud />, id: 4, nombre: 'co2' },
        { icon: <GiUltrasound />, id: 5, nombre: 'proximity' }
    ]

    const searchData = () => {
        getSensorData(selectedSensor.id, value.startDate, value.endDate)
    }

    return (
        <div className='flex h-screen bg-background-light dark:bg-background-dark w-full items-center justify-center'>
            <div className='flex w-[92%] h-full pt-4 flex-col gap-4 pb-5 ml-1'>
                <div className="flex w-full justify-between h-10">
                    <h2 className="text-text-light dark:text-text-dark text-2xl font-bold">Busqueda</h2>
                </div>
                <div className="flex gap-4 w-full flex-col h-full">
                    <div className="flex p-3 items-center justify-between w-full bg-panel_bg-light dark:bg-panel_bg-dark rounded-lg">
                        <FilterContainer element={
                            <SelectInput
                                options={options}
                                placeHolder="Seleccione un sensor"
                                onSelectOption={handleSelectBook}
                                value={selectedSensor}
                            />
                        } icon={
                            <MdSensors className="text-text-light dark:text-text-dark " size={22} />
                        } label="Sensor" />
                        <FilterContainer element={
                            <Datepicker
                                primaryColor={"indigo"}
                                value={value}
                                onChange={newValue => setValue(newValue)}
                                inputClassName="bg-panel_bg-light dark:bg-panel_bg-dark text-text-light dark:text-text-dark placeholder-text-gray-400 dark:placeholder-text-gray-500 border-y border-l border-border-light dark:border-border-dark rounded-md w h-10 w-64 px-2 outline-none"
                                toggleClassName="absolute bg-panel_bg-light dark:bg-panel_bg-dark border-r text-text-light dark:text-text-dark border-y border-border-light dark:border-border-dark rounded-r-lg right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                
                            />
                        }
                            options={options} icon={<FaCalendarDay className="text-text-light dark:text-text-dark" size={20} />} label="Fecha" />
                        <Button icon={<FaSearch size={15} />} label="Buscar" onclick={searchData} />
                    </div>
                    <div className="flex flex-col w-full h-full flex-grow bg-panel_bg-light dark:bg-panel_bg-dark rounded-lg py-4 px-4">
                        <div className="flex justify-between">
                            <h3 className="text-text-light dark:text-text-dark text-xl font-bold pb-4">Resultados</h3>
                            <div className="flex items-center grap text-text-light dark:text-text-dark py-1 px-4 rounded-full gap-2  bg-subpanel_bg-light dark:bg-subpanel_bg-dark">
                                {selectedSensor.icon ? selectedSensor.icon : <MdDoNotDisturb />}
                                <span>{selectedSensor.nombre ? selectedSensor.nombre : "Sin resultados"}</span>
                            </div>
                        </div>
                        <div className="flex flex-grow items-end">
                            <div className="grid w-full py-2 h-[90%] pr-3">
                                {
                                    sensorData.length > 0 ? <ChartComponent data={sensorData} /> : <div className="flex items-center justify-center w-full h-full bg-panel_bg-light dark:bg-panel_bg-dark rounded-lg">
                                        <h3 className="text-text-light dark:text-text-dark text-xl font-bold">No hay datos</h3>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index