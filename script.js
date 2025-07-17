//dynamic footer year updater 
document.addEventListener('DOMContentLoaded', function(){
const currentYear = new Date().getFullYear();
const yearElement = document.getElementById('currentYear');

if (yearElement) {
    yearElement.textContent = currentYear;
}
});

//search bar validation
document.getElementById('form').addEventListener('submit', function(event) {
  let searchInput = this.q.value.trim();
  if (searchInput === '') {
    alert('Please enter a search query.');
    event.preventDefault(); // Prevent form submission
  }
});

//sticky header and nav
window.onscroll = function() {myFunction()};
let header = document.getElementById("myHeader");
let sticky = header.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {

    header.classList.add("sticky");

  } else {

    header.classList.remove("sticky");

  }

}

window.onscroll = function() {myFunction()};
let headerNav = document.getElementById("mynav");
let stickyNav = nav.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {

    nav.classList.add("sticky");

  } else {

    nav.classList.remove("sticky");

  }

}
