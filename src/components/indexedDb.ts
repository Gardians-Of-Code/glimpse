// Function to store data
const storeData = (
  dbName: string,
  storeName: string,
  data: any
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);

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
  key: any
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);

    request.onerror = function (event) {
      reject("Could not open the database");
    };

    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);
      const getRequest = objectStore.get(key);

      getRequest.onsuccess = function () {
        resolve(getRequest.result);
      };

      getRequest.onerror = function (event) {
        reject("Could not retrieve data");
      };
    };
  });
};

export { storeData, retrieveData };
