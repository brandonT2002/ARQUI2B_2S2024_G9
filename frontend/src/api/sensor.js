import axios from "./axios";

export const getTempeartureRequest = async () => axios.get("temperature");
export const getHumidityRequest = async () => axios.get("humidity");
export const getC02Request = async () => axios.get("co2");
export const getProximityRequest = async () => axios.get("proximity");
export const getLightRequest = async () => axios.get("light");