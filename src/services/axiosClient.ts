import axios from 'axios';

const init = (baseURL: string = '', accessToken: string | null) => {

  let formattedBaseURL: string = baseURL;

  // Remove characters for formatting
  formattedBaseURL = formattedBaseURL.replace('https://', '');
  formattedBaseURL = formattedBaseURL.replace('http://', '');
  formattedBaseURL = formattedBaseURL.replace('/', '');

  if(formattedBaseURL.includes('localhost')){
    formattedBaseURL = `http://${formattedBaseURL}`;
  } else {
    formattedBaseURL = `https://${formattedBaseURL}`;
  }

  const axiosClient = axios.create({
    baseURL: formattedBaseURL,
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
