import axios from 'axios';

const { SIMULATOR_CONTROLLER_HOST_API } = process.env;

// ----------------------------------------------------------------------

console.log('SIMULATOR_CONTROLLER_HOST_API ', SIMULATOR_CONTROLLER_HOST_API);


export const simulatorControllerIns = axios.create({ baseURL: SIMULATOR_CONTROLLER_HOST_API });

simulatorControllerIns.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error(error);

    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

// ----------------------------------------------------------------------
