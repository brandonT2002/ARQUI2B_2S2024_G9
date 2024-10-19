// ChartComponent.jsx
// import { createChart, ColorType } from 'lightweight-charts';
// import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    Area,
    Tooltip,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useTheme } from "../context/ThemeContext";

export const ChartHome = ({ data, color }) => {
    const { theme } = useTheme();
    let colorPrimary = theme === 'dark' ? color : color;
    let colorFillStart = theme === 'dark' ? color : color;
    let colorFillEnd = theme === 'dark' ? color : color;
    let id_color = `color-${color}`;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} >
                <defs>
                    <linearGradient id={id_color} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorFillStart} stopOpacity={0.6} />
                        <stop offset="80%" stopColor={colorFillEnd} stopOpacity={0.07} />
                    </linearGradient>
                </defs>

                <Area dataKey="value"
                    stroke={colorPrimary}
                    fill={`url(#${id_color})`}
                    strokeLinejoin="round" // Suaviza las esquinas
                    type="monotone" // Suaviza la línea
                />

                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(str) => {
                        const date = parseISO(str);
                        if (date.getDate() % 7 === 0) {
                            return format(date, "MMM, d");
                        }
                        return "";
                    }}
                    tick={{ opacity: 0 }}  // Esto oculta los valores en el eje X
                />

                <Tooltip content={<CustomTooltip />} />

            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ChartHome;

ChartHome.propTypes = {
    data: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
};

function CustomTooltip({ active, payload, label }) {
    if (active) {
        return (
            <div className="bg-subpanel_bg-light dark:bg-subpanel_bg-dark text-text-light dark:text-text-dark p-4 text-center rounded-md">
                <h4 className='font-bold'>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4>
                <p>{payload[0].value.toFixed(2)}</p>
            </div>
        );
    }
    return null;
}

CustomTooltip.propTypes = {
    active: PropTypes.bool.isRequired,
    payload: PropTypes.array,
    label: PropTypes.string,
};