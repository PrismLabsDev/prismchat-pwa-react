import axios from 'axios';

const init = (baseURL: string, accessToken: string | null) => {
  const axiosClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
  });
  
  axiosClient.interceptors.request.use((config: any): any => {
    let newConfig = config;
    if (accessToken !== null) {
      newConfig.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return newConfig;
  });

  return axiosClient;
}

const exportObj = {
  init
}

export default exportObj;
