
async function submitForm() {
    var ingredient = document.getElementById("ingredient").value;
    console.log(await search_ingredient('lait'));

}

async function search_ingredient(ingredient) {
    var ingredients = [];
    fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + ingredient + '&search_simple=1&action=process&json=1&page_size=1000')
        .then(function (response) {
            response.json().then(function (data) {
                for (var i = 0; i < data.products.length; i++) {
                    if (data.products[i].product_name.includes(ingredient)) {
                        ingredients.push(data.products[i]);

                    }
                }
                return ingredients;
            })
        })
}
console.log(await search_ingredient('lait'));

var product = "egg";


/*
    .then(function(data) {
        data.json().then(function(value){
            var div = document.getElementById('main_content');
            div.innerHTML += value;
        })
})
.catch(function(error) {
    // If there is any error you will catch them here
});*/