import { db } from "@/firebase/config";
import { onValue, ref } from "firebase/database";

export const getDataFromDatabase = async () => {
  try {
    const categoryRef = ref(db, "products");
    let data;
    onValue(categoryRef, (snapshot) => {
      const valData = snapshot.val();
      data = valData;
      console.log("DATA", data);
    });
    if (data !== undefined) return data;
  } catch (error) {
    console.log("ERROR", error);
    return false;
  }
};
