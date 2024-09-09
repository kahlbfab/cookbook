const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, 'recipes');
const outputFilePath = path.join(__dirname, 'recipes.json');

fs.readdir(recipesDir, (err, files) => {
    if (err) {
        console.error('Unable to scan directory:', err);
        return;
    }

    const jsonFiles = files.filter(file => path.extname(file) === '.json');
    const recipes = { recipes: jsonFiles };

    fs.writeFile(outputFilePath, JSON.stringify(recipes, null, 2), err => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('recipes.json has been generated');
    });
});