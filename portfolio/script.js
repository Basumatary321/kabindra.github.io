 document.addEventListener('DOMContentLoaded', () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const animateSkills = () => {
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                bar.style.width = bar.getAttribute('data-width');
            }
        });
    };

    window.addEventListener('scroll', animateSkills);
    animateSkills();
});
const texts = ['Teacher','Developer', 'Tech. Assistant', 'Designer'];
const speed = 100; // Typing speed in milliseconds

const textElement = document.querySelector('.typewriter-text');

let textIndex = 0;
let characterIndex = 0;

function typewriter() {
    if (characterIndex < texts[textIndex].length) {
        textElement.innerHTML += texts[textIndex].charAt(characterIndex);
        characterIndex++;
        setTimeout(typewriter, speed);
    } else {
        setTimeout(eraseText, 1000); // Pause for 1 second before erasing
    }
}

function eraseText() {
    if (characterIndex > 0) {
        textElement.innerHTML = textElement.innerHTML.slice(0, -1);
        characterIndex--;
        setTimeout(eraseText, 50); // Erasing speed (faster than typing)
    } else {
        textIndex = (textIndex + 1) % texts.length; // Cycle to next word
        characterIndex = 0;
        setTimeout(typewriter, 500); // Pause for 0.5 seconds before next typing
    }
}

window.onload = typewriter; // Start the effect on page load