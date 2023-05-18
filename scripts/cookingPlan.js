import * as globalValues from "./globalValues.js";
import { StatusHandler } from "./statusHandler.js";

export class CookingPlan {
    constructor() {
        this.drawButtonEl = document.getElementById("draw-button");
        // this.drawButtonEl.addEventListener("click", this.drawDishes.bind(this));
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

    drawDishes(list) {
        const dishTypeArray = [
            globalValues.BREAKFAST_TYPE,
            globalValues.BRUNCH_TYPE,
            globalValues.LUNCH_TYPE,
            globalValues.SUPPER_TYPE,
        ];

        //FIXME: rename variables
        for (const dishType of dishTypeArray) {
            const onlyOneTypeArray = list.dishes.filter((dish) => {
                return dish.type === dishType;
            });

            const dishTypeElements = document.querySelectorAll(
                ".cooking-plan__meal--" + dishType
            );
            dishTypeElements.forEach((dishTypeEl) => {
                const dishTypeRandomIndex = Math.floor(
                    Math.random() * onlyOneTypeArray.length
                );
                const dishContainer = dishTypeEl.querySelector(
                    ".cooking-plan__dish"
                );
                if (onlyOneTypeArray.length > 0) {
                    dishContainer.innerHTML =
                        onlyOneTypeArray[dishTypeRandomIndex].name;
                } else {
                    dishContainer.innerHTML = " - ";
                }
            });
        }
    }
}
