/**
 * Searches for an ingeredient in the API
 * filters out elements that don't contain in their title the ingredient
 * sorts the ingredients according to their title length ( ex : if we look for milk we first suggest soy milk instead of Milk Chocolat Biscuits )
 * returns array of products
 * @param ingredient
 * @return {Promise<Array | never>}
 */
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
                }
            }
            ingredients = ingredients.sort(function(a,b) { { return  a.product_name.length - b.product_name.length; }});
            return Promise.resolve(ingredients);
        })

}

/**
 * Functions that handles the form validation
 * @return {Promise<void>}
 */
async function submitForm() {
    let ingredient = document.getElementById("ingredient").value;
    products = await search_ingredient(ingredient);
    for (var i = 0; i < products.length; i++)
    {
        console.log(products[i].product_name);
        //console.log(products[i].nutriments.energy + ' ' + products[i].nutriments.energy_unit);
        console.log(get_energy_per_100u(products[i]));
    }
}

/**
 * computes the energy per 100 u (g or ml) in both Cal and Kj
 * 1 Cal => 4,184 Kj
 * First retrieves the enrgy and enrgy_unit and from there construct an object
 * @returns Object
 * {
 *     "Kj_energy" : xxx
 *     "Cal_energy" : yyy
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
                "Kj_energy" : Math.round(4.184 *  product.nutriments.energy),
                "Kcal" :Math.round( Number(product.nutriments.energy))
            };
        }else
        {
            return {
                "Kj_energy" :  Math.round(Number(product.nutriments.energy)),
                "Kcal" : Math.round(product.nutriments.energy / 4.184)
            };
        }
    }else
    {
        return {
            "Kj_energy" :  "unknown",
            "Kcal" : "unkown"
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