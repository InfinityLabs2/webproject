document.addEventListener('DOMContentLoaded', () => {

    // ===== PAGE LOADER =====
    const loader = document.getElementById('pageLoader');
    const loaderFill = document.getElementById('loaderFill');

    loaderFill.style.width = '100%';
    setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = 'auto';
        // Trigger hero animations after load
        document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
            const delay = parseInt(el.dataset.delay || 0);
            setTimeout(() => el.classList.add('visible'), 200 + delay);
        });
    }, 1200);

    document.body.style.overflow = 'hidden';

    // ===== CUSTOM CURSOR GLOW (desktop only) =====
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.innerWidth > 768) {
        cursorGlow.style.opacity = '1';
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // ===== STICKY NAV =====
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        // Mobile floating CTA
        const mobileCTA = document.getElementById('mobileCTA');
        if (mobileCTA) {
            mobileCTA.classList.toggle('visible', window.scrollY > 400);
        }
    }, { passive: true });

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || 0);
            setTimeout(() => el.classList.add('visible'), delay);
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        // Skip hero elements — handled by loader
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const duration = 1800;
            const start = performance.now();

            function update(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target;
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            // Close all
            document.querySelectorAll('.faq-question').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.nextElementSibling.classList.remove('open');
            });
            // Open clicked (unless it was already open)
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                btn.nextElementSibling.classList.add('open');
            }
        });
    });

    // ===== MAGNETIC BUTTONS =====
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s';
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.15s ease, box-shadow 0.4s';
        });
    });

    // ===== SMOOTH SCROLL OFFSET (for fixed nav) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = nav.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ===== PARALLAX on hero-problem-container =====
    const heroBg = document.querySelector('.hero-problem-container');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroBg.style.backgroundPositionY = `calc(center + ${scrollY * 0.3}px)`;
        }, { passive: true });
    }
    // ===== TESTIMONIAL SLIDER — pause on touch (mobile) =====
    const sliderWrapper = document.getElementById('testimonialSlider');
    const sliderTrack = document.getElementById('testimonialTrack');

    if (sliderWrapper && sliderTrack) {
        // Touch: tap to pause, tap again to resume
        sliderWrapper.addEventListener('touchstart', () => {
            sliderTrack.style.animationPlayState = 'paused';
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', () => {
            // Resume after a short delay so the user can read
            setTimeout(() => {
                sliderTrack.style.animationPlayState = 'running';
            }, 2000);
        }, { passive: true });
    }
});
