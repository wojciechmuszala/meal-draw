const showDishListButton = document.querySelector(".dish-list__show");
const dishListContainerElement = document.querySelector(".dish-list");
const getButton = document.getElementById("draw-button");
const MATH_RANDOM_MULTIPLIER = 10000000000000000;
const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let db;
const dbRequest = indexedDB.open("DishesDatabase", 1);
let dishesArray;
dishes = [];

const BREAKFAST_TYPE = "breakfast";
const BRUCH_TYPE = "brunch";
const LUNCH_TYPE = "lunch";
const SUPPER_TYPE = "supper";

const dbPromise = new Promise((resolve, reject) => {
    dbRequest.onerror = function (event) {
        reject(console.error(event));
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

        resolve(db);
    };
});

showDishListButton.addEventListener("click", () => {
    dishListContainerElement.classList.toggle("dish-list--active");
});

class Dish {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

class StatusHandler {
    constructor(querySelector) {
        this.element = document.querySelector(querySelector);
    }

    add(statusType, message) {
        if (statusType === "success") {
            this.element.classList.add("status-info--success");
            this.element.innerHTML = message;
        } else if (statusType === "error") {
            this.element.classList.add("status-info--error");
            this.element.innerHTML = message;
        }
    }

    reset() {
        this.element.classList.remove("status-info--error");
        this.element.classList.remove("status-info--success");
        this.element.innerHTML = "";
    }
}
class DishList {
    constructor() {
        this.addDishButton = document.getElementById("add-new-dish-button");
    }

    addNewDish() {
        const dishNameInput = document.getElementById("enter-new-dish-name");
        const dishTypeSelect = document.getElementById("enter-new-dish-type");
        const statusHandler = new StatusHandler(".add__status-info");

        statusHandler.reset();

        const dishName = dishNameInput.value.trim();
        if (dishName.trim() === "") {
            statusHandler.add("error", "Oops! Please complete all fields!");
            return;
        }

        const dishType = dishTypeSelect.value;
        dishNameInput.value = "";

        const newDish = new Dish(dishName, dishType);

        const isDishOnList = dishes.some((dishOnList) => {
            return JSON.stringify(dishOnList) === JSON.stringify(newDish);
        });
        if (isDishOnList) {
            statusHandler.add(
                "error",
                "Oops! Same dish of the same type is already on the list!"
            );
            return;
        }

        dishes.push(newDish);
        statusHandler.add("success", "The dish has been added to the list!");

        const objStore = db
            .transaction("dishes", "readwrite")
            .objectStore("dishes");

        objStore.add({
            id: Math.random() * MATH_RANDOM_MULTIPLIER,
            name: dishName,
            type: dishType,
        });

        //add new dish to dishList
        const newDishElement = document.createElement("li");
        newDishElement.classList.add("dish-list__item");
        newDishElement.innerHTML = dishName;
        let dishListElement = document.getElementById(`dish-list-${dishType}`);
        dishListElement.append(newDishElement);
    }
}

async function renderDishesFromDBToList() {
    try {
        db = await dbPromise;
        const objStore = db
            .transaction("dishes", "readwrite")
            .objectStore("dishes");
        const typeIndex = objStore.index("type");
        const typeQueryArray = [
            typeIndex.getAll([BREAKFAST_TYPE]),
            typeIndex.getAll([BRUCH_TYPE]),
            typeIndex.getAll([LUNCH_TYPE]),
            typeIndex.getAll([SUPPER_TYPE]),
        ];

        for (const typeQuery of typeQueryArray) {
            typeQuery.onsuccess = function () {

                typeQuery.result.forEach((dish) => {
                    const newDish = new Dish(dish.name, dish.type);

                    const isDishOnList = dishes.some((dishOnList) => {
                        return (
                            JSON.stringify(dishOnList) ===
                            JSON.stringify(newDish)
                        );
                    });
                    if (isDishOnList) {
                        return;
                    }

                    dishes.push(newDish);

                    const newDishElement = document.createElement("li");
                    newDishElement.classList.add("dish-list__item");
                    newDishElement.innerHTML = newDish.name;
                    let dishListElement = document.getElementById(
                        `dish-list-${newDish.type}`
                    );
                    dishListElement.append(newDishElement);
                });
            };
        }
    } catch (error) {
        console.log(error);
    }
}

const dishList = new DishList();

dishList.addDishButton.addEventListener(
    "click",
    dishList.addNewDish.bind(dishList)
);

// getButton.addEventListener("click", renderDishesFromDBToList);

renderDishesFromDBToList();
