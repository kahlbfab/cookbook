document.addEventListener('DOMContentLoaded', () => {
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            const recipes = data.recipes;
            const recipeList = document.getElementById('recipe-list');

            // Create container for grouped recipes
            const recipeGroups = {
                starters: [],
                main: [],
                dessert: []
            };

            // Create promises array for all recipe fetches
            const fetchPromises = recipes.map(recipeFile => 
                fetch(`recipes/${recipeFile}`)
                    .then(response => response.json())
                    .then(recipe => ({
                        name: recipe.name,
                        category: recipe.category || 'main', // Default to main if no category
                        file: recipeFile
                    }))
            );

            // Wait for all recipes to be fetched
            Promise.all(fetchPromises)
                .then(recipesData => {
                    // Group recipes by category
                    recipesData.forEach(recipe => {
                        if (recipeGroups[recipe.category]) {
                            recipeGroups[recipe.category].push(recipe);
                        }
                    });

                    // Sort recipes alphabetically within each category
                    Object.keys(recipeGroups).forEach(category => {
                        recipeGroups[category].sort((a, b) => a.name.localeCompare(b.name));
                    });

                    // Clear the recipe list
                    recipeList.innerHTML = '';

                    // Create sections for each category
                    Object.entries(recipeGroups).forEach(([category, recipes]) => {
                        if (recipes.length > 0) {
                            // Create category header
                            const categoryHeader = document.createElement('h2');
                            categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                            categoryHeader.className = 'mt-4 mb-3';
                            recipeList.appendChild(categoryHeader);

                            // Create list for this category
                            const categoryList = document.createElement('ul');
                            categoryList.className = 'list-group mb-4';

                            // Add recipes to this category
                            recipes.forEach(recipe => {
                                const li = document.createElement('li');
                                li.className = 'list-group-item';
                                const a = document.createElement('a');
                                a.href = `recipe.html?recipe=${recipe.file}`;
                                a.textContent = recipe.name;
                                li.appendChild(a);
                                categoryList.appendChild(li);
                            });

                            recipeList.appendChild(categoryList);
                        }
                    });
                });
        })
        .catch(error => console.error('Error fetching the recipe list:', error));
});