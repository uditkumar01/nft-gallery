import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const nftPortBaseUrl = `https://api.nftport.xyz`;
const moralisPortBaseUrl = `https://deep-index.moralis.io/api/v2`;

export const nftPortInstance = axios.create({
  baseURL: nftPortBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.REACT_APP_NFT_PORT_KEY,
  },
});

export const moralisPortInstance = axios.create({
  baseURL: moralisPortBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.REACT_APP_MORALIS_API_KEY,
  },
});
