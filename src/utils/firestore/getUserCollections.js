import { firestore } from "../../Firebase";

export async function getUserCollections(userId) {
  try {
    // getting the collections of the user
    const userCollections = await firestore()
      .collection("collections")
      .where("owner", "==", userId)
      .get();
    if (!userCollections?.empty) {
      const allCollections = userCollections.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      }));
      return allCollections;
    }
    return [];
  } catch (error) {
    console.log("Error getting collections", error);
    return [];
  }
}
