/**
 * Custom JavaScript for Wedding Website
 */

// Performance: Cache DOM selectors
const DOM = {
    audioBtn: null,
    audioIcon: null,
    hero: null,
    intro: null
};

let ytPlayer = null;
let playerReady = false;
let isPlaying = false;
let playerState = -1; // -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = video cued

function onPlayerReadyForMusic(event) {
    playerReady = true;
    playerState = event.target.getPlayerState();
    console.log('YT music player ready, state:', playerState);
}

function onYouTubeIframeAPIReady() {
    console.log('YouTube Iframe API ready');
}

function createYTPlayer(autoPlay = false) {
    if (ytPlayer) return;

    ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: 'Agvs9xmAYaQ',
        playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            fs: 0,
            iv_load_policy: 3
        },
        events: {
            'onReady': ev => {
                onPlayerReadyForMusic(ev);
                if (autoPlay) {
                    setTimeout(() => ev.target.playVideo(), 100);
                }
            },
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    playerState = event.data;
    isPlaying = (playerState === 1);
    updatePlayButton();
}

function updatePlayButton() {
    if (!DOM.audioIcon) return;
    if (isPlaying) {
        DOM.audioIcon.classList.remove('fa-play');
        DOM.audioIcon.classList.add('fa-pause');
        DOM.audioBtn.setAttribute('title', 'Pause music');
    } else {
        DOM.audioIcon.classList.remove('fa-pause');
        DOM.audioIcon.classList.add('fa-play');
        DOM.audioBtn.setAttribute('title', 'Play music');
    }
}

function toggleMusic() {
    if (!ytPlayer || !playerReady) {
        console.log('creating player and playing...');
        createYTPlayer(true);
        return;
    }

    if (isPlaying) {
        ytPlayer.pauseVideo();
    } else {
        ytPlayer.playVideo();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    DOM.audioBtn = document.getElementById('audioPlayButton');
    DOM.audioIcon = DOM.audioBtn ? DOM.audioBtn.querySelector('i') : null;
    DOM.hero = document.querySelector('.hero-section');
    DOM.intro = document.getElementById('intro-overlay');

    // Setup audio button
    if (DOM.audioBtn) {
        DOM.audioBtn.addEventListener('click', toggleMusic);
        DOM.audioBtn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleMusic();
                e.preventDefault();
            }
        });
    }

    /* ==========================================================================
       Countdown Timer
       ========================================================================== */
    const weddingDate = new Date("Mar 14, 2026 22:57:00").getTime();
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("mins");
    const secsEl = document.getElementById("secs");

    if (daysEl && hoursEl && minsEl && secsEl) {
        const countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerHTML = days < 10 ? `0${days}` : days;
            hoursEl.innerHTML = hours < 10 ? `0${hours}` : hours;
            minsEl.innerHTML = minutes < 10 ? `0${minutes}` : minutes;
            secsEl.innerHTML = seconds < 10 ? `0${seconds}` : seconds;

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.getElementById("countdown").innerHTML = "<div class='display-4 font-serif text-gold'>Today is the day!</div>";
            }
        }, 1000);
    }

    /* ==========================================================================
       AOS Initialization
       ========================================================================== */
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    AOS.init({
        duration: reduceMotion ? 0 : 1000,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        once: false,
        offset: 80,
        disable: reduceMotion
    });

    // simple parallax on hero with debounce
    let scrollTimeout;
    const performParallax = () => {
        if (!DOM.hero) return;
        const st = window.pageYOffset || document.documentElement.scrollTop;
        DOM.hero.style.backgroundPositionY = `${50 - st * 0.1}%`;
    };

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(performParallax, 10);
    }, { passive: true });

    /* ==========================================================================
       Premium Intro Overlay Handler
       ========================================================================== */
    const introBtn = document.getElementById('open-invitation-btn');
    const progressBar = document.querySelector('.intro-progress-container');

    if (DOM.intro && introBtn && progressBar) {
        // Simulate loading time (could be hooked up to actual image loading events)
        setTimeout(() => {
            progressBar.classList.add('hidden');
            introBtn.classList.add('ready');
            introBtn.removeAttribute('disabled');
            introBtn.querySelector('.btn-text').textContent = 'Open Invitation';
        }, 4000); // Wait 4 seconds for progress bar animation to complete

        const showButton = () => {
            if (DOM.audioBtn) {
                DOM.audioBtn.style.display = 'flex';
                // Trigger reflow to apply animation
                void DOM.audioBtn.offsetWidth;
                DOM.audioBtn.classList.add('popIn');
            }
        };

        const dismiss = () => {
            document.body.classList.add('opening');
            introBtn.style.pointerEvents = 'none';
            introBtn.style.opacity = '0';

            // Wait for visual effect before removing overlay
            setTimeout(() => {
                DOM.intro.classList.add('removing');
                setTimeout(() => {
                    DOM.intro.remove();
                    if (DOM.hero) DOM.hero.classList.add('visible');
                    // Automatically click invisible play button if intended
                    toggleMusic();
                    showButton();
                }, 1500); // Extra time for removing class transition
            }, 800); // Initial delay for sequence
        };

        introBtn.addEventListener('click', dismiss);
    } else if (DOM.intro) {
        // Fallback for old overlay structure or if elements missing
        setTimeout(() => {
            DOM.intro.classList.add('removing');
            setTimeout(() => { DOM.intro.remove(); if (DOM.hero) DOM.hero.classList.add('visible'); }, 1000);
        }, 3000);
    }
});
