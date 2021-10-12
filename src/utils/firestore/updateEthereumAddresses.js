import { firestore } from "../../Firebase";

export const updateEthereumAddresses = async (userId, ethAddress) => {
  try {
    await firestore()
      .collection("users")
      .doc(userId)
      .update({
        ethAddresses: firestore.FieldValue.arrayUnion(ethAddress),
      });
  } catch (err) {
    console.log("Error updating user", err);
  }
};
