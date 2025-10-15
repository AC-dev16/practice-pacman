const musicToggleBtn = document.getElementById("music-toggle");
const musicIcon = musicToggleBtn.querySelector(".music-icon");
let isMusicPlaying = true; // Initially set to true since the music will start playing when the page loads
const backgroundMusic = new Audio("assets/audio/retro-music.mp3");

// Preload the audio and loop it for continuous play
backgroundMusic.loop = true;

// Play the background music as soon as the page loads
backgroundMusic.volume = 0.3;
backgroundMusic.play();

// Set initial icon to unmuted since music starts playing
musicIcon.src = "assets/images/pixel-unmuted.jpg";

musicToggleBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicIcon.src = "assets/images/pixel-mute.jpg";
    } else {
        backgroundMusic.play();
        musicIcon.src = "assets/images/pixel-unmuted.jpg";
    }
    isMusicPlaying = !isMusicPlaying;
});