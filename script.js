document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeFile = urlParams.get('recipe');

    if (recipeFile) {
        fetch(`recipes/${recipeFile}`)
            .then(response => response.json())
            .then(recipe => {
                document.getElementById('recipe-name').textContent = recipe.name;
                document.getElementById('serving-size').textContent = `Serving Size: ${recipe.serving_size}`;

                const ingredientsList = document.getElementById('ingredients-list');
                recipe.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });

                const instructionsList = document.getElementById('instructions-list');
                recipe.instructions.forEach(instruction => {
                    const li = document.createElement('li');
                    li.textContent = instruction;
                    instructionsList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching the recipe:', error));
    } else {
        console.error('No recipe specified');
    }
});