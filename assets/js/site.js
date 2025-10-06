/**
 * Aurum Parfums - Modern JavaScript Engine
 * Enhanced animations and interactions with GSAP
 */

class AureusApp {
    constructor() {
        this.gsapLoaded = false;
        this.scrollTriggerLoaded = false;
        this.init();
    }

    async init() {
        await this.loadGSAP();
        this.initializeComponents();
        this.setupAnimations();
        this.setupEventListeners();
    }

    async loadGSAP() {
        return new Promise((resolve) => {
            if (window.gsap) {
                this.gsapLoaded = true;
                resolve();
                return;
            }

            // Fallback timeout for GSAP loading
            const timeoutId = setTimeout(() => {
                if (!this.gsapLoaded) {
                    this.gsapLoaded = true;
                    console.log('GSAP loaded with timeout fallback');
                    resolve();
                }
            }, 3000);

            const gsapScript = document.createElement('script');
            gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            gsapScript.onerror = () => {
                clearTimeout(timeoutId);
                this.gsapLoaded = true;
                console.log('GSAP failed to load, using fallback');
                resolve();
            };
            gsapScript.onload = () => {
                if (window.gsap) {
                    const scrollTriggerScript = document.createElement('script');
                    scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                    scrollTriggerScript.onload = () => {
                        if (window.ScrollTrigger) {
                            gsap.registerPlugin(ScrollTrigger);
                            this.scrollTriggerLoaded = true;
                        }
                        clearTimeout(timeoutId);
                        this.gsapLoaded = true;
                        resolve();
                    };
                    scrollTriggerScript.onerror = () => {
                        clearTimeout(timeoutId);
                        this.gsapLoaded = true;
                        resolve();
                    };
                    document.head.appendChild(scrollTriggerScript);
                } else {
                    clearTimeout(timeoutId);
                    this.gsapLoaded = false;
                    resolve();
                }
            };
            document.head.appendChild(gsapScript);
        });
    }

    initializeComponents() {
        this.heroAnimations();
        this.navigationSetup();
        this.modalSetup();
        this.productCardAnimations();
        this.lazyLoadingSetup();
        this.mobileMenuSetup();
    }

    heroAnimations() {
        // Check if hero elements exist
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (!heroTitle && !heroSubtitle && !heroButtons) {
            console.log('Hero elements not found, skipping hero animations');
            return;
        }
        
        // Hero content animations
        const tl = gsap.timeline();
        
        if (heroTitle) {
            tl.to('.hero-title', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        }
        
        if (heroSubtitle) {
            tl.to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.5");
        }
        
        if (heroButtons) {
            tl.to('.hero-buttons', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3");
        }

        // Floating animation for perfume bottle
        const perfumeBottle = document.querySelector('.perfume-bottle');
        if (perfumeBottle) {
            gsap.to('.perfume-bottle', {
                y: -20,
                duration: 3,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
            });
        }

        // Background particles animation - DISABLED
        // this.createBackgroundParticles();
    }

    createBackgroundParticles() {
        const container = document.querySelector('.hero');
        
        // Check if hero element exists before creating particles
        if (!container) {
            console.log('Hero element not found, skipping background particles');
            return;
        }
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();

        // Cleanup on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    navigationSetup() {
        const header = document.querySelector('.header');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Header scroll effect
        gsap.to(header, {
            backgroundColor: "rgba(10, 10, 10, 0.95)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "max",
                scrub: true,
                onToggle: self => {
                    header.classList.toggle('scrolled', self.isActive);
                }
            }
        });

        // Mobile menu
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close menu on link click
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                });
            });

            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    }

    modalSetup() {
        const modals = document.querySelectorAll('.modal');
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modalCloses = document.querySelectorAll('.modal-close');

        // Open modals
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    this.openModal(modal);
                }
            });
        });

        // Close modals
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = closeBtn.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close modal on outside click
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        gsap.fromTo(modal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
    }

    closeModal(modal) {
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    productCardAnimations() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            // 3D hover effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            });

            // Particle burst on hover
            card.addEventListener('mouseenter', (e) => {
                this.createParticleBurst(e.target);
            });

            // Click to navigate
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const productLink = card.querySelector('a');
                if (productLink) {
                    window.location.href = productLink.href;
                }
            });
        });
    }

    createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.cssText = `
                position: absolute;
                left: ${rect.width / 2}px;
                top: ${rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #8b5cf6, #ec4899);
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
            `;
            
            element.appendChild(particle);
            
            gsap.fromTo(particle, 
                { scale: 0, opacity: 1 },
                {
                    scale: 1,
                    x: x,
                    y: y,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => particle.remove()
                }
            );
        }
    }

    setupAnimations() {
        // ScrollTrigger animations
        gsap.registerPlugin(ScrollTrigger);

        // Animate cards on scroll
        gsap.utils.toArray('.product-card, .category-card, .card').forEach((card, index) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 100, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Parallax effects
        gsap.utils.toArray('.hero-bg-layer').forEach((layer, index) => {
            const speed = 0.5 + (index * 0.2);
            gsap.to(layer, {
                yPercent: -50 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Progress line animation
        this.createScrollProgress();
    }

    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #8b5cf6, #ec4899);
            transform: scaleX(0);
            transform-origin: left;
            z-index: 9999;
        `;
        
        document.body.appendChild(progressBar);

        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            onUpdate: self => {
                gsap.to(progressBar, {
                    scaleX: self.progress,
                    duration: 0.1
                });
            }
        });
    }

    setupEventListeners() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: targetElement,
                            offsetY: 100
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                gsap.to(ripple, {
                    scale: 1,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => ripple.remove()
                });
            });
        });
    }

    lazyLoadingSetup() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        
                        gsap.fromTo(img,
                            { opacity: 0, scale: 1.1 },
                            { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
                        );
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Utility functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
        `;
        
        document.body.appendChild(notification);
        
        gsap.fromTo(notification,
            { opacity: 0, x: 300 },
            {
                opacity: 1,
                x: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(notification, {
                            opacity: 0,
                            x: 300,
                            duration: 0.3,
                            ease: "power2.in",
                            onComplete: () => notification.remove()
                        });
                    }, 3000);
                }
            }
        );
    }

    formatCurrency(amount, currency = 'TRY') {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    mobileMenuSetup() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const mobileCloseBtn = document.querySelector('.mobile-close-btn');
        
        if (!mobileToggle || !navMenu) {
            console.log('Mobile menu elements not found');
            return;
        }
        
        // Mobile menu toggle functionality
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            } else {
                navMenu.classList.add('active');
                mobileToggle.classList.add('active');
            }
        });

        // Close button functionality
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });

        // Close menu when clicking on nav links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.AureusApp = new AureusApp();
});

// Export for global access
window.AureusApp = AureusApp;