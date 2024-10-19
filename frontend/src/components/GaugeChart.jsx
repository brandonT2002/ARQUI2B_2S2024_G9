import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { FaTemperatureThreeQuarters } from "react-icons/fa6";

const GaugeChart = ({ value }) => {
    // Ensure the value is between 0 and 100
    const safeValue = Math.min(Math.max(value, 0), 100);

    // Calculate the angle for the filled portion
    const filledAngle = (safeValue / 100) * 180;

    const data = [
        { name: 'Filled', value: filledAngle },
        { name: 'Unfilled', value: 180 - filledAngle }
    ];

    const colors = ['#4338ca', '#2d2871']; // Indigo-700 for filled, darker color for unfilled

    return (
        <div className="w-full p-4 rounded-lg">
            <div className='flex flex-row text-white items-center gap-2'>
                <FaTemperatureThreeQuarters size={36} color="#4ca1f2" className={`p-2 rounded-full bg-[#4ca1f2]/40`} />
                <h2 className="text-xl font-bold text-gray-200">Temperatura</h2>
            </div>
            <div className="relative w-full h-80 ">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="55%"
                            outerRadius="80%"
                            cornerRadius={7}
                            paddingAngle={0}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`}
                                    fill={colors[index]}
                                    stroke="#222124"  // Cambia 'yourColorHere' por el color del borde
                                    strokeWidth={2} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-5xl font-bold text-white">{safeValue.toFixed(1)}</span>
                        <span className="text-2xl text-indigo-400">%</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-400">
                <div>Sales</div>
                <div>Users</div>
            </div>
            <div className="mt-2 flex gap-4 flex-col text-sm font-medium">
                <div className='flex justify-between'>
                    <div className="text-blue-400">1540</div>
                    <div className="text-orange-400">839</div>
                </div>
                <div className='flex justify-between'>
                    <div className="text-blue-400">1540</div>
                    <div className="text-orange-400">839</div>
                </div>
                <div className='flex justify-between'>
                    <div className="text-blue-400">1540</div>
                    <div className="text-orange-400">839</div>
                </div>
                <div className='flex justify-between'>
                    <div className="text-blue-400">1540</div>
                    <div className="text-orange-400">839</div>
                </div>
            </div>
        </div>
    );
};

export default GaugeChart;

GaugeChart.propTypes = {
    value: PropTypes.number.isRequired,
};