let landlordId = document.getElementById("landlord-id").innerHTML;

document.getElementById("landlord-info").onclick = () => {
    location.assign(`/users/profilePage/${landlordId}`)
}

document.getElementById("leave-review-button").onclick = () => {
    document.getElementById("myForm").style.display = "block";
}

const form = document.querySelector('.review-form');
const closeButton = document.querySelector('#close-button');

closeButton.addEventListener('click', () => {
  form.reset();
  document.getElementById("myForm").style.display = "none";
});