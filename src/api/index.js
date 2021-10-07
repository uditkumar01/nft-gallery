import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const url = `https://api.nftport.xyz`;

const AUTH_KEY = process.env.REACT_APP_NFT_PORT_KEY;

export const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Authorization: AUTH_KEY,
  },
});
