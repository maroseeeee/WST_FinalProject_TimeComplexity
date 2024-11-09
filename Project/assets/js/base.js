function loadNavbar() {
    fetch('/templates/base.html')
        .then(response => response.text())
        .then(data => {
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            navbarPlaceholder.innerHTML = data;

            const sidebarIcon = document.querySelector('.sidebarIcon');
            const slider = document.querySelector('.sidebar');

            document.getElementById('navbar-title').addEventListener('click', function () {
                window.location.href = '/templates/index.html';
            });

          
            document.getElementById('home-link').addEventListener('click', function () {
                window.location.href = '/templates/index.html';
            });

            document.getElementById('bubble-sort').addEventListener('click', function () {
                window.location.href = '/sorts/Bubble_Sort.html';
            });

            document.getElementById('selection-sort').addEventListener('click', function () {
                window.location.href = '/sorts/Selection_Sort.html';
            });

            document.getElementById('insertion-sort').addEventListener('click', function () {
                window.location.href = '/sorts/Insertion_Sort.html';
            });

            document.getElementById('merge-sort').addEventListener('click', function () {
                window.location.href = '/sorts/Merge_Sort.html';
            });

            document.getElementById('quick-sort').addEventListener('click', function () {
                window.location.href = '/sorts/Quick_Sort.html';
            });

           
            document.getElementById('exercises-link').addEventListener('click', function () {
                window.location.href = '/templates/exercises.html';
            });
            document.getElementById('history').addEventListener('click', function () {
                window.location.href = '/templates/history.html';
            });

            
            document.getElementById('logout-link').addEventListener('click', function () {
                window.location.href = '/templates/home.html';
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
