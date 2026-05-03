if (!localStorage.getItem('visitor_consent')) {
  document.addEventListener('click', function() {
    localStorage.setItem('visitor_consent', 'granted');
  }, { once: true });
}

// ===========================
// Background Music Player
// ===========================
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const musicTitle = document.getElementById('musicTitle');
const musicProgress = document.getElementById('musicProgress');
const musicProgressBar = document.querySelector('.music-progress-bar');
const volumeSlider = document.getElementById('volumeSlider');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const collapseBtn = document.getElementById('collapseBtn');
const musicPlayer = document.getElementById('musicPlayer');
const musicPlayerContainer = document.getElementById('musicPlayerContainer');
const collapseIcon = document.querySelector('.collapse-icon');
const expandIcon = document.querySelector('.expand-icon');

// playlist - add more songs here
const playlist = [
    {
        title: "Panda - Desiigner",
        src: "cyber-music-corp_panda-desiigner.mp3"
    },
    {
        title: "Pure Cocaine - Lil Baby",
        src: "Lil_Baby_-_Pure_Cocaine_.mp3"
    },
    {
        title: "Bad and Boujee - Migos ft. Lil Uzi Vert",
        src: "Migos_-_Bad_and_Boujee_Feat._Lil_Uzi_Vert.mp3"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isCollapsed = false;

// Load the first track
function loadTrack(index) {
    const track = playlist[index];
    audioPlayer.src = track.src;
    musicTitle.textContent = track.title;
    musicProgress.style.width = '0%';
}

// Play/Pause functionality
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        isPlaying = false;
    } else {
        audioPlayer.play().catch(error => {
            console.log('Playback failed:', error);
        });
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
        isPlaying = true;
    }
}

// Collapse/Expand functionality
function toggleCollapse() {
    isCollapsed = !isCollapsed;
    
    if (isCollapsed) {
        musicPlayer.classList.add('collapsed');
        musicPlayerContainer.classList.add('collapsed');
        collapseIcon.style.display = 'none';
        expandIcon.style.display = 'inline';
    } else {
        musicPlayer.classList.remove('collapsed');
        musicPlayerContainer.classList.remove('collapsed');
        collapseIcon.style.display = 'inline';
        expandIcon.style.display = 'none';
    }
}

// Next track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        musicProgress.style.width = progress + '%';
    }
}

// Seek functionality
musicProgressBar.addEventListener('click', (e) => {
    const rect = musicProgressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
collapseBtn.addEventListener('click', toggleCollapse);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextTrack);

// Set initial volume
audioPlayer.volume = 0.5;

// Load first track on page load
loadTrack(currentTrackIndex);

// Auto-play music when page loads
window.addEventListener('load', () => {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        audioPlayer.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
            isPlaying = true;
        }).catch(error => {
            console.log('Auto-play prevented by browser. User interaction required.');
            // Keep play button visible if auto-play fails
        });
    }, 500);
});

// ===========================
// Typing Animation
// ===========================
const titles = [
    "BUG DEVELOPER",
    "CODE WIZARD",
    "SOFTWARE ENGINEER",
    "WEB DEVELOPER",
    "FULL STACK DEVELOPER",
    "EXPERT GOOGLE SEARCHER",
    "DISCORD DEVELOPER",
    "DEPENDABLE TALENT"
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
const deleteSpeed = 50;
const pauseEnd = 2000;
const pauseStart = 500;

function typeTitle() {
    const typingElement = document.getElementById('typingText');
    const currentTitle = titles[titleIndex];
    
    if (!isDeleting) {
        // Typing
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentTitle.length) {
            // Finished typing, pause then start deleting
            isDeleting = true;
            setTimeout(typeTitle, pauseEnd);
            return;
        }
    } else {
        // Deleting
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            // Finished deleting, move to next title
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            setTimeout(typeTitle, pauseStart);
            return;
        }
    }
    
    const speed = isDeleting ? deleteSpeed : typingSpeed;
    setTimeout(typeTitle, speed);
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeTitle, 500);
});

// ===========================
// Mobile Navigation Toggle
// ===========================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navToggle && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Side Navigation Dots
// ===========================
const dots = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('section[id]');

function updateActiveDot() {
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }
    });
}

// Add click functionality to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const section = sections[index];
        if (section) {
            const headerOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', updateActiveDot);

// ===========================
// Active Navigation Link
// ===========================
function setActiveNavLink() {
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ===========================
// Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animatedElements = document.querySelectorAll('.project-card, .skill-item, .tool-item, .code-block');
animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===========================
// Project Card Glow Effect
// ===========================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(126, 231, 135, 0.5), 0 0 60px rgba(126, 231, 135, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// ===========================
// Notification System
// ===========================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        background-color: #7ee787;
        color: #0a0a0a;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Terminal Glow Animation
// ===========================
const terminalGlow = document.querySelector('.terminal-glow');
if (terminalGlow) {
    terminalGlow.style.opacity = '0';
    document.addEventListener('mousemove', (e) => {
        terminalGlow.style.opacity = '1';
        const x = e.clientX - 300;
        const y = e.clientY - 300;
        terminalGlow.style.transform = `translate(${x}px, ${y}px)`;
    });
}
// ===========================
// Skill Items Animation on Scroll
// ===========================
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 50);
        }
    });
}, { threshold: 0.1 });

skillItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    skillObserver.observe(item);
});

// ===========================
// Discord Tag Copy Functionality
// ===========================
const discordTag = document.querySelector('.discord-tag');
if (discordTag) {
    discordTag.style.cursor = 'pointer';
    discordTag.addEventListener('click', () => {
        const discordUsername = discordTag.textContent.trim();
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(discordUsername).then(() => {
                showNotification('Discord tag copied to clipboard!');
            });
        }
    });
}

// Add click-to-copy for friend Discord usernames
const friendDiscordUsernames = document.querySelectorAll('.discord-username');
friendDiscordUsernames.forEach(username => {
    username.addEventListener('click', () => {
        const discordName = username.textContent.trim();
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(discordName).then(() => {
                showNotification(`Copied ${discordName} to clipboard!`);
            });
        }
    });
});

// Add click-to-copy for the large Discord contact box
const discordInfoLarge = document.querySelector('.discord-info-large');
if (discordInfoLarge) {
    discordInfoLarge.addEventListener('click', () => {
        const discordUsername = document.querySelector('.discord-tag-large').textContent.trim();
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(discordUsername).then(() => {
                showNotification('Discord username copied to clipboard!');
            });
        }
    });
}

// ===========================
// Parallax Effect on Scroll
// ===========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ===========================
// Initialize
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    updateActiveDot();
    setActiveNavLink();
});

// ===========================
// Console Easter Egg
// ===========================
console.log('%c> Ducky Portfolio v1.0', 'color: #7ee787; font-family: monospace; font-size: 16px; font-weight: bold;');
console.log('%c> System initialized successfully', 'color: #8b949e; font-family: monospace; font-size: 12px;');
console.log('%c> Type "help" for available commands', 'color: #8b949e; font-family: monospace; font-size: 12px;');

// Add some fun terminal commands
window.help = function() {
    console.log(`
%cAvailable Commands:
%c- about()      %c→ Learn more about Ducky
%c- skills()     %c→ List all technical skills
%c- contact()    %c→ Get contact information
%c- clear()      %c→ Clear console
    `, 
    'color: #7ee787; font-weight: bold;',
    'color: #f0e68c;', 'color: #8b949e;',
    'color: #f0e68c;', 'color: #8b949e;',
    'color: #f0e68c;', 'color: #8b949e;',
    'color: #f0e68c;', 'color: #8b949e;'
    );
};

window.about = function() {
    console.log('%c> Self-taught programmer motivated by passion and personal projects', 'color: #c9d1d9; font-family: monospace;');
};

window.skills = function() {
    const skills = ['JavaScript', 'TypeScript', 'Python', 'Lua', 'C#', 'C++', 'CSS', 'HTML', 'Node.js', 'discord.js', 'Express.js', 'SQLite', 'MongoDB', 'OAuth2'];
    console.log('%c> Technical Skills:', 'color: #7ee787; font-weight: bold; font-family: monospace;');
    skills.forEach(skill => {
        console.log(`%c  • ${skill}`, 'color: #c9d1d9; font-family: monospace;');
    });
};

window.contact = function() {
    console.log('%c> Discord: thatoneducky._.  ', 'color: #7ee787; font-family: monospace; font-weight: bold;');
};