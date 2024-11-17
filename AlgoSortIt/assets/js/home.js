function showRegister(mode) {
  const content = document.getElementById('content');
  content.classList.remove('fade-in');
  content.classList.add('fade-out');

  setTimeout(() => {
      window.location.href = `login.html?mode=${mode}`; 
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  content.classList.add('fade-in');
});