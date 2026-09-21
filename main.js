const button = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
}));
