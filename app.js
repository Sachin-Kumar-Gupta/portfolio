// Portfolio Website JavaScript - Fixed Version
// Author: Sachin Gupta

// Global variables
let typingAnimationRunning = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing portfolio...');
    
    // Initialize all functionality in sequence
    setTimeout(() => {
        initNavigation();
        initMobileMenu();
        initContactForm();
        initResumeDownload();
        initBackToTop();
        initScrollEffects();
        initAccessibility();
        initKeyboardNavigation();
        
        // Show home section by default (only if present on this page)
        const hash = window.location.hash; // e.g., "#about"
        const sectionId = hash ? hash.substring(1) : 'home'; // remove "#"
        if (document.getElementById(sectionId)) {
            showSection(sectionId);
        }
        
        // Start typing animation after everything is loaded
        setTimeout(() => {
            initTypingAnimation();
        }, 1000);
        
    }, 100);
});

// Enhanced Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    console.log(`Navigation init: ${navLinks.length} nav links, ${sections.length} sections found`);

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            const targetPage = this.getAttribute('data-page');

            // Allow real pages to navigate (tableau.html, sql.html, etc.)
            if (href && !href.startsWith('#')) {
                // Do NOT preventDefault — let the browser follow the link
                return;
            }

            // Intercept only same-page anchors like "#about" / "#resume"
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Navigation clicked:', targetPage);
            
            // If data-page is set, use it; otherwise, derive from the hash id
            const sectionId = targetPage || href.replace('#', '');
            if (sectionId) {
                showSection(sectionId);
                updateActiveNav(this);
                closeMobileMenu();
            }
        });
    });

    // Handle hero button clicks
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetPage = this.getAttribute('data-page');
            console.log('Hero button clicked:', targetPage);
            
            if (targetPage) {
                showSection(targetPage);
                updateActiveNav(document.querySelector(`[data-page="${targetPage}"]`));
            }
        });
    });
}

// Enhanced section showing functionality
function showSection(sectionId) {
    console.log('Attempting to show section:', sectionId);
    
    const sections = document.querySelectorAll('.page-section');
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) {
        console.error('Target section not found:', sectionId);
        return;
    }
    
    // Hide all sections first
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show target section
    targetSection.style.display = 'block';
    targetSection.classList.add('active');
    
    // Update URL hash
    if (history.pushState) {
        history.pushState(null, null, '#' + sectionId);
    } else {
        window.location.hash = '#' + sectionId;
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Section-specific initialization
    if (sectionId === 'home' && !typingAnimationRunning) {
        setTimeout(() => initTypingAnimation(), 500);
    }
    if (sectionId === 'about') {
        setTimeout(() => animateSkillBars(), 500);
    }
    
    // Update page title
    updatePageTitle(sectionId);
}


// Update active navigation
function updateActiveNav(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Update page title based on section
function updatePageTitle(sectionId) {
    const titles = {
        'home': 'Sachin Kumar Gupta - Data Scientist & Analyst',
        'about': 'About Me - Sachin Kumar Gupta',
        'tableau': 'Tableau Projects - Sachin Kumar Gupta',
        'excel': 'Excel Projects - Sachin Kumar Gupta',
        'sql': 'SQL Projects - Sachin Kumar Gupta',
        'datascience': 'Data Science Projects - Sachin Kumar Gupta',
        'resume': 'Resume - Sachin Kumar Gupta',
        'contact': 'Contact Me - Sachin Kumar Gupta'
    };
    
    document.title = titles[sectionId] || 'Sachin Kumar Gupta - Portfolio';
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }

    console.log('Mobile menu initialized');

    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            console.log('Mobile menu opened');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu when pressing escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        console.log('Mobile menu closed');
    }
}

// Enhanced Typing animation
function initTypingAnimation() {
    const typedTextElement = document.getElementById('typed-text');
    if (!typedTextElement || typingAnimationRunning) {
        console.log('Typing animation skipped - element not found or already running');
        return;
    }

    console.log('Starting typing animation');
    typingAnimationRunning = true;

    const textToType = "Passionate data scientist with 2 years of experience in transforming complex data into actionable insights through advanced analytics, machine learning, and data visualization.";
    
    // Clear existing text
    typedTextElement.textContent = '';
    typedTextElement.style.borderRight = '2px solid var(--color-primary)';
    
    let charIndex = 0;
    const typingSpeed = 50; // milliseconds per character

    function typeWriter() {
        if (charIndex < textToType.length) {
            typedTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                typedTextElement.style.borderRight = 'none';
                typingAnimationRunning = false;
            }, 1000);
        }
    }

    typeWriter();
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) {
        console.error('Contact form not found');
        return;
    }

    console.log('Contact form initialized');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        clearErrors();
        
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Name validation
        const name = document.getElementById('name');
        if (!name || name.value.trim() === '') {
            showError('nameError', 'Name is required');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.value.trim() === '') {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        const subject = document.getElementById('subject');
        if (!subject || subject.value.trim() === '') {
            showError('subjectError', 'Subject is required');
            isValid = false;
        }

        // Message validation
        const message = document.getElementById('message');
        if (!message || message.value.trim() === '') {
            showError('messageError', 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('messageError', 'Message must be at least 10 characters');
            isValid = false;
        }

        console.log('Form validation result:', isValid);
        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = 'var(--color-error)';
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function submitForm() {
        console.log('Submitting form...');
        
        if (formSuccess) {
            form.style.display = 'none';
            formSuccess.classList.remove('hidden');
            formSuccess.style.display = 'block';
            
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                formSuccess.classList.add('hidden');
                formSuccess.style.display = 'none';
                clearErrors();
                console.log('Form reset completed');
            }, 3000);
        }
    }
}

// Resume download functionality
function initResumeDownload() {
    const downloadBtn = document.getElementById('downloadResume');
    
    if (!downloadBtn) {
        console.error('Download resume button not found');
        return;
    }
    
    console.log('Resume download initialized');
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Download button clicked');
        
        try {
            // Create comprehensive resume content
            const resumeContent = `ALEX JOHNSON - DATA SCIENTIST & ANALYTICS EXPERT

CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: [alex.johnson@email.com](mailto:alex.johnson@email.com)
Phone: +1 (555) 123-4567
Location: San Francisco, CA
LinkedIn: linkedin.com/in/alexjohnson
GitHub: github.com/alexjohnson

PROFESSIONAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passionate data scientist with 5+ years of experience transforming complex data 
into actionable insights through advanced analytics, machine learning, and data 
visualization. Proven track record of driving business growth through data-driven 
decision making and statistical analysis.

PROFESSIONAL EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SENIOR DATA SCIENTIST | TechCorp Solutions | 2022 - Present
• Lead data science initiatives, develop predictive models, and collaborate with 
  cross-functional teams to drive data-driven decision making
• Improved customer retention by 30% through machine learning-driven churn 
  prediction models
• Designed and implemented automated reporting systems reducing manual work by 50%
• Managed team of 3 junior data scientists and mentored on best practices

DATA ANALYST | Analytics Plus | 2020 - 2022
• Analyzed large datasets, created interactive dashboards, and provided insights 
  that increased operational efficiency by 25%
• Developed automated data pipelines processing over 1M records daily
• Created comprehensive reporting framework saving 20 hours/week of manual work
• Collaborated with stakeholders to identify key business metrics and KPIs

JUNIOR DATA SCIENTIST | StartupData Inc. | 2019 - 2020
• Developed machine learning models, performed statistical analysis, and created 
  data visualization reports for stakeholders
• Built customer segmentation models improving marketing campaign effectiveness by 40%
• Collaborated on product analytics driving 20% user engagement increase
• Implemented A/B testing framework for product feature optimization

EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Master of Science in Data Science | Stanford University | 2019
• Thesis: "Advanced Machine Learning Techniques for Predictive Analytics"
• GPA: 3.8/4.0

Bachelor of Science in Mathematics | UC Berkeley | 2017  
• Magna Cum Laude, GPA: 3.7/4.0
• Concentration: Statistics and Applied Mathematics

TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Programming Languages: Python, R, SQL, JavaScript, SAS
Machine Learning: Scikit-learn, TensorFlow, PyTorch, XGBoost, Keras
Data Visualization: Tableau, Power BI, Matplotlib, Seaborn, Plotly
Databases: PostgreSQL, MySQL, MongoDB, Snowflake, BigQuery
Cloud Platforms: AWS, Google Cloud Platform, Azure
Tools: Jupyter, Git, Docker, Apache Airflow, Spark

CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• AWS Certified Data Analytics - Specialty (2023)
• Google Analytics Individual Qualification (2022)
• Tableau Desktop Specialist (2022)
• Microsoft Excel Expert (2021)
• Google Cloud Professional Data Engineer (2023)
• SAS Certified Advanced Programmer (2020)

KEY ACHIEVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Increased customer lifetime value by $2M through predictive modeling
• Reduced operational costs by 35% through process optimization analytics  
• Built machine learning models with 94% accuracy for customer sentiment analysis
• Published 3 research papers on applied machine learning techniques
• Mentored 15+ junior analysts and data scientists`;

            // Create and download the file
            const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Alex_Johnson_Resume.txt';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            
            // Show success feedback
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            downloadBtn.style.backgroundColor = 'var(--color-success)';
            downloadBtn.disabled = true;
            
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.backgroundColor = '';
                downloadBtn.disabled = false;
            }, 2000);
            
            console.log('Resume download completed');
            
        } catch (error) {
            console.error('Download failed:', error);
            
            // Show error feedback
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            downloadBtn.style.backgroundColor = 'var(--color-error)';
            
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.backgroundColor = '';
            }, 2000);
        }
    });
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    console.log('Animating skill bars:', skillBars.length);
    
    skillBars.forEach((bar, index) => {
        if (!bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = width;
            }, index * 200 + 200); // Stagger animation
        }
    });
}

// Scroll effects and back to top
function initScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrollTop = window.pageYOffset;
        
        // Navbar shadow
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollTop > 10) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.backdropFilter = 'blur(5px)';
            }
        }

        // Back to top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) {
        console.log('Back to top button not found');
        return;
    }
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        console.log('Scrolling to top');
    });
}

// Accessibility features
function initAccessibility() {
    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
        font-weight: 500;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('home');
        updateActiveNav(document.querySelector('[data-page="home"]'));
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC closes mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Number keys for quick navigation (1-8)
        if (e.key >= '1' && e.key <= '8' && e.altKey) {
            const sections = ['home', 'about', 'tableau', 'excel', 'sql', 'datascience', 'resume', 'contact'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                showSection(sections[sectionIndex]);
                updateActiveNav(document.querySelector(`[data-page="${sections[sectionIndex]}"]`));
            }
        }
    });
}

// Initialize window functions
window.showSection = showSection;
window.closeMobileMenu = closeMobileMenu;

// Listen for manual hash changes (e.g., user types in URL or clicks bookmark)
window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.substring(1);
    if (document.getElementById(newHash)) {
        showSection(newHash);
        const activeLink = document.querySelector(`.nav-link[href='#${newHash}']`);
        updateActiveNav(activeLink);
    }
});