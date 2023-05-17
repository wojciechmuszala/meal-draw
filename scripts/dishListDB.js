export const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;
export const dbRequest = indexedDB.open("DishesDatabase", 1);
export let db;

dbRequest.onerror = function (event) {
    console.error(event);
};

dbRequest.onupgradeneeded = function (event) {
    // db = event.target.result;
    db = dbRequest.result;
    const objStore = db.createObjectStore("dishes", { keyPath: "id" });

    objStore.createIndex("type", ["type"], { unique: false });
    objStore.createIndex("name_and_type", ["name", "type"], {
        unique: false,
    });
};

dbRequest.onsuccess = function (event) {
    // db = event.target.result;
    db = dbRequest.result;
};
