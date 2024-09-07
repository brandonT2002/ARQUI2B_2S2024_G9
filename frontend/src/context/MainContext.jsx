import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

const MainContext = createContext();

export const useMain = () => {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error('useMain must be used within a MainProvider')
    }
    return context;
}

export const MainProvider = ({ children }) => {
    const [sensorData, setSensorData] = useState([]);

    const getSensorData = async (data,start,end) => {
        setSensorData(data);
        const formattedDate = new Date(start).toISOString().split('T')[0];
        const formattedEndDate = new Date(end).toISOString().split('T')[0];
        console.log(data, formattedDate, formattedEndDate);   
    }

    return (
        <MainContext.Provider value={{
            getSensorData,
            sensorData
        }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainContext;

MainProvider.propTypes = {
    children: PropTypes.node.isRequired
}