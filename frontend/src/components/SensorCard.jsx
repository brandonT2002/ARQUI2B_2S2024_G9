import PropTypes from 'prop-types';
import { RiBook2Fill } from "react-icons/ri";
import { ChartHome } from './ChartHome';
import { useState, useEffect } from 'react';

function SensorCard({ background, color }) {
    const maxRecords = 4; // Máximo de registros en la gráfica
    const baseDate = new Date('2024-10-01'); // Fecha base

    // Estado para almacenar los datos de muestra
    const [sampleData, setSampleData] = useState([]);
    const [currentSensorValue, setCurrentSensorValue] = useState(50); // Valor inicial del sensor

    // Función para generar un nuevo dato con un patrón
    const generateNewData = () => {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + sampleData.length); // Incrementa la fecha
        const formattedDate = date.toISOString().split('T')[0];

        // Simula el comportamiento del sensor
        const randomChange = (Math.random() - 0.5) * 20; // Cambia de -5 a +5
        const newValue = parseFloat((currentSensorValue + randomChange).toFixed(2));

        // Actualiza el valor actual del sensor
        setCurrentSensorValue(newValue);

        // Añade el nuevo dato
        setSampleData(prevData => {
            const newData = [...prevData, { date: formattedDate, value: newValue }];
            // Mantiene solo los últimos 'maxRecords' registros
            if (newData.length > maxRecords) {
                newData.shift(); // Elimina el primer registro
            }
            return newData;
        });
    };

    // Efecto para simular la lectura de datos cada 2 segundos
    useEffect(() => {
        const intervalId = setInterval(generateNewData, 2000); // Actualiza cada 2 segundos
        return () => clearInterval(intervalId); // Limpieza al desmontar el componente
    }, []);

    const colorGradient = color;

    return (
        <div className="grid grid-rows-[auto,1fr] gap-2 bg-panel-dark rounded-md bg-panel_bg-dark">
            <div className='p-3 flex flex-col items-start gap-2'>
                <RiBook2Fill size={36} color={color} className={`p-2 rounded-full ${background}`} />
                <span className='text-2xl font-bold'>{currentSensorValue.toFixed(2)}</span> {/* Muestra el último valor generado */}
            </div>
            <div className='grid place-items-center h-full'>
                <ChartHome data={sampleData} color={colorGradient} />
            </div>
        </div>
    );
}

export default SensorCard;

SensorCard.propTypes = {
    color: PropTypes.string,
    background: PropTypes.string
};
