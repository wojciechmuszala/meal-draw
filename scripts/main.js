class Dish {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        // this.id = Math.random();
    }
}
class DishList {
    dishes = [];

    constructor() {
        this.addDishButton = document.getElementById("add-new-dish-button");
    }

    createDish() {
        const dishNameInput = document.getElementById("enter-new-dish-name");
        const dishTypeSelect = document.getElementById("enter-new-dish-type");
        const dishName = dishNameInput.value.trim();
        if (dishName.trim() === "") {
            console.log("Już jest");
            return;
        }
        const dishType = dishTypeSelect.value;
        dishNameInput.value = "";

        const newDish = new Dish(dishName, dishType);

        const isDishOnList = this.dishes.some((dishOnList) => {
            return JSON.stringify(dishOnList) === JSON.stringify(newDish);
        });
        if (isDishOnList) {
            return;
        }
        this.dishes.push(newDish);

        console.log(this.dishes);
    }
}

dishList = new DishList();

dishList.addDishButton.addEventListener(
    "click",
    dishList.createDish.bind(dishList)
);
