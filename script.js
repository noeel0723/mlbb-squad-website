// ================================
// SQUAD AERO — JAVASCRIPT
// ================================

document.addEventListener('DOMContentLoaded', () => {

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Scrolled state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // === MOBILE MENU ===
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close menu when link clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // === SCROLL ANIMATIONS ===
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // === COUNTER ANIMATION ===
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        let count = 0;
        const duration = 1500;
        const step = target / (duration / 16);

        const timer = setInterval(() => {
            count += step;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            el.textContent = Math.round(count);
        }, 16);
    }

    // === HERO CANVAS PARTICLES ===
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.fadingIn = Math.random() > 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Fade in/out
                if (this.fadingIn) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.5) this.fadingIn = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.05) this.fadingIn = true;
                }

                // Wrap around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(118, 147, 130, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(118, 147, 130, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Pause animation when not visible
        const heroSection = document.getElementById('hero');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationId) animate();
                } else {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
        }, { threshold: 0.1 });

        heroObserver.observe(heroSection);
    }

    // === SMOOTH SCROLL (fallback) ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === LEADERBOARD FILTER ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const leaderboardRows = document.querySelectorAll('.leaderboard-row');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            leaderboardRows.forEach(row => {
                // reset animation
                row.style.animation = 'none';
                row.offsetHeight; // trigger reflow

                if (filterValue === 'all' || row.getAttribute('data-tier') === filterValue) {
                    row.style.display = 'grid'; // Need 'grid' to maintain layout!
                    row.style.animation = 'fadeInRow 0.4s ease forwards';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // === MEMBER MODAL ===
    const memberDatabase = {
        "nicole": { name: "Nicole", role: "Gold Laner", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1240, winrate: 68.5, mvp: 450, heroes: [{ name: "Granger", img: "granger2.png", wr: 72.1 }, { name: "Claude", img: "claude.png", wr: 65.4 }, { name: "Harith", img: "harith.png", wr: 60.2 }] },
        "samwell": { name: "Samwell", role: "Flexible", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1100, winrate: 64.2, mvp: 380, heroes: [{ name: "Fanny", img: "fanny.png", wr: 68.0 }, { name: "Guinevere", img: "guinevere.png", wr: 60.5 }, { name: "Sora", img: "sora.png", wr: 59.0 }] },
        "waneki": { name: "Waneki", role: "Mid Laner", rankIcon: "Mythical_Glory.png", rankName: "Mythic Glory", matches: 1560, winrate: 62.1, mvp: 320, heroes: [{ name: "Zhuxin", img: "zhuxin.png", wr: 65.8 }, { name: "Pharsa", img: "pharsa.png", wr: 60.1 }, { name: "Yve", img: "yve.png", wr: 55.4 }] },
        "evatetsu": { name: "Evatetsu", role: "Mid Laner", rankIcon: "Mythical_Glory.png", rankName: "Mythic Glory", matches: 980, winrate: 59.5, mvp: 210, heroes: [{ name: "Lunox", img: "lunox.png", wr: 62.1 }, { name: "Vexana", img: "vexana.png", wr: 58.0 }, { name: "Aurora", img: "aurora.png", wr: 54.2 }] },
        "francis": { name: "Francis. Yongg~66", role: "Jungler/Exp", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 2100, winrate: 71.2, mvp: 850, heroes: [{ name: "Ling", img: "ling.png", wr: 75.0 }, { name: "Alice", img: "alice.png", wr: 70.1 }, { name: "Cici", img: "cici.png", wr: 68.0 }] },
        "cfyuu": { name: "Cfyuu.", role: "Jungler", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1850, winrate: 69.8, mvp: 720, heroes: [{ name: "Hayabusa", img: "hayabusa2.png", wr: 74.5 }, { name: "Joy", img: "joy.png", wr: 68.2 }, { name: "Yi Sun-Shin", img: "yss.png", wr: 65.0 }] },
        "kayyie": { name: "Kayyie", role: "Midlaner", rankIcon: "Mythical_Glory.png", rankName: "Mythic Glory", matches: 850, winrate: 55.4, mvp: 180, heroes: [{ name: "Cecilion", img: "cecilion.png", wr: 62.0 }, { name: "Vale", img: "vale.jpg", wr: 58.0 }, { name: "Nana", img: "nana.jpg", wr: 54.0 }] },
        "asamiya": { name: "Asamiya", role: "Exp Laner", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1350, winrate: 65.2, mvp: 410, heroes: [{ name: "Cici", img: "cici.png", wr: 68.5 }, { name: "Guinevere", img: "guinevere.png", wr: 63.2 }, { name: "Ruby", img: "ruby.png", wr: 60.1 }] },
        "amuro": { name: "Amuro ray.", role: "Flexible", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1420, winrate: 66.8, mvp: 430, heroes: [{ name: "Lapu Lapu", img: "lapulapu.png", wr: 70.1 }, { name: "Alice", img: "alice.png", wr: 65.0 }, { name: "Uranus", img: "uranus.png", wr: 62.5 }] },
        "claire": { name: "Claire", role: "Mid Laner", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1150, winrate: 63.5, mvp: 300, heroes: [{ name: "Luo Yi", img: "luoyi.png", wr: 66.8 }, { name: "Vexana", img: "vexana.png", wr: 61.2 }, { name: "aurora", img: "aurora.png", wr: 58.0 }] },
        "miguel": { name: "MiGUEL.", role: "Mid Laner", rankIcon: "Mythical_Glory.png", rankName: "Mythic Glory", matches: 920, winrate: 58.2, mvp: 210, heroes: [{ name: "Lylia", img: "lylia.png", wr: 61.0 }, { name: "Kagura", img: "kagura.png", wr: 56.5 }, { name: "Xavier", img: "xavier.png", wr: 53.0 }] },
        "tennndo": { name: "Tennndo.", role: "Exp Laner", rankIcon: "Mythical_Glory.png", rankName: "Mythic Glory", matches: 780, winrate: 54.5, mvp: 160, heroes: [{ name: "Xborg", img: "xborg.png", wr: 59.2 }, { name: "Yu Zhong", img: "yuzhong.png", wr: 55.0 }, { name: "Sora", img: "sora.png", wr: 50.1 }] },
        "ophelia": { name: "Opheliaaa.", role: "Flexible", rankIcon: "Mythical_Glory.png", rankName: "Mythic Glory", matches: 810, winrate: 56.8, mvp: 190, heroes: [{ name: "Chip", img: "chip.png", wr: 60.5 }, { name: "Nolan", img: "nolan.png", wr: 55.4 }, { name: "Freya", img: "freya.png", wr: 53.2 }] },
        "locklie": { name: "Locklie_", role: "Roamer", rankIcon: "Mythical_Immortal.png", rankName: "Mythic Immortal", matches: 1680, winrate: 61.5, mvp: 280, heroes: [{ name: "Tigreal", img: "tigreal.png", wr: 64.0 }, { name: "Minotaur", img: "minotaur.png", wr: 60.5 }, { name: "Gatotkaca", img: "gatotkaca.png", wr: 58.2 }] }
    };

    const modal = document.getElementById('memberModal');
    const modalClose = document.getElementById('modalClose');
    const memberCards = document.querySelectorAll('.member-card:not(.member-open)');

    function renderModal(memberId) {
        const data = memberDatabase[memberId] || {
            name: "Unknown Player", role: "Unknown", rankIcon: "Mythical_Glory.png", rankName: "Unknown",
            matches: 0, winrate: 0, mvp: 0, heroes: []
        };

        document.getElementById('modalName').textContent = data.name;
        document.getElementById('modalRole').textContent = data.role;
        document.getElementById('modalRankIcon').src = `assets/${data.rankIcon}`;
        document.getElementById('modalRankName').textContent = data.rankName;

        const heroesList = document.getElementById('modalHeroesList');
        heroesList.innerHTML = '';

        const h0 = data.heroes[0] || null;
        const h1 = data.heroes[1] || null;
        const h2 = data.heroes[2] || null;

        let heroesHTML = `<div class="hero-3d-layout">`;
        if (h1) heroesHTML += `
            <div class="hero-3d-card side-hero left-hero">
                <div class="hero-rank-num">2</div>
                <img src="assets/${h1.img}" alt="${h1.name}" onerror="this.style.display='none'">
                <div class="hero-3d-info">
                    <span class="hero-3d-name">${h1.name}</span>
                </div>
            </div>`;

        if (h0) heroesHTML += `
            <div class="hero-3d-card main-hero">
                <div class="hero-glow"></div>
                <div class="hero-rank-num">1</div>
                <img src="assets/${h0.img}" alt="${h0.name}" onerror="this.style.display='none'">
                <div class="hero-3d-info">
                    <span class="hero-3d-name">${h0.name}</span>
                </div>
            </div>`;

        if (h2) heroesHTML += `
            <div class="hero-3d-card side-hero right-hero">
                <div class="hero-rank-num">3</div>
                <img src="assets/${h2.img}" alt="${h2.name}" onerror="this.style.display='none'">
                <div class="hero-3d-info">
                    <span class="hero-3d-name">${h2.name}</span>
                </div>
            </div>`;

        heroesHTML += `</div>`;
        heroesList.innerHTML = heroesHTML;

        // Show modal
        modal.classList.add('active');
    }

    // Event Delegation for Member Cards
    const membersGrid = document.querySelector('.members-grid');
    if (membersGrid) {
        membersGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.member-card:not(.member-open)');
            if (card) {
                const nameEl = card.querySelector('.member-name');
                if (nameEl) {
                    const rawName = nameEl.textContent.toLowerCase();
                    let lookupName = "unknown";
                    if (rawName.includes('nicole')) lookupName = 'nicole';
                    else if (rawName.includes('samwell')) lookupName = 'samwell';
                    else if (rawName.includes('waneki')) lookupName = 'waneki';
                    else if (rawName.includes('evatetsu')) lookupName = 'evatetsu';
                    else if (rawName.includes('francis')) lookupName = 'francis';
                    else if (rawName.includes('cfyuu')) lookupName = 'cfyuu';
                    else if (rawName.includes('kayyie')) lookupName = 'kayyie';
                    else if (rawName.includes('asamiya')) lookupName = 'asamiya';
                    else if (rawName.includes('amuro')) lookupName = 'amuro';
                    else if (rawName.includes('claire')) lookupName = 'claire';
                    else if (rawName.includes('miguel')) lookupName = 'miguel';
                    else if (rawName.includes('tennndo')) lookupName = 'tennndo';
                    else if (rawName.includes('ophelia')) lookupName = 'ophelia';
                    else if (rawName.includes('locklie')) lookupName = 'locklie';

                    renderModal(lookupName);
                }
            }
        });
    }

    // Close Modal Logic
    function closeModal() {
        modal.classList.remove('active');
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Click outside the content bounding box
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

});
