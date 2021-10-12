import { firestore } from "../../Firebase";

export async function getUserFromUsername(username) {
  try {
    const userDoc = await firestore()
      .collection("users")
      .where("username", "==", username)
      .get();
    if (!userDoc.empty) {
      const user = userDoc.docs[0].data();
      return user;
    }
    return {};
  } catch (error) {
    console.log("Error in getUserFromUsername", error);
    return {};
  }
}
