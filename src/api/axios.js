import axios from "axios";
const BASE_URL = "https://65cc8908dd519126b83ed0e1.mockapi.io/";

const orchidList = axios.create({
  baseURL: BASE_URL,
});

export const getOrchids = async (category) => {
  let url = "orchidsList";
  if (category) {
    url += `?category=${category}`;
  }
  const response = await orchidList.get(url);
  return response.data;
};

export const getOrchidById = async (id) => {
  const response = await orchidList.get(`orchidsList/${id}`);
  return response.data;
};
