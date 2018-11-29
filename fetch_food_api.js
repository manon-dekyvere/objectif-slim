<<<<<<< HEAD
// global variable to contain all the products we searched for
let ingredients = [];
// array to contain reciepe_element : { product : Object, quantity : number }
let reciepie =[];

/**
 * Searches for an ingeredient in the API
 * filters out elements that don't contain in their title the ingredient
 * sorts the ingredients according to their title length ( ex : if we look for milk we first suggest soy milk instead of Milk Chocolat Biscuits )
 * returns array of products
 * @param ingredient
 * @return {Promise<Array>}
 */
async function search_ingredient(ingredient) {

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
                }
            }
            ingredients = ingredients.sort(function(a,b) { { return  a.product_name.length - b.product_name.length; }});
            return Promise.resolve(ingredients);
=======

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
>>>>>>> ea5287cfc45e5824d8b0aaa1b06dfcc11f43f63b
        })
}
console.log(await search_ingredient('lait'));

<<<<<<< HEAD
/**
 * Functions that handles the form validation
 * @return {Promise<void>}
 */
async function submitForm(id) {
    let ingredient_id = document.getElementById('ingredient'+id).value;
    let quantity = document.getElementById('quantity'+id).value;
    let product = retrieve_product_b_id(ingredient_id);
    console.log(product.product_name);
    console.log(get_energy_per_100u(product));
    console.log(quantity * get_energy_per_100u(product).Kcal / 100 );
}

/**
 * computes the energy per 100 u (g or ml) in both Cal and Kj
 * 1 Cal => 4,184 Kj
 * First retrieves the enrgy and enrgy_unit and from there construct an object
 * @returns Object
 * {
 *     "Kj" : xxx
 *     "Cal" : yyy
 * }
 * @param product : product object
 */
function get_energy_per_100u(product)
{
    if(product.nutriments.energy_unit && product.nutriments.energy)
    {
        if  (product.nutriments.energy_unit == "Kcal")
        {
            return {
                "Kj" : Math.round(4.184 *  product.nutriments.energy),
                "Kcal" :Math.round( Number(product.nutriments.energy))
            };
        }else
        {
            return {
                "Kj" :  Math.round(Number(product.nutriments.energy)),
                "Kcal" : Math.round(product.nutriments.energy / 4.184)
            };
        }
    }else
    {
        return {
            "Kj" :  "unknown",
            "Kcal" : "unkown"
        }
    }
}

async function get_product_list(){
    let search_term = document.getElementById("search").value;
    let products = await search_ingredient(search_term);
    let select_element = document.getElementById("ingredient_1");
    for (var i = 0; i < products.length; i++)
    {
        select_element.innerHTML += '<option value="'+products[i].id+'">'+products[i].product_name+'</option>'
    }
}
=======
var product = "egg";

>>>>>>> ea5287cfc45e5824d8b0aaa1b06dfcc11f43f63b

/**
 * function to retrieve product by id from array
 */
function retrieve_product_b_id(id)
{
    for(let i = 0; i < ingredients.length; i++)
    {
        if(ingredients[i].id == id)
        {
            return ingredients[i];
        }
    }
}
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