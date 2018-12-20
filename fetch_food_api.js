<<<<<<< HEAD

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
=======
async function search_ingredient(ingredient) {
    var ingredients = [];
    return fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + ingredient + '&search_simple=1&action=process&json=1&page_size=1000')
        .then(function (response)
        {
            return response.json()
        })
        .then(function (data) {
            for (var i = 0; i < data.products.length; i++) {
                if (data.products[i].product_name.includes(ingredient))
                {
                    ingredients.push(data.products[i]);
>>>>>>> 0d08977a15d39233ccac8b1525f393ecbd519d39
                }
            }
            return Promise.resolve(ingredients);
        })
<<<<<<< HEAD
}
console.log(await search_ingredient('lait'));
=======
>>>>>>> 0d08977a15d39233ccac8b1525f393ecbd519d39

}

<<<<<<< HEAD
=======
async function wait_for_me(prod){
    return fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + 'milk' + '&search_simple=1&action=process&json=1&page_size=1000')
        .then(function (resp) {return resp.json() });
    return Promise.resolve('heyyyy' + prod);
}
async function submitForm() {
    let ingredient = document.getElementById("ingredient").value;
    products = await search_ingredient(ingredient);
    for (var i = 0; i < products.length; i++){
        console.log(products[i].product_name)
    }

}
>>>>>>> 0d08977a15d39233ccac8b1525f393ecbd519d39

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