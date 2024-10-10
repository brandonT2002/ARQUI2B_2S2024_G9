// ChartComponent.jsx
// import { createChart, ColorType } from 'lightweight-charts';
// import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useTheme } from "../context/ThemeContext";

export const ChartComponent = ({data}) => {
    const { theme } = useTheme();
    const colorPrimary = theme === 'dark' ? '#6366f1' : '#6366f1';
    const colorFillStart = theme === 'dark' ? '#6366f1' : '#6366f1';
    const colorFillEnd = theme === 'dark' ? '#6366f1' : '#6366f1';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorFillStart} stopOpacity={0.6} />
                        <stop offset="80%" stopColor={colorFillEnd} stopOpacity={0.07} />
                    </linearGradient>
                </defs>

                <Area dataKey="value" stroke={colorPrimary} fill="url(#color)" />

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
                />

                <YAxis
                    datakey="value"
                    axisLine={false}
                    tickLine={false}
                    tickCount={8}
                    tickFormatter={(number) => `${number.toFixed(2)}`}
                />

                <Tooltip content={<CustomTooltip />} />

                <CartesianGrid opacity={0.1} vertical={false} stroke={theme === 'dark' ? '#ffffff' : '#000000'} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ChartComponent;

ChartComponent.propTypes = {
    data: PropTypes.array.isRequired,
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


// // Default props
// ChartComponent.defaultProps = {
//     colors: {
//         backgroundColor: 'black',
//         lineColor: '#2962FF',
//         textColor: 'white',
//         areaTopColor: '#2962FF',
//         areaBottomColor: 'rgba(41, 98, 255, 0.28)',
//     },
// };

