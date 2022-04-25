import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref } from "firebase/database";

import { fireConfig } from "./fireConfig";

const app = initializeApp(fireConfig);
const dbRef = ref(getDatabase(app));

export function getAllCenters() {
  return new Promise((resolve, reject) => {
    get(child(dbRef, `centers`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject("No data available");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getZipBoundaries(zip: string) {
  return new Promise((resolve, reject) => {
    get(child(dbRef, `boundaries/${zip}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject("No data available");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
