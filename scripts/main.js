const showDishListButton = document.querySelector(".dish-list__show");
const dishListContainerElement = document.querySelector(".dish-list");

let db;

const dbRequest = indexedDB.open("Dishes", 1);

dbRequest.onsuccess = function (event) {
    db = event.target.result;
};

dbRequest.onupgradeneeded = function (event) {
    db = event.target.result;

    const objStore = db.createObjectStore("dishes", { keyPath: "id" });

    objStore.transaction.oncomplete = function (event) {
        const dishesStore = db
            .transaction("dishes", "readwrite")
            .objectStore("dishes");
    };
};

dbRequest.onerror = function (event) {
    console.log("Error");
};

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
    dishes = [];

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

        const isDishOnList = this.dishes.some((dishOnList) => {
            return JSON.stringify(dishOnList) === JSON.stringify(newDish);
        });
        if (isDishOnList) {
            statusHandler.add(
                "error",
                "Oops! Same dish of the same type is already on the list!"
            );
            return;
        }

        this.dishes.push(newDish);
        statusHandler.add("success", "The dish has been added to the list!");

        const dishesStore = db
            .transaction("dishes", "readwrite")
            .objectStore("dishes");
        dishesStore.add({
            id: Math.random(),
            name: newDish,
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

const dishList = new DishList();

dishList.addDishButton.addEventListener(
    "click",
    dishList.addNewDish.bind(dishList)
);
