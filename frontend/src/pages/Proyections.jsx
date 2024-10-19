import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendar } from "react-icons/fa";
import { FaTemperatureFull, FaDroplet } from "react-icons/fa6";
import { MdOutlineAir } from "react-icons/md";
import { MdDoNotDisturbAlt } from "react-icons/md";
// Simulación de datos climáticos (reemplazar con datos reales)
const generateMockData = (days) => {
    return Array.from({ length: days }, (_, i) => ({
        fecha: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        temperatura: Math.round(Math.random() * 10 + 20),
        humedad: Math.round(Math.random() * 30 + 50),
        precipitacion: Math.round(Math.random() * 10),
    }));
};

const ProyeccionesClimaticas = () => {
    const [datosClimaticos, setDatosClimaticos] = useState([]);
    const [diaProyeccion, setDiaProyeccion] = useState('');
    const [proyeccion, setProyeccion] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Simular carga de datos (reemplazar con llamada a API real)
        setDatosClimaticos(generateMockData(12));
    }, []);

    const realizarProyeccion = (dia) => {
        const hoy = new Date();
        const fechaSeleccionada = new Date(dia);

        // Normalizar ambas fechas para eliminar las horas, minutos y segundos
        hoy.setHours(0, 0, 0, 0);
        fechaSeleccionada.setHours(0, 0, 0, 0);

        const diferenciaDias = Math.floor((fechaSeleccionada - hoy) / (1000 * 60 * 60 * 24));
        console.log(hoy + ' ' + fechaSeleccionada + ' ' + diferenciaDias);

        if (diferenciaDias < 1 || diferenciaDias > 8) {
            setError('Solo se pueden hacer proyecciones entre 1 y 8 días en el futuro.');
            setProyeccion(null);
        } else {
            setError('');
            // Aquí se realizaría la proyección real. Por ahora, usamos datos simulados.
            setProyeccion(generateMockData(1)[0]);
        }
    };


    return (
        <div className="p-4  w-[92%] mx-auto">
            <div className="bg-panel_bg-dark shadow rounded-lg p-4 text-white">
                <div className="flex items-center mb-4">
                    <FaCalendar className="text-xl mr-2" />
                    <h1 className="text-2xl font-bold">Proyecciones Climáticas</h1>
                </div>

                <div className="mb-4">
                    <select
                        className="w-full px-2 py-3  rounded-md bg-subpanel_bg-dark outline-none"
                        onChange={(e) => {
                            setDiaProyeccion(e.target.value);
                            realizarProyeccion(e.target.value);
                        }}
                    >
                        <option value="">Selecciona un día para la proyección</option>
                        {datosClimaticos.map((dato, index) => (
                            <option key={index} value={dato.fecha}>
                                {new Date(dato.fecha).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="p-4 mb-4 text-sm text-red-900 bg-red-300 rounded-lg">
                        <strong className="font-bold">Error: </strong>{error}
                    </div>
                )}

                {proyeccion && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#324038] p-4 rounded-lg shadow flex gap-2 flex-col">
                            <h3 className="font-semibold">Temperatura</h3>
                            <p className="text-2xl font-bold">{proyeccion.temperatura}°C</p>
                            <FaTemperatureFull size={40} className='p-2 rounded-md bg-[#32ae60]' />
                        </div>
                        <div className="bg-[#3b3343] p-4 rounded-lg shadow flex gap-2 flex-col">
                            <h3 className="font-semibold">Humedad</h3>
                            <p className="text-2xl font-bold">{proyeccion.humedad}%</p>
                            <FaDroplet size={40} className='p-2 rounded-md bg-[#b981da]' />
                        </div>
                        <div className="bg-[#2a323f] p-4 rounded-lg shadow flex gap-2 flex-col">
                            <h3 className="font-semibold">C02</h3>
                            <p className="text-2xl font-bold">{proyeccion.precipitacion} pm</p>
                            <MdOutlineAir size={40} className='p-2 rounded-md bg-[#0a6cf7]'/>
                        </div>
                    </div>
                )}

                {(!error && proyeccion) ? (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Histórico de datos climáticos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={datosClimaticos}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="temperatura" stroke="#32ae60" name="Temperatura (°C)" />
                            <Line yAxisId="right" type="monotone" dataKey="humedad" stroke="#b981da" name="Humedad (%)" />
                            <Line yAxisId="right" type="monotone" dataKey="precipitacion" stroke="#0a6cf7" name="Precipitación (mm)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                ):
                    <div className='w-full h-44 flex items-center justify-center flex-col gap-3'>
                        <MdDoNotDisturbAlt size={35} />
                        <span className='font-bold'>
                            No hay datos disponibles para mostrar.
                        </span>
                    </div>
                }
            </div>
        </div>
    );
};

export default ProyeccionesClimaticas;
