
const star = document.getElementById('star-svg');
const star2 = document.getElementById('star-svg2');


window.addEventListener('scroll', () => {
    // Get the number of pixels scrolled
    const scrollValue = window.scrollY;

    // Rotate the star. 
    // Multiply by 0.5 to make it rotate slower, or 2 to make it faster.
    star.style.transform = `rotate(${scrollValue * 0.5}deg)`;
    star2.style.transform = `rotate(${scrollValue * 0.5}deg)`;
});
