var searchTerm = document.getElementById("search-term").innerHTML;

document.getElementById("apply-filters-button").addEventListener('click', () => {
    
    console.log("HERE");
    let minPrice = document.getElementById("min-price").value;
    let maxPrice = document.getElementById("max-price").value;
    let rating = document.getElementById("rating-filter").value;
    let beds = document.getElementById("beds-filter").value;
    let baths = document.getElementById("baths-filter").value;

    //check if values are good
    if(!minPrice) {
        minPrice = "";
    } else {
        minPrice = "&min="+minPrice.replace(' ','');
    }
    if(!maxPrice) {
        maxPrice = "";
    } else {
        maxPrice = "&max="+maxPrice.replace(' ','');
    }
    if(maxPrice <= minPrice) {
        console.log("fail");
    }
    if(rating != "> 1"
            && rating != "> 2"
            && rating != "> 3"
            && rating != "> 4"
            && rating != "5") {
        rating = "";
    } else {
        rating = "&rating="+rating.replace(' ','');
    }
    if(beds != "1"
            && beds != "2"
            && beds != "3"
            && beds != "4"
            && beds != "> 4") {
        beds = "";
    } else {
        beds = "&beds="+beds.replace(' ','');
    }
    if(baths != "1"
            && baths != "2"
            && baths != "3"
            && baths != "4"
            && baths != "> 4") {
        console.log("fail");
        baths = "";
    } else {
        baths = "&baths="+baths.replace(' ','');
    }

    let searchURL = `/listings/search?search=${searchTerm}${minPrice}${maxPrice}${rating}${beds}${baths}`;

    console.log("Search url"+searchURL);

    location.replace(searchURL);
});

