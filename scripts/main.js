import { DishList } from "./dishList.js";
import { CookingPlan } from "./cookingPlan.js"
class App {
    static isSafariCheck() {
        if (window.safari) {
            alert(
                "Safari does not allow the application to function fully - your entered data will not be remembered after refreshing the page. Please change web browser."
            );
        }
    }

    static init() {
        this.isSafariCheck();

        const dishList = new DishList();
        const cookingPlan = new CookingPlan();

        dishList.renderDishesFromDBToList();

        cookingPlan.drawButtonEl.addEventListener("click", function () {
            cookingPlan.drawDishes(dishList);
        });
    }
}

App.init();
