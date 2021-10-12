import { axiosInstance } from ".";

export async function getNftsFromAccountAddress(accountAddress) {
  const url = `/account/${accountAddress}/nfts?chain=ethereum&include=default`;
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (err) {
    console.log(err.response.data);
  }
}
