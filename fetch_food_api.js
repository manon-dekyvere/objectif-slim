
// global variable to contain all the products we searched for
let ingredients = [];
// array to contain reciepe_element : { product : Object, quantity : number }
let recipe_ingeredients =[];

// variable to contain retrieved html from healthassist about calories to sport
let health_assist_results = "";
// variable containing all sports IDs
let sports_ids = [];


$(document).ready(function () {
    $("#recipe_calories").hide();
    $("#sports_calories_table_title").hide();
    $('select').formSelect();

    for (let i = 0; i < 3 ; i++) {
        generate_ingredient_input('ingredients_form', 'search_ingredient_forms_container');
    }

    $(document).on("submit", ".search_ingredient", function(e){
        e.preventDefault();
        get_product_list($(this).attr('id').substring(12));

    });
    $('#weight_form').on('submit', function(e) {
        e.preventDefault();
        submitForm();
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#recipe_calories").offset().top
        }, 2000);
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
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#recipe_calories").offset().top
        }, 2000);
    });





});
/*
    Function to retrieve data from  healthassist website
 */
async function get_calories_sport_data(weight, calories){
    $("#sports_calories_table_title").show();
    loading_element = "<div id=\"loader_2\" class=\"progress\">\n" +
        "      <div class=\"indeterminate\"></div>\n" +
        "  </div>";
    $('#sports_calories_table_title').after(loading_element);
    await doCORSRequest({
        method: 'GET',
        url: 'http://www.healthassist.net/calories/act-list.php?'+weight+','+calories+',false'
    }, function processrResults(result) {
        sports_ids = [];
        health_assist_results = result;
        $('#calories_sports').append($.parseHTML(health_assist_results));

        $('#calories_sports').replaceWith($.find('#sport'));
        thead = "<thead>\n" +
            "                    <tr>\n" +
            "                        <th>Sport</th>\n" +
            "                        <th>Temps nécessaire</th>\n" +
            "                    </tr>\n" +
            "                </thead>";
        $('#sport').find('tr').first().remove();
        $('#sport').prepend(thead);
        $('#sport').attr('class',"highlight");
        $('#sport').find("tr").each(function(  ) {
            sport_name = $( this ).children('td').first().text();
            new_id = sport_name.toLowerCase().replace(/\s/g,'_').replace(/,/g,'');
            sports_ids.push(new_id);
           //$( this ).hide();
            $( this ).attr('id', new_id );
            $( this ).children('td').first().attr('id','SPORT_IS_'+new_id);
            $( this ).children('td').last().attr('id','TIME_FOR_'+new_id);
            $('#loader_2').remove();
        });
/*        for (let i = 0; i <4 ; i++) {
            a_sport = sports_ids[Math.floor(Math.random()*sports_ids.length)];
            $('#'+a_sport).show();
        }
        var a_sport = sports_ids[Math.floor(Math.random()*sports_ids.length)];
        console.log($('#'+a_sport));
        return Promise.resolve(sports_ids); */
    });
}

/*
Function to do a CORS request through a Proxy
 */

function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
        printResult(
            x.responseText || ''
        );
    };
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}
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

    new_ingredient_selector_html =
       "<div class=\"ingredient_overall_container\" id=\"overall_container_for_ingredient_"+ new_ingredient_index +"\">\n" +
        "<div class=\"row search_form_container\" id=\"search_form_container_ingredient_"+ new_ingredient_index +"\">" +
        "                        <div class=\"input-field col s12\">\n" +
        "                            <input id=\"search_input_ingredient_"+ new_ingredient_index +"\" type=\"text\" form=\"search_form_ingredient_"+ new_ingredient_index +"\" class=\"validate\">\n" +
        "                            <label for=\"search_input_ingredient_"+ new_ingredient_index +"\">Rechercher un Ingrédient par mot clé</label>\n" +
        "                            <input type=\"submit\" value=\"Rechercher\" form=\"search_form_ingredient_"+ new_ingredient_index +"\" class=\"btn waves-effect waves-light centere\" >\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                    <div id=\"search_form_selector_ingredient_"+ new_ingredient_index +"\" class=\"search_form_selector row\">\n" +
        "                        <div class=\"input-field col s6\">\n" +
        "                            <select class =\"ingredient_input\"id=\"ingredient_"+ new_ingredient_index +"\">\n" +
        "                                <option value=\"\" disabled selected>Recherchez les produits puis en sélectionner un produit ici\n" +
        "                                </option>\n" +
        "                            </select>\n" +
        "                            <label>Sélectioner Porduit</label>\n" +
        "                        </div>\n" +
        "\n" +
        "                        <div class=\"input-field col s4\">\n" +
        "                            <input disabled value=\"Quantité\"  id =\"quantity_"+ new_ingredient_index +"\" type=\"number\" min=\"0\"  class=\"quantity_input validate\">\n" +
        "                            <label for=\"quantity_"+ new_ingredient_index +"\">Quantité</label>\n" +
        "                        </div>\n" +
        "                        <div class=\"col s2\">\n" +
        "                            <button  id =\"delete_ingredient_"+ new_ingredient_index +"\" class=\"btn waves-effect waves-light delete_ingredient_button delete_ingredient_button\" type=\"reset\" name=\"action\">Effacer\n" +
        "                                <i class=\"material-icons left\">clear</i>\n" +
        "                            </button>\n" +
        "                        </div>\n" +
        "\n" +
        "                    </div>\n" +
        "                    <br/>"+
        "                </div>";

    new_ingredient_search_form = "<form class=\"search_ingredient\"  id=\"search_form_ingredient_"+ new_ingredient_index +"\">\n" +
        "        </form >";
    $('#'+search_forms_container_id).append(new_ingredient_search_form);
    $('#'+form_id).append(new_ingredient_selector_html);
    $('#'+"search_form_selector_ingredient_"+ new_ingredient_index ).find('select').formSelect();
    $('#'+"search_form_selector_ingredient_"+ new_ingredient_index ).find('input').attr("disabled", true);

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
    recipe_ingeredients = [];
    total_calories = 0;
    $('.search_form_selector').each(function () {

        let quantity = $(this).find('.quantity_input').val();
        let product_id = $(this).find('select').val();
        if (quantity && product_id)
        {
            let product = retrieve_product_by_id(product_id);
            recipe_ingeredients.push({id: product_id,
                quantity: quantity,
                name: product.product_name,
                energy: get_energy_per_100u(product),
                calories: quantity/100 * get_energy_per_100u(product).Kcal
            });
            total_calories += quantity/100 * get_energy_per_100u(product).Kcal;
        }

    });
    if(recipe_ingeredients.length > 0){
        weight = 70;
        if ($('#weight_input').val() && $('#weight_input').val()  > 5 )
        {
            weight = $('#weight_input').val();
        }
        get_calories_sport_data(weight,total_calories);
        $("#total_calories_title").html("Le nombre total de calories de votre recette : "+ Math.round(total_calories) +" Cal");
    }

    tbody = $("#recipe_calories").find('tbody');


    tbody.html("");
    for (let i = 0; i <recipe_ingeredients.length ; i++) {
        tbody.append("<tr>" +
            "<td>"+recipe_ingeredients[i].name +"</td>"+
            "<td>"+recipe_ingeredients[i].quantity +"</td>"+
            "<td>"+Math.round(recipe_ingeredients[i].calories) +"</td>"+
            "<td>"+ Math.round(4.184 *recipe_ingeredients[i].calories) +"</td>"+
            "</tr>");

    }
    if(recipe_ingeredients.length > 0)
    {
        $("#recipe_calories").show();
    }else
    {
        $("#recipe_calories").hide();
    }




    console.log(recipe_ingeredients);



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
    $(".search_form_container").find('input').attr("disabled", true);
    let search_term = document.getElementById('search_input_' + ingredient_element_id).value;
    loading_element = "<div id=\"loader\" class=\"progress\">\n" +
        "      <div class=\"indeterminate\"></div>\n" +
        "  </div>";
    $('#'+('search_input_' + ingredient_element_id)).after(loading_element);
    console.log(ingredient_element_id);
    products = await search_ingredient(search_term);
    $('#loader').remove();
    $(".search_form_container").find('input').attr("disabled", false);
    let select_element = document.getElementById(ingredient_element_id);
    select_element.innerHTML = '';
    if(products.length == 0)
    {
        select_element.innerHTML += "<option> Aucun produit trouvé. Essayez de rechercher par un autre terme</option>"
    }else
    {
        for (var i = 0; i < products.length; i++)
        {
            if(products[i].nutriments.energy_unit && products[i].nutriments.energy)
            {
                select_element.innerHTML += '<option data-icon="'+products[i].image_url+'" value="'+products[i].id+'">'+products[i].product_name+'</option>'
            }
        }
        $('#'+ingredient_element_id).attr("disabled", false);
        $('#'+'quantity'+ingredient_element_id.substring(10)).attr("disabled", false);
    }
    $('#'+ingredient_element_id).formSelect();
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
