
var product = "egg";
fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms='+product+'&search_simple=1&action=process&json=1&page_size=1000')
    .then(function(response) { return response.json(); })
    .then(function(data)
        {
            var myList = document.getElementById('products_list');
            for (var i = 0; i < data.products.length; i++)
            {
                if(data.products[i].product_name.includes(product))
                {
                    var listItem = document.createElement('li');
                    listItem.innerHTML = data.products[i].product_name;
                    myList.appendChild(listItem);
                }

            }
        });
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