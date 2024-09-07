import axios from "./axios";

export const getSensorData = async (data) => axios.post("/sensor/data", data);