
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

//dark mode toggle button
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-toggle-light');
    const darkIcon = document.getElementById('theme-toggle-dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function setTheme(dark) {
        if (dark) {
            document.body.classList.add('dark-mode');
            darkIcon.style.display = 'none';
            lightIcon.style.display = '';
        } else {
            document.body.classList.remove('dark-mode');
            darkIcon.style.display = '';
            lightIcon.style.display = 'none';
        }
    }

    // Check localStorage or system preference
    let darkMode = localStorage.getItem('dark-mode');
    if (darkMode === null) darkMode = prefersDark ? "true" : "false";
    setTheme(darkMode === "true");

    toggleBtn.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-mode');
        setTheme(isDark);
        localStorage.setItem('dark-mode', isDark);
    });
});

