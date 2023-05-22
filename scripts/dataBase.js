export const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;
export const dbRequest = indexedDB.open("DishesDatabase", 1);
export let db;

export const dbPromise = new Promise((resolve, reject) => {
    dbRequest.onerror = function (event) {
        function errorHandling() {
            console.error(event);
            alert(
                "The database has not been created - the application will not work properly. If you use the private browser mode, the data storage functionality is disabled."
            );
        }
        reject(errorHandling());
    };

    dbRequest.onupgradeneeded = function (event) {
        // db = event.target.result;
        console.log("tutaj");
        db = dbRequest.result;
        const objStore = db.createObjectStore("dishes", { keyPath: "id" });

        objStore.createIndex("type", ["type"], { unique: false });
        objStore.createIndex("name_and_type", ["name", "type"], {
            unique: false,
        });

        resolve(db);
    };

    dbRequest.onsuccess = function (event) {
        // db = event.target.result;
        db = dbRequest.result;
        resolve(db);
    };
});
