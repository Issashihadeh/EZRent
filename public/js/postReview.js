const form = document.querySelector('.review-form');
const closeButton = document.querySelector('#close-button');

closeButton.addEventListener('click', () => {
  form.reset();
  document.getElementById("myForm").style.display = "none";
});