// declaration of constants
export const BREAKFAST_TYPE = "breakfast";
export const BRUNCH_TYPE = "brunch";
export const LUNCH_TYPE = "lunch";
export const SUPPER_TYPE = "supper";
export const MATH_RANDOM_MULTIPLIER = 10000000000000000;

//dish object class
export class Dish {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
