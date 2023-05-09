//data base based on indexedDB import form other file
import * as dishListDB from "./dishListDB.js";
let db;

// declaration of constants
const BREAKFAST_TYPE = "breakfast";
const BRUCH_TYPE = "brunch";
const LUNCH_TYPE = "lunch";
const SUPPER_TYPE = "supper";
const MATH_RANDOM_MULTIPLIER = 10000000000000000;

//other declarations
const getButton = document.getElementById("draw-button");
// let dishes = [];

function isDishOnList(dish, list) {
    return list.some((dishOnList) => {
        return JSON.stringify(dishOnList) === JSON.stringify(dish);
    });
}

//dish object class
class Dish {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

//handling of basic messages
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

// dish list class
class DishList {
    constructor() {
        this.dishes = [];
        const self = this;
        this.addDishButton = document.getElementById("add-new-dish-button");
        this.showButton = document.querySelector(".dish-list__show");
        this.containerElement = document.querySelector(".dish-list");
    }

    // show list container element
    showList() {
        this.containerElement.classList.toggle("dish-list--active");
    }

    // add new dish to list
    addNewDish() {
        const dishNameInput = document.getElementById("enter-new-dish-name");
        const dishTypeSelect = document.getElementById("enter-new-dish-type");
        const statusHandler = new StatusHandler(".add__status-info");

        // clear previous messages
        statusHandler.reset();

        // get dish from input
        const dishName = dishNameInput.value.trim();
        // --- check if input is empty
        if (dishName.trim() === "") {
            statusHandler.add("error", "Oops! Please complete all fields!");
            return;
        }
        const dishType = dishTypeSelect.value;
        // --- cleaning input after data collection
        dishNameInput.value = "";

        // creating a new dish based on the data collected from the input
        const newDish = new Dish(dishName, dishType);

        // check if the dish has already been added + error handling
        if (isDishOnList(newDish, this.dishes)) {
            statusHandler.add(
                "error",
                "Oops! Same dish of the same type is already on the list!"
            );
            return;
        }

        // adding dish to dish array
        this.dishes.push(newDish);

        // creating and database transaction
        const objStore = dishListDB.db
            .transaction("dishes", "readwrite")
            .objectStore("dishes");

        // adding dish to database
        objStore.add({
            id: Math.random() * MATH_RANDOM_MULTIPLIER,
            name: dishName,
            type: dishType,
        });

        //succes handling
        statusHandler.add("success", "The dish has been added to the list!");

        //creating new dish element in dish list container
        const newDishElement = document.createElement("li");
        newDishElement.classList.add("dish-list__item");
        newDishElement.innerHTML = dishName;
        let dishListElement = document.getElementById(`dish-list-${dishType}`);
        dishListElement.append(newDishElement);
    }
}

// async function declaration because database operations are async
async function renderDishesFromDBToList(list) {
    try {
        // preparing the database for reading + creating indexes for searching the database
        db = await dishListDB.dbPromise;
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

        // loop through all type of dishes in database
        for (const typeQuery of typeQueryArray) {
            typeQuery.onsuccess = function () {
                // loop through all dishes of currently searched type
                typeQuery.result.forEach((dish) => {
                    const newDish = new Dish(dish.name, dish.type);

                    // check if the dish has already been added
                    if (isDishOnList(newDish, list.dishes)) {
                        return;
                    }

                    // adding dish to dish array
                    list.dishes.push(newDish);

                    //creating new dish element in currently searched dish type list container
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

// event listeners
dishList.addDishButton.addEventListener(
    "click",
    dishList.addNewDish.bind(dishList)
);

getButton.addEventListener("click", () => {
    const breakfastElements = document.querySelectorAll(
        ".cooking-plan__meal--breakfast"
    );

    breakfastElements.forEach((breakfastEl) => {
        console.log(breakfastEl.querySelector(".cooking-plan__dish"));
    });

    const randomIndex = Math.floor(Math.random() * dishes.length);
});

dishList.showButton.addEventListener("click", dishList.showList.bind(dishList));

// -------

renderDishesFromDBToList(dishList);
