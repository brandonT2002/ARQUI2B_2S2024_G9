import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';
import { getTempeartureRequest,getHumidityRequest,getC02Request,getLightRequest,getProximityRequest } from "../api/sensor"
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

    const getSensorData = async (id,start,end) => {
        // setSensorData(data);
        // const res = 
        try{
            console.log(id);
            var res = null;
            if (id ===1){
                res = await getTempeartureRequest();
            } else if (id ===2){
                res = await getHumidityRequest();
            }
            else if (id ===3){
                res = await getLightRequest();
            }
            else if (id ===4){
                res = await getC02Request();
            }
            else if (id ===5){
                res = await getProximityRequest();
            }

            if(!res){
                // data = [];
                setSensorData([]);
            }

            const formattedDate = new Date(start).toISOString().split('T')[0];
            const formattedEndDate = new Date(end).toISOString().split('T')[0];

            // filtrar por fecha
            const data = res.data.filter((item) => {
                const date = new Date(item.date).toISOString().split('T')[0];
                return date >= formattedDate && date <= formattedEndDate;
            });

            // ordenar por fecha
            data.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            console.log(data)
            setSensorData(data);
        // console.log(data, formattedDate, formattedEndDate);
        }catch(error){
            console.error(error)
        }
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