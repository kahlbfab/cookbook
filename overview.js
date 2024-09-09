document.addEventListener('DOMContentLoaded', () => {
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            const recipes = data.recipes;
            const recipeList = document.getElementById('recipe-list');

            recipes.forEach(recipeFile => {
                fetch(`recipes/${recipeFile}`)
                    .then(response => response.json())
                    .then(recipe => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = `recipe.html?recipe=${recipeFile}`;
                        a.textContent = recipe.name;
                        li.appendChild(a);
                        recipeList.appendChild(li);
                    })
                    .catch(error => console.error('Error fetching the recipe:', error));
            });
        })
        .catch(error => console.error('Error fetching the recipe list:', error));
});