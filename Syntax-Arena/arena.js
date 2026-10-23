window.addEventListener('DOMContentLoaded', () => {
    const displayImg = document.getElementById('displayImg');
    const caption = document.getElementById('caption');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const slides = [
        { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800", cap: "LEVEL 1: THE WEB WILDERNESS" },
        { src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800", cap: "LEVEL 2: THE PYTHON PIT" },
        { src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800", cap: "LEVEL 3: LOGIC LABYRINTH" }
    ];

    let currentIndex = 0;

    function updateSlide(index) {
        
        displayImg.style.opacity = 0;
        setTimeout(() => {
            displayImg.src = slides[index].src;
            caption.textContent = slides[index].cap;
            displayImg.style.opacity = 1;
        }, 200);
    }

    nextBtn.onclick = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide(currentIndex);
    };

    prevBtn.onclick = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlide(currentIndex);
    };

    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
    });
});