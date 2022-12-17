let dropdown = document.getElementById("dropdown");
let listingsOption = document.getElementById("listings-option");
let landlordsOption = document.getElementById("landlords-option");
let dropdownButton = document.getElementById("dropdown-button");

let dropdownMenu = document.getElementById("dropdown-menu");
let listingsItem = document.getElementById("listings-item");
let landlordsItem = document.getElementById("landlords-item");

let searchText = document.getElementById("search-text");

let currentOption;
let menuOpen = false;

//TODO Make this listen to every part of the page
window.onclick = (event) => {
    if (event.target !== dropdown) {
        menuOpen = false;
        dropdownMenu.style.display = "none";
        dropdownButton.style.clipPath = "polygon(100% 0%, 0 0%, 50% 100%)";
    } else {
        menuOpen = true;
    }
}
dropdown.onclick = () => {
    console.log(menuOpen);
    if (menuOpen) {
        menuOpen = false;
        dropdownMenu.style.display = "none";
        dropdownButton.style.clipPath = "polygon(100% 0%, 0 0%, 50% 100%)";
    } else {
        menuOpen = true;
        dropdownMenu.style.display = "block";
        dropdownButton.style.clipPath = "polygon(100% 100%, 0 100%, 50% 0%)";
    }
};
listingsItem.onclick = () => {
    menuOpen = false;
    dropdownMenu.style.display = "none";
    dropdownButton.style.clipPath = "polygon(100% 0%, 0 0%, 50% 100%)";
    currentOption = "listings";
    landlordsOption.style.display = "none";
    listingsOption.style.display = "block";
    searchText.placeholder = "Enter an address or zip code..."
}
landlordsItem.onclick = () => {
    menuOpen = false;
    dropdownMenu.style.display = "none";
    dropdownButton.style.clipPath = "polygon(100% 0%, 0 0%, 50% 100%)";
    currentOption = "landlords";
    listingsOption.style.display = "none";
    landlordsOption.style.display = "block";
    searchText.placeholder = "Enter a name..."
}

let searchButton = document.getElementById("search-button");

searchText.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});


function executeSearch(event) {
    event.preventDefault();
    let searchTerm = document.getElementById("search-text").value;
    if (!searchTerm) {
        location.assign('/');
        return;
    }
    let searchURL = `/listings/search?search=${encodeURIComponent(searchTerm)}`;
    //searchURL = `/listings/search-test`;

    location.assign(searchURL);
}

function executeLandlordSearch(event) {
    event.preventDefault();
    let searchTerm = document.getElementById("search-text").value;
    if (!searchTerm) {
        location.assign('/');
        return;
    }
    let searchURL = `/users/search?search=${encodeURIComponent(searchTerm)}`;

    location.assign(searchURL);
}

// const sb = document.getElementById('search-select');

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentOption == "listings") {
        executeSearch(event);
    } else if (currentOption == "landlords") {
        executeLandlordSearch(event);
    } else {
        location.assign('/');
    }
})