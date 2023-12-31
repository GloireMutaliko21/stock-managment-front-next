import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

export const fetchData = async (endpoint: string, token?: string) => {
  try {
    const user = await axios.get(`${baseUrl + '/api/user'}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('user', user.data);

    const res = await axios.get(`${endpoint}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
    });
    return { data: res.data };
  } catch (e: any) {
    return { error: e.response?.data };
  }
};

interface AxiosPostAndPut {
  endpoint: string;
  token?: string;
  data?: unknown;
}

export const getRequest = async ({ endpoint, token }: AxiosPostAndPut) => {
  try {
    const res = await axios.get(`${baseUrl + endpoint}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
    });
    return { data: res.data };
  } catch (e: any) {
    return { error: e.response?.data };
  }
};

export const postRequest = async ({ endpoint, token, data }: AxiosPostAndPut) => {
  try {
    const res = await axios.post(`${baseUrl + endpoint}`, data, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
    });
    return { data: res.data };
  } catch (e: any) {
    return { error: e.response?.data };
  }
};

export const patchRequest = async ({ endpoint, token, data }: AxiosPostAndPut) => {
  try {
    const res = await axios.patch(`${baseUrl + endpoint}`, data, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
    });
    return { data: res.data };
  } catch (e: any) {
    return { error: e.response?.data };
  }
};

export const postLocalRequest = async ({ endpoint, token, data }: AxiosPostAndPut) => {
  const res = await axios.post(endpoint, data, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
  });
  return { data: res.data };
};

export const deleteData = async ({ endpoint, token }: AxiosPostAndPut) => {
  console.log(token);
  try {
    const res = await axios.delete(`${baseUrl + endpoint}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
    });
    return { data: res.data };
  } catch (e: any) {
    return { error: e.response?.data };
  }
};

export const putData = async ({ endpoint, token, data }: AxiosPostAndPut) => {
  console.log(token);
  try {
    const res = await axios.put(`${baseUrl + endpoint}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
    });
    return { data: res.data };
  } catch (e: any) {
    return { error: e.response?.data };
  }
};
