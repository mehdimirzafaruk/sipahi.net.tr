/**
 * Aurum Parfums - Site JavaScript
 * Modern vanilla JS with GSAP animations and interactions
 */

// Global variables
let gsapLoaded = false;
let scrollTriggerLoaded = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the main application
 */
function initializeApp() {
    // Load GSAP and plugins
    loadGSAP().then(() => {
        gsapLoaded = true;
        initializeAnimations();
    });

    // Initialize components
    initializeNavigation();
    initializeModals();
    initializeForms();
    initializeProductCards();
    initializeTimeline();
    initializeFilters();
    initializeScrollEffects();
    
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Initialize particles
    initializeParticles();
}

/**
 * Load GSAP and ScrollTrigger plugin
 */
function loadGSAP() {
    return new Promise((resolve) => {
        if (window.gsap) {
            resolve();
            return;
        }

        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        gsapScript.onload = () => {
            const scrollTriggerScript = document.createElement('script');
            scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
            scrollTriggerScript.onload = () => {
                gsap.registerPlugin(ScrollTrigger);
                scrollTriggerLoaded = true;
                resolve();
            };
            document.head.appendChild(scrollTriggerScript);
        };
        document.head.appendChild(gsapScript);
    });
}

/**
 * Initialize GSAP animations
 */
function initializeAnimations() {
    if (!gsapLoaded || !scrollTriggerLoaded) return;

    // Hero animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (heroTitle) {
        gsap.fromTo(heroTitle, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: 0.2,
                ease: "power2.out"
            }
        );
    }

    if (heroSubtitle) {
        gsap.fromTo(heroSubtitle,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.4,
                ease: "power2.out"
            }
        );
    }

    if (heroCta) {
        gsap.fromTo(heroCta,
            {...heroTitle, style: "transform"},
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.6,
                ease: "power2.out"
            }
        );
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        gsap.to(header, {
            backgroundColor: "rgba(10, 10, 10, 0.95)",
            boxShadow: "0 8px 24px rgba(14, 14, 14, 0.08)",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "max",
                scrub: true,
                onToggle: self => {
                    header.classList.toggle('header-scrolled', self.isActive);
                }
            }
        });
    }

    // Parallax effects
    initializeParallax();

    // Timeline animations
    animateTimeline();

    // Product cards entrance
    animateProductCards();
}

/**
 * Initialize parallax scrolling effects
 */
function initializeParallax() {
    if (!scrollTriggerLoaded) return;

    // Parallax background layers
    gsap.utils.toArray('.hero-bg-layer').forEach((layer, index) => {
        const speed = 0.5 + (index * 0.1);
        gsap.to(layer, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Perfume showcase parallax
    const perfumeContainer = document.querySelector('.perfume-showcase');
    if (perfumeContainer) {
        gsap.to(perfumeContainer.querySelector('.perfume-bottle'), {
            rotationY: 15,
            rotationX: 5,
            scrollTrigger: {
                trigger: perfumeContainer,
                start: "top center",
                end: "bottom center",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const rotationY = 15 * progress;
                    const rotationX = 5 * progress;
                    perfumeContainer.querySelector('.perfume-bottle').style.transform = 
                        `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
                }
            }
        });
    }

    // Scroll-linked aroma cloud effect
    createAromaCloudEffect();
}

/**
 * Create scroll-linked aroma cloud animation
 */
function createAromaCloudEffect() {
    const heroForeground = document.querySelector('.hero-foreground');
    if (!heroForeground || !scrollTriggerLoaded) return;

    // Create aroma clouds
    const cloudsContainer = document.createElement('div');
    cloudsContainer.className = 'aroma-clouds';
    cloudsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    // Create multiple cloud particles
    for (let i = 0; i < 15; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud-particle';
        cloud.style.cssText = `
            position: absolute;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(2px);
            opacity: 0;
        `;

        const startX = Math.random() * 100;
        const startY = Math.random() * 100 + 50;
        
        cloud.style.left = `${startX}%`;
        cloud.style.top = `${startY}%`;

        cloudsContainer.appendChild(cloud);
        heroForeground.parentElement.appendChild(cloudsContainer);
    }

    // Animate clouds with scroll
    gsap.utils.toArray('.cloud-particle').forEach((cloud, index) => {
        gsap.to(cloud, {
            y: -window.innerHeight,
            opacity: 0.8,
            scale: 2,
            ease: "none",
            duration: 1,
            scrollTrigger: {
                trigger: '.hero',
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    cloud.style.opacity = progress * 0.8;
                }
            }
        });
    });
}

/**
 * Animate product cards on scroll
 */
function animateProductCards() {
    if (!scrollTriggerLoaded) return;

    gsap.utils.toArray('.product-card, .category-card').forEach((card, index) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 50, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking on links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize modals
 */
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    // Open modals
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    // Close modals
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

/**
 * Open modal with animation
 */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (gsapLoaded) {
        gsap.fromTo(modal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
    }
}

/**
 * Close modal with animation
 */
function closeModal(modal) {
    if (gsapLoaded) {
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize forms
 */
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form quislectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    });
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.btn[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Mesajınız başarıyla gönderildi!', 'success');
        
        // Reset button
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 2000);
}

/**
 * Validate form field
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const type = field.type;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Bu alan zorunludur.';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir e-posta adresi girin.';
        }
    }
    
    // Show error or clear
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Clear errors on input
 */
function clearErrors(e) {
    clearFieldError(e.target);
}

/**
 * Initialize product card interactions
 */
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
        
        // Particle burst on hover
        card.addEventListener('mouseenter', createParticleBurst);
        
        // Click to quick view
        card.addEventListener('click', handleCardClick);
    });
}

/**
 * Handle 3D tilt effect
 */
function handleCardTilt(e) {
    const card = e.currentTarget;
    const cardRect = card.getBoundingClientRect();
    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;
    
    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

/**
 * Reset card tilt
 */
function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
}

/**
 * Create particle burst effect
 */
function createParticleBurst(e) {
    const card = e.target;
    const cardRect = card.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: absolute;
            left: ${cardRect.width / 2}px;
            top: ${cardRect.height / 2}px;
            width: 4px;
            height: 4px;
            background: var(--color-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
        `;
        
        card.appendChild(particle);
        
        // Animate particle
        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
            particle.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }, 10);
    }
}

/**
 * Handle product card click
 */
function handleCardClick(e) {
    e.preventDefault();
    const card = e.currentTarget;
    const productLink = card.querySelector('a');
    if (productLink) {
        window.location.href = productLink.href;
    }
}

/**
 * Initialize timeline animations
 */
function animateTimeline() {
    if (!scrollTriggerLoaded) return;

    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        gsap.fromTo(item,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

/**
 * Initialize filters
 */
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter criteria
            const filterCategory = button.getAttribute('data-category');
            const filterGender = button.getAttribute('data-gender');
            
            // Filter products
            filterProducts(productCards, filterCategory, filterGender);
        });
    });
}

/**
 * Filter products based on criteria
 */
function filterProducts(cards, category, gender) {
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardGender = card.getAttribute('data-gender');
        
        let show = true;
        
        if (category && category !== cardCategory) {
            show = false;
        }
        
        if (gender && gender !== cardGender) {
            show = false;
        }
        
        if (show) {
            card.style.display = 'block';
            if (gsapLoaded) {
                gsap.fromTo(card,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.3 }
                );
            }
        } else {
            if (gsapLoaded) {
                gsap.to(card,
                    {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.3,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    }
                );
            } else {
                card.style.display = 'none';
            }
        }
    });
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize lazy loading
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Initialize particles system
 */
function initializeParticles() {
    const perfumeShowcase = document.querySelector('.perfume-showcase');
    if (!perfumeShowcase) return;
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    perfumeShowcase.querySelector('.perfume-container').appendChild(particlesContainer);
    
    // Create particles periodically
    setInterval(() => {
        createParticle(particlesContainer);
    }, 2000);
}

/**
 * Create individual particle
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and properties
    const x = Math.random() * container.offsetWidth;
    const y = container.offsetHeight;
    const size = Math.random() * 6 + 2;
    
    particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: var(--color-gold);
        border-radius: 50%;
        opacity: 0.8;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
    
    // Animate particle
    if (gsapLoaded) {
        gsap.to(particle, {
            y: -100,
            x: x + (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 3,
            ease: "power1.out",
            onComplete: () => {
                particle.remove();
            }
        });
    } else {
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-light-gold);
        color: var(--color-primary-black);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'TRY') {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for global access
window.AurumParfums = {
    openModal,
    closeModal,
    showNotification,
    formatCurrency
};
