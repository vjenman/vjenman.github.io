window.addEventListener('scroll', () => {
  const bird = document.querySelector('.bird');
  const scrollDistance = window.scrollY;
  
  const moveRight = scrollDistance * 0.8; 
  const moveDown = scrollDistance * 0.6;   

  bird.style.transform = `translate(${moveRight}px, ${moveDown}px)`;
});