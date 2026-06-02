/**
 * Site Maître Amélie Bonnieul-Amirault
 * Scripts principaux
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initContactForm();
    initReviewsCarousel();
});

/**
 * Navbar - Change de style au scroll
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
}

/**
 * Menu mobile
 */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('.nav-link');

    function setMenuState(isOpen) {
        navMenu.classList.toggle('active', isOpen);
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', () => {
        setMenuState(!navMenu.classList.contains('active'));
    });

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenuState(false);
        }
    });
}

/**
 * Smooth scroll pour les ancres
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Animations au scroll (reveal)
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.expertise-card, .about-image, .about-text, .fees-text, .fees-image, .contact-info, .contact-form-wrapper');
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Formulaire de contact
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupération des données
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validation simple
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showFormMessage('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        if (!data.consent) {
            showFormMessage('Veuillez accepter la politique de confidentialité.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
        })
            .then(() => {
                showFormMessage('Merci pour votre message ! Nous vous recontacterons dans les plus brefs délais.', 'success');
                form.reset();
            })
            .catch(() => {
                showFormMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

/**
 * Validation email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Afficher un message de formulaire
 */
function showFormMessage(message, type) {
    // Supprimer les anciens messages
    const oldMessage = document.querySelector('.form-message');
    if (oldMessage) oldMessage.remove();

    // Créer le nouveau message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.setAttribute('role', 'alert');
    messageEl.textContent = message;
    
    // Styles inline pour le message
    messageEl.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        ${type === 'success' 
            ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;

    const form = document.getElementById('contact-form');
    form.insertBefore(messageEl, form.firstChild);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

/**
 * Carousel d'avis Google Business
 */
function initReviewsCarousel() {
    const track = document.getElementById('reviews-track');
    const dotsContainer = document.getElementById('reviews-dots');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (!track) return;

    fetch('/content/reviews.json')
        .then(res => res.json())
        .then(data => {
            const reviews = data.reviews;
            if (!reviews || reviews.length === 0) return;

            let current = 0;
            let autoPlayTimer;

            function renderStars(rating) {
                return Array.from({ length: 5 }, (_, i) => {
                    const filled = i < rating;
                    return `<svg viewBox="0 0 24 24" aria-hidden="true" ${filled ? '' : 'style="opacity:0.3"'}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>`;
                }).join('');
            }

            // Construire les slides
            reviews.forEach((review, idx) => {
                const slide = document.createElement('div');
                slide.className = 'review-slide' + (idx === 0 ? ' active' : '');
                slide.innerHTML = `
                    <div class="review-stars">${renderStars(review.rating)}</div>
                    <p class="review-text">&laquo;&nbsp;${review.text}&nbsp;&raquo;</p>
                    <div class="review-meta">
                        <span class="review-author">${review.author}</span>
                        <span class="review-source">Avis Google</span>
                    </div>`;
                track.appendChild(slide);

                // Dot
                const dot = document.createElement('button');
                dot.className = 'reviews-dot' + (idx === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Avis ${idx + 1}`);
                dot.addEventListener('click', () => goTo(idx));
                dotsContainer.appendChild(dot);
            });

            const slides = track.querySelectorAll('.review-slide');
            const dots = dotsContainer.querySelectorAll('.reviews-dot');

            function goTo(idx) {
                slides[current].classList.remove('active');
                dots[current].classList.remove('active');
                current = (idx + reviews.length) % reviews.length;
                slides[current].classList.add('active');
                dots[current].classList.add('active');
                resetAutoPlay();
            }

            function resetAutoPlay() {
                clearInterval(autoPlayTimer);
                autoPlayTimer = setInterval(() => goTo(current + 1), 5000);
            }

            prevBtn.addEventListener('click', () => goTo(current - 1));
            nextBtn.addEventListener('click', () => goTo(current + 1));

            resetAutoPlay();

            // Pause au survol
            track.closest('.reviews-carousel').addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            track.closest('.reviews-carousel').addEventListener('mouseleave', resetAutoPlay);
        })
        .catch(() => {
            // Silencieux si le fichier n'est pas accessible (ex: ouverture locale)
        });
}
