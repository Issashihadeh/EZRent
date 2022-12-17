document.getElementById("leave-review-button").onclick = () => {
    document.getElementById("myForm").style.display = "block";
}

// document.getElementById("edit-profile-button").onclick = () => {
//     showEditProfilePopup();
// }

let sendReviewButton = document.getElementById("post-review-submit-button");
// sendReviewButton.onclick = () => {
//     // document.getElementById("textarea").value = "";
//     document.getElementById("myForm").style.display = "none";
// }

document.getElementById("profile-page-listings").onclick = () => {
    location.replace("/listingpage");
}

function showEditProfilePopup() {
    // show the popup
    var popup = document.getElementById("editProfilePopup");
    popup.style.display = "block";
  }


// function openForm() {
//     document.getElementById("myForm").style.display = "block";
// }

// function closeForm() {
//     document.getElementById("textarea").value = "";
//     document.getElementById("myForm").style.display = "none";
// }