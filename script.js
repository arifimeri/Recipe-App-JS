const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');

const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        if (!response.meals) {
            recipeContainer.innerHTML = `<p>No recipes found!</p>`;
            return;
        }

        recipeContainer.innerHTML = "";

        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src ="${meal.strMealThumb}" alt="${meal.strMeal}"> 
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;

            const ViewRecipebutton = document.createElement('button');
            ViewRecipebutton.textContent = "View Recipe";
            ViewRecipebutton.classList.add('ViewRecipebutton')
            recipeDiv.appendChild(ViewRecipebutton);

            // Adding Eventlistener to recipe button
            ViewRecipebutton.addEventListener('click', ()=>{
                openRecipePopup(meal);
            })

            recipeContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        recipeContainer.innerHTML = `<p>Error fetching recipes. Please try again.</p>`;
        console.error("Error fetching recipes:", error);
    }
};

// Function to fetch ingredents and measurements
const fetchIngredents = (meal) => {
   let ingredentsList = "";
   for (let i = 1; i <=20; i++){
   const ingredent = meal[`strIngredient${i}`];
   if (ingredent) {
    const measure = meal[`strMeasure${i}`];
    ingredentsList += `<li>${measure} ${ingredent}</li>`
    }
    else {
        break;
    }
   }
   
    return ingredentsList;

}
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredents:</h3>
    <ul class="ingredentsList">${fetchIngredents(meal)}</ul>
     <div>
        <h3>Instructions:</h3>
        <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>
    `

   
    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click', ()=> {
    recipeDetailsContent.parentElement.style.display = "none"
})
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    }
    else {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
