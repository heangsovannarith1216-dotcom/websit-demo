document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // PRELOADER & LOADING BAR
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loaderBar');
    let loadPercent = 0;

    // Simulate loading progress
    const loadingInterval = setInterval(() => {
        loadPercent += Math.floor(Math.random() * 15) + 5;
        if (loadPercent >= 100) {
            loadPercent = 100;
            clearInterval(loadingInterval);
            
            // Fade out preloader
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.classList.remove('no-scroll');
                
                // Initialize elements that reveal on load
                setTimeout(() => {
                    revealElementsOnScroll();
                    startStatsCounters();
                }, 400);
            }, 300);
        }
        loaderBar.style.width = `${loadPercent}%`;
    }, 45);

    // ==========================================================================
    // MOBILE NAV MENU TOGGLE
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ==========================================================================
    // STICKY HEADER & SCROLL PROGRESS BAR
    // ==========================================================================
    const header = document.getElementById('mainHeader');
    const scrollProgressBar = document.getElementById('scrollProgressBar');

    window.addEventListener('scroll', () => {
        // Sticky header background fade
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress computation
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrolled}%`;
        }
    });

    // ==========================================================================
    // CUSTOM CURSOR FOLLOWING WITH INERTIA
    // ==========================================================================
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    
    let cursorX = 0, cursorY = 0; // Actual cursor position
    let targetX = 0, targetY = 0; // Mouse position
    const speed = 0.15; // Follow lag speed (inertia)

    if (cursor && cursorDot) {
        // Initialize cursor visibility
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = 1;
            cursorDot.style.opacity = 1;
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = 0;
            cursorDot.style.opacity = 0;
        });

        // Track target mouse position
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            
            // Dot follows mouse directly
            cursorDot.style.left = `${targetX}px`;
            cursorDot.style.top = `${targetY}px`;
        });

        // Render loop for main cursor (lagging dot)
        const renderCursor = () => {
            cursorX += (targetX - cursorX) * speed;
            cursorY += (targetY - cursorY) * speed;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        // Hover expansions
        const interactables = document.querySelectorAll('a, button, .project-card, .tab-btn, .filter-btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    }

    // ==========================================================================
    // LIGHT/DARK THEME TOGGLE
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeToggleIcon = document.getElementById('themeToggleIcon');

    // Retrieve saved theme or default to system preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggleIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        themeToggleIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            themeToggleIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeToggleIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================================================
    // HERO AUTO-TYPING EFFECT
    // ==========================================================================
    const typingSpan = document.getElementById('typingText');
    const titles = ['Creative Developer', 'Software Engineer', 'UI/UX Specialist', 'Problem Solver'];
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentTitle = titles[titleIdx];
        
        if (isDeleting) {
            typingSpan.textContent = currentTitle.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Deletes faster
        } else {
            typingSpan.textContent = currentTitle.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120; // Natural typing pace
        }

        // Logic swaps
        if (!isDeleting && charIdx === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            typingSpeed = 500; // Small delay before next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typingSpan) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // INTERACTIVE HERO CANVAS (Nodes & Networking)
    // ==========================================================================
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };

        // Handle canvas sizing
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };

        window.addEventListener('resize', resizeCanvas);
        // Track mouse position within hero section
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                // Dynamically fetch styles from CSS variables
                const isLight = document.body.classList.contains('light-theme');
                ctx.fillStyle = isLight ? 'rgba(109, 40, 217, 0.45)' : 'rgba(6, 182, 212, 0.45)';
                ctx.fill();
            }

            update() {
                // Bounce on borders
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                // Mouse interaction (Repulsion effect)
                if (mouse.x !== null && mouse.y !== null) {
                    let diffX = this.x - mouse.x;
                    let diffY = this.y - mouse.y;
                    let distance = Math.sqrt(diffX * diffX + diffY * diffY);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius; // 0 to 1
                        let forceX = (diffX / distance) * force * 3;
                        let forceY = (diffY / distance) * force * 3;
                        
                        this.x += forceX;
                        this.y += forceY;
                    }
                }

                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        const initParticles = () => {
            particles = [];
            let quantity = Math.floor((canvas.width * canvas.height) / 14000);
            quantity = Math.min(quantity, 100); // Cap particles for performance
            
            for (let i = 0; i < quantity; i++) {
                let size = Math.random() * 2 + 1;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let dx = (Math.random() - 0.5) * 0.4;
                let dy = (Math.random() - 0.5) * 0.4;
                particles.push(new Particle(x, y, dx, dy, size));
            }
        };

        const connectParticles = () => {
            const isLight = document.body.classList.contains('light-theme');
            const lineColor = isLight ? '109, 40, 217' : '6, 182, 212';
            
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dist = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + 
                               ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    // Draw line if points are close
                    if (dist < 12000) {
                        let opacity = 1 - (dist / 12000);
                        ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connectParticles();
            requestAnimationFrame(animateCanvas);
        };

        resizeCanvas();
        animateCanvas();
    }

    // ==========================================================================
    // REVEAL ON SCROLL & ACTIVE LINK STATE ON SCROLL
    // ==========================================================================
    const revealElements = document.querySelectorAll('.service-card, .project-card, .timeline-item, .about-info, .about-tabs-container');
    const sections = document.querySelectorAll('section');

    // Add CSS reveal class initially
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealElementsOnScroll = () => {
        const triggerBottom = (window.innerHeight / 10) * 8.5;

        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('active');
                
                // If it is the about section, trigger skill bar animation
                if (el.classList.contains('about-tabs-container')) {
                    animateSkillBars();
                }
            }
        });

        // Navigation link active indicator matching current section
        let currentSecId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= (secTop - 180)) {
                currentSecId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSecId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealElementsOnScroll);

    // Trigger skill progress bars loading
    const animateSkillBars = () => {
        const progressBars = document.querySelectorAll('.skill-progress-fill');
        progressBars.forEach(bar => {
            const val = bar.parentElement.previousElementSibling.lastElementChild.textContent;
            bar.style.width = val;
        });
    };

    // ==========================================================================
    // STAT COUNTER ANIMATION
    // ==========================================================================
    let countersStarted = false;
    const startStatsCounters = () => {
        if (countersStarted) return;
        
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const step = target > 20 ? Math.ceil(target / 25) : 1;
            
            const counterInterval = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counterInterval);
                } else {
                    stat.textContent = current;
                }
            }, 45);
        });
        countersStarted = true;
    };

    // ==========================================================================
    // TAB SELECTION FOR ABOUT DETAILS
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Set active
            btn.classList.add('active');
            const targetId = `tab-${btn.getAttribute('data-tab')}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // If switching to skills tab, run skill bars loading animation
                if (btn.getAttribute('data-tab') === 'skills') {
                    setTimeout(animateSkillBars, 100);
                }
            }
        });
    });

    // ==========================================================================
    // PORTFOLIO FILTER MECHANISM
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    card.classList.remove('hide');
                    // Add subtle scaling entrance animation trigger
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ==========================================================================
    // PROJECT DATA & MODAL LIGHTBOX
    // ==========================================================================
    const projectsData = {
        '1': {
            title: 'Nova Analytics Dashboard',
            category: 'Development',
            desc: 'Nova Analytics is a high-performance SaaS platform built to analyze high-frequency transactional data. It offers real-time charting, interactive tables, and drag-and-drop report layout builders, packaged inside a gorgeous and configurable glassmorphic theme. It allows businesses to understand operational patterns and optimize throughput.',
            client: 'NovaCorp International',
            timeline: '3 Months (Q1 2024)',
            tech: ['React.js', 'Chart.js', 'TailwindCSS', 'Framer Motion'],
            link: '#'
        },
        '2': {
            title: 'Ecosphere Mobile App',
            category: 'UI/UX Design',
            desc: 'Ecosphere is a mobile app concept aiming to support eco-conscious individuals. Through visual progress trackers, eco-shopping scanning codes, and gamified challenges, it helps users document and reduce their carbon footprint. The visual system incorporates soft organic gradients, clean rounded cards, and high usability scoring.',
            client: 'Green Earth Council',
            timeline: '2 Months (2024)',
            tech: ['Figma', 'Adobe Illustrator', 'User Research', 'Prototyping'],
            link: '#'
        },
        '3': {
            title: 'Nebula Engine WebGL',
            category: 'Interactive',
            desc: 'Nebula Engine is a client-side WebGL interactive application showing a simulated multi-planet ecosystem. Harnessing custom shaders and GPU particle computing, it allows users to modify star gravity parameters, edit particle masses, and fly through asteroid fields. Perfect demonstration of graphics programming in modern web browsers.',
            client: 'AstroVisuals Group',
            timeline: '4 Months (2023)',
            tech: ['Three.js', 'WebGL', 'GLSL Shaders', 'JavaScript'],
            link: '#'
        },
        '4': {
            title: 'Aether E-Commerce Portal',
            category: 'Development',
            desc: 'Aether is a headless e-commerce store built for high-end fashion brands. Using modular components and automated cache synchronization, it delivers sub-second load times. Features a custom product catalog builder, automated cart saving, secure credit card transactions, and automated invoice delivery.',
            client: 'Aether Apparel Ltd',
            timeline: '5 Months (2024)',
            tech: ['Next.js', 'Stripe API', 'MongoDB', 'Node.js'],
            link: '#'
        },
        '5': {
            title: 'Sonus Audio Ecosystem',
            category: 'UI/UX Design',
            desc: 'Sonus is an interface concept for high-end audio devices and streaming networks. Built using neumorphism (soft extruded shapes and layered shadows), the dashboard centralizes equalizer controls, audio stream distribution, and playlist settings. Rigorous user journey maps were drawn to test accessibility options.',
            client: 'Sonus Labs LLC',
            timeline: '2 Months (2023)',
            tech: ['Figma', 'Neumorphic Principles', 'User Journey Maps'],
            link: '#'
        },
        '6': {
            title: 'Synapse Neural Playground',
            category: 'Interactive',
            desc: 'Synapse is an educational interactive dashboard showing neural networks at work. Users can add layers, set neurons, select activation functions, and see how weights adapt visually to classify mock dataset points. Perfect visualization for students to grasp machine learning structures without programming.',
            client: 'TechAcademy Cambo',
            timeline: '3 Months (2023)',
            tech: ['JavaScript Canvas', 'Machine Learning Logic', 'CSS Grid'],
            link: '#'
        }
    };

    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const openModalBtns = document.querySelectorAll('.btn-project-detail');

    const openModal = (projId) => {
        const data = projectsData[projId];
        if (!data) return;

        // Generate gradient based on ID to match cards
        const gradClasses = ['grad-purple', 'grad-blue', 'grad-cyan', 'grad-red', 'grad-orange', 'grad-emerald'];
        const cardGradIndex = (parseInt(projId) - 1) % gradClasses.length;
        const gradClass = gradClasses[cardGradIndex];

        // Format tech list
        const techHTML = data.tech.map(t => `<span>${t}</span>`).join('');

        modalBody.innerHTML = `
            <div class="modal-img-wrapper ${gradClass}">
                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                    <i class="fa-solid fa-folder-open" style="font-size: 5rem; opacity: 0.35; color:#fff;"></i>
                </div>
            </div>
            <div class="modal-info-grid">
                <div class="modal-main-details">
                    <span class="project-category">${data.category}</span>
                    <h3>${data.title}</h3>
                    <p>${data.desc}</p>
                </div>
                <div class="modal-meta-details">
                    <div class="meta-item">
                        <span class="meta-label">Client</span>
                        <span class="meta-val">${data.client}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Timeline</span>
                        <span class="meta-val">${data.timeline}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Technologies</span>
                        <div class="project-tech">
                            ${techHTML}
                        </div>
                    </div>
                    <a href="${data.link}" class="btn-primary">
                        <span>Launch App</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            </div>
        `;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projId = btn.getAttribute('data-project');
            openModal(projId);
        });
    });

    if (modalCloseBtn && modalBackdrop) {
        modalCloseBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION & API SIMULATION
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formResponseMsg = document.getElementById('formResponseMsg');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set sending UI state
            formSubmitBtn.disabled = true;
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = `
                <span>Sending Message...</span>
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;

            // Collect values
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;

            // Simulate form submission
            setTimeout(() => {
                // Return normal state
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
                
                // Show response success (mock submission)
                formResponseMsg.className = 'form-response-msg success';
                formResponseMsg.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                
                // Reset form inputs
                contactForm.reset();

                // Clear message after 5 seconds
                setTimeout(() => {
                    formResponseMsg.style.opacity = 0;
                    setTimeout(() => {
                        formResponseMsg.textContent = '';
                        formResponseMsg.className = 'form-response-msg';
                        formResponseMsg.style.opacity = 1;
                    }, 300);
                }, 5000);

            }, 2000); // 2 second fake network latency
        });
    }
});
