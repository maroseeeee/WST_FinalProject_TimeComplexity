function loadNavbar() {
    fetch('/base.html')
        .then(response => response.text())
        .then(data => {
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            navbarPlaceholder.innerHTML = data;

            const sidebarIcon = document.querySelector('.sidebarIcon');
            const slider = document.querySelector('.sidebar');

            document.getElementById('navbar-title').addEventListener('click', function () {
                window.location.href = '/sort';
            });

          
            document.getElementById('home-link').addEventListener('click', function () {
                window.location.href = '/sort';
            });

            document.getElementById('bubble-sort').addEventListener('click', function () {
                window.location.href = '/bubble_sort';
            });

            document.getElementById('bubble-sort2').addEventListener('click', function () {
                window.location.href = '/bubble_sort';
            });

            document.getElementById('selection-sort').addEventListener('click', function () {
                window.location.href = '/selection_sort';
            });

            document.getElementById('insertion-sort').addEventListener('click', function () {
                window.location.href = '/insertion_sort';
            });

            document.getElementById('merge-sort').addEventListener('click', function () {
                window.location.href = '/merge_sort';
            });

            document.getElementById('quick-sort').addEventListener('click', function () {
                window.location.href = '/quick_sort';
            });

            
            document.getElementById('history').addEventListener('click', function () {
               window.location.href = '/history';
            });

            
            document.getElementById('logout-link').addEventListener('click', function () {
                localStorage.removeItem("username");
                window.location.href = '/home';
            });

            
            sidebarIcon.onclick = function () {
                const isActive = slider.classList.toggle('active');
                sidebarIcon.style.display = isActive ? 'none' : 'block';
            };

            document.addEventListener('click', function (event) {
                if (!slider.contains(event.target) && !sidebarIcon.contains(event.target)) {
                    slider.classList.remove('active');
                    sidebarIcon.style.display = 'block';
                }
            });
        })
        .catch(error => console.error('Error loading navbar:', error));
}
