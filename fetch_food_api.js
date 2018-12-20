
// global variable to contain all the products we searched for
let ingredients = [];
// array to contain reciepe_element : { product : Object, quantity : number }
let recipe_ingeredients =[];


$(document).ready(function () {

    for (let i = 0; i < 3 ; i++) {
        generate_ingredient_input('ingredients_form', 'search_ingredient_forms_container');
    }

    $(document).on("submit", ".search_ingredient", function(e){
        e.preventDefault();
        get_product_list($(this).attr('id').substring(12));

    });

    $('.ingredient_form').on('submit', function(e) {
        e.preventDefault();
        console.log($(this).attr('id').substring(5));
        console.log($(this).find(">:first-child").attr('id'));
        submitForm($(this).find(">:first-child").attr('id').substring(10));
    });

    $('#add_ingredient').on('click', function (e) {
        e.preventDefault();
        generate_ingredient_input('ingredients_form', 'search_ingredient_forms_container');
        if ($('.ingredient_overall_container').length > 1)
        {
            $(".delete_ingredient_button").attr("disabled", false);
        }
    });

    $(document).on("click", ".delete_ingredient_button", function(){
        delete_ingredient_input($(this).attr('id').substring(7));
        if ($('.ingredient_overall_container').length == 1)
        {
            $(".delete_ingredient_button").attr("disabled", true);
        }
    });
    $('#submit_ingredients').on('click',function () {
        submitForm();
    })



});

/**
 * Function to generate an ingredient field
 */
function generate_ingredient_input(form_id, search_forms_container_id)
{
    ingredient_selectors =  $('#'+form_id).find('.search_form_selector');
    if(ingredient_selectors.length == 0)
    {
        last_ingredient_index = 0
    }else
    {
        last_ingredient_selector_id = ingredient_selectors.last().attr('id');
        last_ingredient_index = parseInt(last_ingredient_selector_id.substr(last_ingredient_selector_id.lastIndexOf("_")+1));
    }
    new_ingredient_index = last_ingredient_index +1;
    console.log(new_ingredient_index);
   //$('#'+form_id).html($('#'+form_id).html() + "hahahha");

    new_ingredient_selector_html =
        " <div class=\"ingredient_overall_container\" id=\"overall_container_for_ingredient_"+ new_ingredient_index +"\">\n" +
        "    <div id=\"search_form_container_ingredient_"+ new_ingredient_index +"\" class=\"search_form_container\">\n" +
        "            Search\n" +
        "            <input id=\"search_input_ingredient_"+ new_ingredient_index +"\" type=\"text\" form=\"search_form_ingredient_"+ new_ingredient_index +"\">\n" +
        "            <input type=\"submit\" value=\"sub\" form=\"search_form_ingredient_"+ new_ingredient_index +"\" >\n" +
        "    </div>\n" +
        "    <div id=\"search_form_selector_ingredient_"+ new_ingredient_index +"\" class=\"search_form_selector\">\n" +
        "            Ingrédient:\n" +
        "            <select id=\"ingredient_"+ new_ingredient_index +"\" disabled>\n" +
        "<option>   Utilisez la barre de recherche au dessus pour rechercher les produits puis sélectionner un produit ici   </option>"+
        "            </select>\n" +
        "            <br>\n" +
        "            Quantité (en ml ou en g):<br>\n" +
        "            <input id =\"quantity_"+ new_ingredient_index +"\" type=\"number\" disabled>\n" +
        "     </div>\n" +
        " <button class = \"delete_ingredient_button\" type=\"button\"  id =\"delete_ingredient_"+ new_ingredient_index +"\">X</button>\n" +
        "        </div>";

    new_ingredient_search_form = "<form class=\"search_ingredient\"  id=\"search_form_ingredient_"+ new_ingredient_index +"\">\n" +
        "        </form >";
    $('#'+search_forms_container_id).append(new_ingredient_search_form);
    $('#'+form_id).append(new_ingredient_selector_html);

}
function delete_ingredient_input(ingredient_index)
{
    $('#overall_container_for_'+ingredient_index).remove();
    $('#search_form_'+ingredient_index).remove();
}



/**
 * Searches for an ingeredient in the API
 * filters out elements that don't contain in their title the ingredient
 * sorts the ingredients according to their title length ( ex : if we look for milk we first suggest soy milk instead of Milk Chocolat Biscuits )
 * returns array of products
 * @param ingredient
 * @return {Promise<Array>}
 */
async function search_ingredient(ingredient) {
    let search_results =[];
    return fetch('https://fr.openfoodfacts.org/cgi/search.pl?search_terms=' + ingredient + '&json=1&page_size=500')
        .then(function (response)
        {
            return response.json()
        })
        .then(function (data) {
            for (var i = 0; i < data.products.length; i++) {
                if (data.products[i].product_name.includes(ingredient))
                {
                    //results to return
                    search_results.push(data.products[i]);
                    // saving all results to the ingredients table
                    ingredients.push(data.products[i]);
                }
            }
            search_results = search_results.sort(function(a,b) { { return  a.product_name.length - b.product_name.length; }});
            console.log(search_results[0].product_name);
            return Promise.resolve(search_results);
        })
}
// console.log(await search_ingredient('lait'));

/**
 * Functions that handles the form validation
 * @return {Promise<void>}
 */
async function submitForm() {

    $('.search_form_selector').each(function () {

        let quantity = $(this).find('input').val();
        let product_id = $(this).find('select').val();
        if (quantity && product_id)
        {
            let product = retrieve_product_by_id(product_id);
            recipe_ingeredients.push({id: product_id, quantity: quantity, name: product.product_name, energy: get_energy_per_100u(product) });
        }
        console.log(recipe_ingeredients);

        /*let product = retrieve_product_by_id(ingredient_id);
        recipe_ingeredients.push({id: ingredient_id, quantity: quantity});
        console.log(product.product_name);
        console.log(get_energy_per_100u(product));
        console.log(quantity * get_energy_per_100u(product).Kcal / 100 );
        console.log(recipe_ingeredients);*/

    });

    /*let ingredient_id = document.getElementById('ingredient'+id).value;
    let quantity = document.getElementById('quantity'+id).value;
    let product = retrieve_product_by_id(ingredient_id);
    recipe_ingeredients.push({id: ingredient_id, quantity: quantity});
    console.log(product.product_name);
    console.log(get_energy_per_100u(product));
    console.log(quantity * get_energy_per_100u(product).Kcal / 100 );
    console.log(recipe_ingeredients);*/
}

/**
 * computes the energy per 100 u (g or ml) in both Cal and Kj
 * 1 Cal => 4.184 Kj
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

async function get_product_list(ingredient_element_id){
    $(".search_form_container").children('input').attr("disabled", true);
    let search_term = document.getElementById('search_input_' + ingredient_element_id).value;
    console.log(ingredient_element_id);
    products = await search_ingredient(search_term);
    $(".search_form_container").children('input').attr("disabled", false);
    let select_element = document.getElementById(ingredient_element_id);
    select_element.innerHTML = '';
    if(products.length == 0)
    {
        select_element.innerHTML += "<option> Aucun produit trouvé. Essayez de rechercher par un autre terme</option>"
    }else
    {
        for (var i = 0; i < products.length; i++)
        {
            select_element.innerHTML += '<option value="'+products[i].id+'">'+products[i].product_name+'</option>'
        }
        $('#'+ingredient_element_id).attr("disabled", false);
        $('#'+'quantity'+ingredient_element_id.substring(10)).attr("disabled", false);
    }
    products = [];
}

/**
 * function to retrieve product by id from array
 */
function retrieve_product_by_id(id)
{
    for(let i = 0; i < ingredients.length; i++)
    {
        if(ingredients[i].id == id)
        {
            return ingredients[i];
        }
    }
}
