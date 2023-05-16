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
// TODO:
// [ ] database operations
// [ ] delete item from list
// [ ] clear list (confirmation modal?)
class DishList {
    constructor() {
        const self = this;
        this.dishes = [];
        this.listContainerEl = document.querySelector(".dish-list");
        this.addDishButton = document.getElementById("add-new-dish-button");
        this.addDishButton.addEventListener(
            "click",
            this.addNewDish.bind(this)
        );
        this.showButtonEl = document.querySelector(".dish-list__show");
        this.showButtonEl.addEventListener("click", this.showList.bind(this));
        this.deleteDishButtonEl = document.getElementById("delete-dish-button");
        this.deleteDishButtonEl.addEventListener(
            "click",
            this.showDeleteOption.bind(this)
        );
    }

    // check if the dish has already been added
    isDishOnList(dish) {
        return this.dishes.some((dishOnList) => {
            //JSON.stringify for reading from database
            return JSON.stringify(dishOnList) === JSON.stringify(dish);
        });
    }

    //create new <li> element on list
    createDishElement(dishName, dishType) {
        const newDishElement = document.createElement("li");
        newDishElement.classList.add("dish-list__item");
        newDishElement.innerHTML = dishName;
        let dishListElement = document.getElementById(`dish-list-${dishType}`);
        dishListElement.append(newDishElement);

        const deleteDishButton = document.createElement("span");
        deleteDishButton.classList.add("dish-list__delete-item-button");
        deleteDishButton.innerHTML = "×";
        newDishElement.append(deleteDishButton);
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
        if (this.isDishOnList(newDish)) {
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
        this.createDishElement(dishName, dishType);
    }

    // async function declaration because database operations are async and crated as promise
    async renderDishesFromDBToList() {
        try {
            console.log("robie sie");
            const self = this;
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
                        if (self.isDishOnList(newDish)) {
                            return;
                        }

                        // adding dish to dishes array
                        self.dishes.push(newDish);

                        //creating new dish element in currently searched dish type list container
                        self.createDishElement(newDish.name, newDish.type);
                    });
                };
            }

            //add new attribute "rendered"
            this.listContainerEl.setAttribute("rendered", "true");
        } catch (error) {
            console.log(error);
        }
    }

    showDeleteOption() {
        this.deleteDishButtonEl.classList.toggle(
            "dish-list__delete-dish--active"
        );
        if (
            this.deleteDishButtonEl.classList.contains(
                "dish-list__delete-dish--active"
            )
        ) {
            this.deleteDishButtonEl.innerHTML = "Cancel deletion";
        } else {
            this.deleteDishButtonEl.innerHTML = "Delete dish";
        }

        const dishListEls = document.querySelectorAll(".dish-list__item");

        dishListEls.forEach((dish) => {
            dish.classList.toggle("dish-list__item--delete-active");
            dish.querySelector(
                ".dish-list__delete-item-button"
            ).classList.toggle("dish-list__delete-item-button--active");
        });
    }

    deleteDishFromList() {}

    clearDishList() {}

    // show list container element
    showList() {
        if (this.listContainerEl.getAttribute("rendered") === "false") {
            this.renderDishesFromDBToList();
        }
        this.listContainerEl.classList.toggle("dish-list--active");
    }
}

class cookingPlan {
    constructor() {
        this.drawButtonEl = document.getElementById("draw-button");
        this.drawButtonEl.addEventListener("click", this.drawDishes);
        this.breakfastContainerEls = document.querySelectorAll(
            ".cooking-plan__meal--breakfast"
        );
        this.brunchContainerEls = document.querySelectorAll(
            ".cooking-plan__meal--brunch"
        );
        this.lunchContainerEls = document.querySelectorAll(
            ".cooking-plan__meal--lunch"
        );
        this.supperContainerEls = document.querySelectorAll(
            ".cooking-plan__meal--supper"
        );
    }

    drawDishes() {
        const breakfastElements = document.querySelectorAll(
            ".cooking-plan__meal--breakfast"
        );

        breakfastElements.forEach((breakfastEl) => {
            console.log(breakfastEl.querySelector(".cooking-plan__dish"));
        });

        const randomIndex = Math.floor(Math.random() * dishList.dishes.length);
    }
}

const dishList = new DishList();

getButton.addEventListener("click", () => {
    const breakfastElements = document.querySelectorAll(
        ".cooking-plan__meal--" + BREAKFAST_TYPE
    );

    breakfastElements.forEach((breakfastEl) => {
        console.log(breakfastEl.querySelector(".cooking-plan__dish"));
    });

    const randomIndex = Math.floor(Math.random() * dishList.dishes.length);
});
