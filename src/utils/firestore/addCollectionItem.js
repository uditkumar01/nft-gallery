import { firestore } from "../../Firebase";

export const addCollectionItem = async (collectionId, item) => {
  try {
    // update the collection doc
    const collectionRef = await firestore()
      .collection("collections")
      .doc(collectionId);
    const docRef = await collectionRef.update({
      items: firestore.FieldValue.arrayUnion(item),
    });
    return true;
  } catch (error) {
    console.log("Error adding collection item: ", error);
    return false;
  }
};
