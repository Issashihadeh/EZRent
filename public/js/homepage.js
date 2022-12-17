
let dropdown = document.getElementById("dropdown");
let listingsOption = document.getElementById("listings-option");
let landlordsOption = document.getElementById("landlords-option");
let dropdownButton = document.getElementById("dropdown-button");

let dropdownMenu = document.getElementById("dropdown-menu");
let listingsItem = document.getElementById("listings-item");
let landlordsItem = document.getElementById("landlords-item");

let searchText = document.getElementById("search-text");

let currentOption = "listings";
let menuOpen = false;

window.onclick = (event) => {
    if (event.target.contains(dropdown) && event.target !== dropdown) {
        menuOpen = false;
        dropdownMenu.style.display = "none";
        dropdownButton.style.clipPath = "polygon(100% 0%, 0 0%, 50% 100%)";
    }
}
dropdown.onclick = () => {
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

function createLandlordCard(data) {
    return `<div class="container">
        <di class="container-profile">
            <p class="landlord-name">${data.title}</p>
            <p class="landlord-rating">${data.rating}</p>
        </di>
        <a href="#">
        <img class="landlord-img"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"></a>
    </div>`;
}

function executeSearch() {
    let searchTerm = document.getElementById("search-text").value;
    if (!searchTerm) {
        location.replace('/');
        return;
    }
    let searchURL = `/listings/search?search=${searchTerm}`;
    //searchURL = `/listings/search-test`;

    location.replace(searchURL);
}

function executeLandlordSearch() {
    let searchTerm = document.getElementById("search-text").value;
    if (!searchTerm) {
        location.replace('/');
        return;
    }
    let searchURL = `/users/search?search=${searchTerm}`;

    location.replace(searchURL);
}

// Get the input field
var input = document.getElementById("search-text");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search-button").click();
  }
});
// const sb = document.getElementById('search-select');

searchButton.onclick = (event) => {
    event.preventDefault;
    if (currentOption == "listings") {
        executeSearch();
    } else if (currentOption == "landlords") {
        executeLandlordSearch();
    } else {
        location.replace('/');
    }
}

// For changing text in homepage
const elts = {
    text1: document.getElementById("text1"),
    text2: document.getElementById("text2")
};

const texts = [
    "Search",
    "Review",
    "Rate",
    "Contact"
];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
    }

    setMorph(fraction);
}

function setMorph(fraction) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
    morph = 0;

    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
}

function animate() {
    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
        if (shouldIncrementIndex) {
            textIndex++;
        }

        doMorph();
    } else {
        doCooldown();
    }
}

animate();

// function addressAutocomplete(containerElement, callback, options) {
//     // create input element
//     var inputElement = document.createElement("input");
//     inputElement.setAttribute("type", "text");
//     inputElement.setAttribute("placeholder", options.placeholder);
//     containerElement.appendChild(inputElement);

//     // add input field clear button
//     var clearButton = document.createElement("div");
//     clearButton.classList.add("clear-button");
//     addIcon(clearButton);
//     clearButton.addEventListener("click", (e) => {
//         e.stopPropagation();
//         inputElement.value = '';
//         callback(null);
//         clearButton.classList.remove("visible");
//         closeDropDownList();
//     });
//     containerElement.appendChild(clearButton);

//     /* Current autocomplete items data (GeoJSON.Feature) */
//     var currentItems;

//     /* Active request promise reject function. To be able to cancel the promise when a new request comes */
//     var currentPromiseReject;

//     /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
//     var focusedItemIndex;

//     /* Execute a function when someone writes in the text field: */
//     inputElement.addEventListener("input", function (e) {
//         var currentValue = this.value;

//         /* Close any already open dropdown list */
//         closeDropDownList();

//         // Cancel previous request promise
//         if (currentPromiseReject) {
//             currentPromiseReject({
//                 canceled: true
//             });
//         }

//         if (!currentValue) {
//             clearButton.classList.remove("visible");
//             return false;
//         }

//         // Show clearButton when there is a text
//         clearButton.classList.add("visible");

//         /* Create a new promise and send geocoding request */
//         var promise = new Promise((resolve, reject) => {
//             currentPromiseReject = reject;

//             var apiKey = "440bf863a9d846aabebb76ef7596c500";
//             var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;

//             if (options.type) {
//                 url += `&type=${options.type}`;
//             }

//             fetch(url)
//                 .then(response => {
//                     // check if the call was successful
//                     if (response.ok) {
//                         response.json().then(data => resolve(data));
//                     } else {
//                         response.json().then(data => reject(data));
//                     }
//                 });
//         });

//         promise.then((data) => {
//             currentItems = data.features;

//             /*create a DIV element that will contain the items (values):*/
//             var autocompleteItemsElement = document.createElement("div");
//             autocompleteItemsElement.setAttribute("class", "autocomplete-items");
//             containerElement.appendChild(autocompleteItemsElement);

//             /* For each item in the results */
//             data.features.forEach((feature, index) => {
//                 /* Create a DIV element for each element: */
//                 var itemElement = document.createElement("DIV");
//                 /* Set formatted address as item value */
//                 itemElement.innerHTML = feature.properties.formatted;

//                 /* Set the value for the autocomplete text field and notify: */
//                 itemElement.addEventListener("click", function (e) {
//                     inputElement.value = currentItems[index].properties.formatted;

//                     callback(currentItems[index]);

//                     /* Close the list of autocompleted values: */
//                     closeDropDownList();
//                 });

//                 autocompleteItemsElement.appendChild(itemElement);
//             });
//         }, (err) => {
//             if (!err.canceled) {
//                 console.log(err);
//             }
//         });
//     });

//     /* Add support for keyboard navigation */
//     inputElement.addEventListener("keydown", function (e) {
//         var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
//         if (autocompleteItemsElement) {
//             var itemElements = autocompleteItemsElement.getElementsByTagName("div");
//             if (e.keyCode == 40) {
//                 e.preventDefault();
//                 /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
//                 focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
//                 /*and and make the current item more visible:*/
//                 setActive(itemElements, focusedItemIndex);
//             } else if (e.keyCode == 38) {
//                 e.preventDefault();

//                 /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
//                 focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
//                 /*and and make the current item more visible:*/
//                 setActive(itemElements, focusedItemIndex);
//             } else if (e.keyCode == 13) {
//                 /* If the ENTER key is pressed and value as selected, close the list*/
//                 e.preventDefault();
//                 if (focusedItemIndex > -1) {
//                     closeDropDownList();
//                 }
//             }
//         } else {
//             if (e.keyCode == 40) {
//                 /* Open dropdown list again */
//                 var event = document.createEvent('Event');
//                 event.initEvent('input', true, true);
//                 inputElement.dispatchEvent(event);
//             }
//         }
//     });

//     function setActive(items, index) {
//         if (!items || !items.length) return false;

//         for (var i = 0; i < items.length; i++) {
//             items[i].classList.remove("autocomplete-active");
//         }

//         /* Add class "autocomplete-active" to the active element*/
//         items[index].classList.add("autocomplete-active");

//         // Change input value and notify
//         inputElement.value = currentItems[index].properties.formatted;
//         callback(currentItems[index]);
//     }

//     function closeDropDownList() {
//         var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
//         if (autocompleteItemsElement) {
//             containerElement.removeChild(autocompleteItemsElement);
//         }

//         focusedItemIndex = -1;
//     }

//     function addIcon(buttonElement) {
//         var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
//         svgElement.setAttribute('viewBox', "0 0 24 24");
//         svgElement.setAttribute('height', "24");

//         var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
//         iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
//         iconElement.setAttribute('fill', 'currentColor');
//         svgElement.appendChild(iconElement);
//         buttonElement.appendChild(svgElement);
//     }

//     /* Close the autocomplete dropdown when the document is clicked. 
//       Skip, when a user clicks on the input field */
//     document.addEventListener("click", function (e) {
//         if (e.target !== inputElement) {
//             closeDropDownList();
//         } else if (!containerElement.querySelector(".autocomplete-items")) {
//             // open dropdown list again
//             var event = document.createEvent('Event');
//             event.initEvent('input', true, true);
//             inputElement.dispatchEvent(event);
//         }
//     });

// }
// addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
//     console.log("Selected option: ");
//     console.log(data);
// }, {
//     placeholder: "Enter an address here"
// });
