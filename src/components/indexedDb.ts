const createDB = (dbName: string, storeName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);
    request.addEventListener("error", (event) => {
      console.log("Request error:", request.error);
    });

    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(storeName, { autoIncrement: true });
    };

    request.onsuccess = function () {
      resolve();
    };
  });
};

// Function to store data
const storeData = (
  dbName: string,
  storeName: string,
  data: any,
  version: number = 1
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version + 1);

    request.onerror = function (event) {
      reject("Could not open the database");
    };

    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const addRequest = objectStore.put(data, 1);

      addRequest.onsuccess = function () {
        resolve();
      };

      addRequest.onerror = function (event) {
        reject("Could not store data");
      };
    };
  });
};

// Function to retrieve data
const retrieveData = (
  dbName: string,
  storeName: string,
  key: any,
  version: number = 1
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version + 1);

    request.onerror = function (event) {
      console.log(event);
    };

    request.addEventListener("error", (event) => {
      console.log("Request error:", request.error);
    });

    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      try {
        const transaction = db.transaction(storeName, "readonly");
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get(key);

        getRequest.onsuccess = function () {
          resolve(getRequest.result);
        };

        getRequest.onerror = function (event) {
          reject("Could not retrieve data");
        };
      } catch (error) {
        // if the object store does not exist
        if (error.name === "NotFoundError") {
          console.log("Object store not found");
          // create the object store
          createDB(dbName, storeName).then(() => {
            console.log("Object store created");
            // store a dummy value
            storeData(dbName, storeName, { dummy: "data" }).then(() => {
              console.log("Dummy data stored");
              // retrieve the dummy value
              // retrieveData(dbName, storeName, 1).then((data) => {
              //   console.log("Dummy data retrieved");
              //   // delete the dummy value
              //   deleteData(dbName, storeName, 1).then(() => {
              //     console.log("Dummy data deleted");
              //     // resolve with an empty object
              //     resolve({});
              //   });
              // });
            });
          });
        }
      }
    };
  });
};

export { storeData, retrieveData };
