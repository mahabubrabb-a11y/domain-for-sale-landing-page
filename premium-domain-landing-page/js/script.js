document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PRELOADER ENGINE
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 400);
    }

    // 2. STICKY NAVBAR & NAVIGATION ACTIONS
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Toggle sticky state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/Hide back-to-top button
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active state navigation logic
        let currentSection = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. MOBILE MENU IMPLEMENTATION
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 4. FAQ ACCORDION HANDLER
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const body = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                body.style.maxHeight = null;
                if(icon) icon.className = 'fa-solid fa-plus';
            } else {
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                    const b = i.querySelector('.accordion-body');
                    if(b) b.style.maxHeight = null;
                    const ic = i.querySelector('.accordion-header i');
                    if(ic) ic.className = 'fa-solid fa-plus';
                });
                
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
                if(icon) icon.className = 'fa-solid fa-minus';
            }
        });
    });

    // 5. COUNTDOWN TIMER ENGINE
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        const deadline = new Date(countdownEl.getAttribute('data-deadline')).getTime();
        const runCountdown = () => {
            const now = new Date().getTime();
            const gap = deadline - now;
            if (gap <= 0) {
                countdownEl.innerHTML = "<h4>Offer Period Expired!</h4>";
                clearInterval(interval);
                return;
            }
            const sec = 1000, min = sec * 60, hr = min * 60, day = hr * 24;
            document.getElementById('days').innerText = Math.floor(gap / day).toString().padStart(2, '0');
            document.getElementById('hours').innerText = Math.floor((gap % day) / hr).toString().padStart(2, '0');
            document.getElementById('minutes').innerText = Math.floor((gap % hr) / min).toString().padStart(2, '0');
            document.getElementById('seconds').innerText = Math.floor((gap % min) / sec).toString().padStart(2, '0');
        };
        const interval = setInterval(runCountdown, 1000);
        runCountdown();
    }

    // 6. NUMERICAL COUNTER ANIMATION (Stats Section)
    const statsSection = document.getElementById('stats');
    const counters = document.querySelectorAll('.stat-number');
    let counterTriggered = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = target / 50;
            const updateCount = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + speed);
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target.toLocaleString() + (target === 99 ? "/100" : target === 100 ? "%" : "+");
                }
            };
            updateCount();
        });
    };

    // 7. INTERACTIVE SCROLL REVEAL SCANNERS
    const revealItems = document.querySelectorAll('.scroll-reveal');
    const revealOnScroll = () => {
        revealItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < window.innerHeight - 50) {
                item.classList.add('revealed');
                if(item.classList.contains('stats-grid') || item.closest('#stats')) {
                    if(!counterTriggered) { startCounters(); counterTriggered = true; }
                }
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 8. FORM VALIDATION ENGINE & TOAST SYSTEM
    const form = document.getElementById('domainOfferForm');
    const showToast = (message, type = 'success') => {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 400);
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            const name = document.getElementById('userName');
            const email = document.getElementById('userEmail');
            const phone = document.getElementById('userPhone');
            const country = document.getElementById('userCountry');
            const offer = document.getElementById('offerAmount');

            // Reset States
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));

            if (name.value.trim().length < 3) { name.parentElement.classList.add('invalid'); isFormValid = false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.parentElement.classList.add('invalid'); isFormValid = false; }
            if (phone.value.trim().length < 7) { phone.parentElement.classList.add('invalid'); isFormValid = false; }
            if (country.value.trim() === '') { country.parentElement.classList.add('invalid'); isFormValid = false; }
            if (+offer.value < 1000) { offer.parentElement.classList.add('invalid'); isFormValid = false; }

            if (isFormValid) {
                showToast('Offer submitted successfully through Escrow network!', 'success');
                form.reset();
            } else {
                showToast('Please correctly fill all required fields.', 'error');
            }
        });
    }
});