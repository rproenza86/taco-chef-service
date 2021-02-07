export interface IRecipe {
    name: string;
    description: string;
    instructions: string;
    ingredients: IIngredients;
}

interface IIngredients {
    shell: string;
    proteins: string;
    toppings: string;
    sauce: string;
}

// Post Taco Recipe to Spoonacular.com API and return Recipe Card image
export interface IGetSaucesRecipesResponse {
    results: IResult[];
    offset: number;
    number: number;
    totalResults: number;
}

// Retrieve list of Taco sauces from Spoonacular.com Ingredient API types
export interface IResult {
    id: number;
    title: string;
    image: string;
    imageType: ImageType;
}

export enum ImageType {
    Jpg = 'jpg',
}

export interface ICreateCardResponse {
    url: string;
    missedIngredients: any[];
    status: string;
    time: string;
}
