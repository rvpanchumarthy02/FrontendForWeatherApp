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
