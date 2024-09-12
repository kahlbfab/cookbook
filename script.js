document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeFile = urlParams.get('recipe') || 'carbonara.json'; // Default to carbonara.json if no recipe is specified

    let originalRecipe = null;

    function adjustServingSize(recipe, desiredServingSize) {
        const originalServingSize = recipe.serving_size;
        const factor = desiredServingSize / originalServingSize;

        function adjustQuantity(ingredient) {
            return ingredient.replace(/(\d+\.?\d*)/g, (match) => {
                const newQuantity = parseFloat(match) * factor;
                return newQuantity % 1 === 0 ? newQuantity.toFixed(0) : parseFloat(newQuantity.toFixed(2)).toString();
            });
        }

        const adjustedIngredients = {};
        if (typeof recipe.ingredients === 'object' && !Array.isArray(recipe.ingredients)) {
            for (const section in recipe.ingredients) {
                adjustedIngredients[section] = recipe.ingredients[section].map(adjustQuantity);
            }
        } else {
            adjustedIngredients.default = recipe.ingredients.map(adjustQuantity);
        }
        return {
            ...recipe,
            ingredients: adjustedIngredients,
            serving_size: desiredServingSize
        };
    }

    function updateRecipeDisplay(recipe) {
        document.getElementById('recipe-name').textContent = recipe.name;

        if (recipe.image) {
            const imageContainer = document.getElementById('recipe-image');
            imageContainer.innerHTML = `<img src="${recipe.image}" alt="${recipe.name}" class="img-fluid rounded">`;
        }

        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        if (typeof recipe.ingredients === 'object' && !Array.isArray(recipe.ingredients)) {
            for (const section in recipe.ingredients) {
                const sectionTitle = document.createElement('h4'); // Use h4 for smaller subtitle
                sectionTitle.textContent = section;
                ingredientsList.appendChild(sectionTitle);

                const ul = document.createElement('ul');
                recipe.ingredients[section].forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ul.appendChild(li);
                });
                ingredientsList.appendChild(ul);
            }
        } else {
            const ul = document.createElement('ul');
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ul.appendChild(li);
            });
            ingredientsList.appendChild(ul);
        }

        const instructionsList = document.getElementById('instructions-list');
        instructionsList.innerHTML = '';
        recipe.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });

        // Set the serving size input to the recipe's serving size
        document.getElementById('serving-size-input').value = recipe.serving_size;
    }

    fetch(`recipes/${recipeFile}`)
        .then(response => response.json())
        .then(recipe => {
            originalRecipe = recipe;
            updateRecipeDisplay(recipe);
        })
        .catch(error => console.error('Error fetching the recipe:', error));

    document.getElementById('serving-size-input').addEventListener('input', () => {
        const desiredServingSize = parseInt(document.getElementById('serving-size-input').value, 10);
        if (originalRecipe && desiredServingSize > 0) {
            const adjustedRecipe = adjustServingSize(originalRecipe, desiredServingSize);
            updateRecipeDisplay(adjustedRecipe);
        }
    });
});