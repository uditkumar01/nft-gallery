import { firestore } from "../../Firebase";

export const updateTezosAddresses = async (userId, tezosAddress) => {
  try {
    await firestore()
      .collection("users")
      .doc(userId)
      .update({
        tezosAddresses: firestore.FieldValue.arrayUnion(tezosAddress),
      });
  } catch (err) {
    console.log("Error updating user", err);
  }
};
