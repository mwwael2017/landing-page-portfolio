document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.toggle('is-active');
            mobileMenuBtn.classList.toggle('is-active'); // Animate button
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('is-active');
                mobileMenuBtn.classList.remove('is-active'); // Reset button
            });
        });
    }

    // Custom Form Validation
    const forms = document.querySelectorAll('form[novalidate]');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');

        // Add error message elements
        inputs.forEach(input => {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required'; // Default message

            // Layout check
            if (input.parentElement.classList.contains('form-group')) {
                // Standard contact form
                input.parentElement.appendChild(errorMsg);
            } else if (input.parentElement.classList.contains('input-group-wrapper')) {
                // Nested CTA form (Wrapper -> Input)
                // Append error message AFTER the wrapper
                input.parentElement.parentElement.insertBefore(errorMsg, input.parentElement.nextSibling);
            } else {
                // Fallback for flat structures
                input.parentElement.insertBefore(errorMsg, input.nextSibling);
            }

            // Clear error on input
            input.addEventListener('input', () => {
                const parent = input.parentElement;

                // standard form-group
                if (parent.classList.contains('form-group') && parent.classList.contains('error')) {
                    parent.classList.remove('error');
                }

                // wrapper CTA
                if (parent.classList.contains('input-group-wrapper') && parent.classList.contains('error')) {
                    parent.classList.remove('error');
                }

                // direct input
                if (input.classList.contains('error-border')) {
                    input.classList.remove('error-border');
                    errorMsg.style.opacity = '0'; // Hide fallback
                }
            });
        });

        form.addEventListener('submit', (e) => {
            let isValid = true;

            inputs.forEach(input => {
                const parent = input.parentElement;
                let errorDisplay;

                if (parent.classList.contains('form-group')) {
                    errorDisplay = parent.querySelector('.error-message');
                } else if (parent.classList.contains('input-group-wrapper')) {
                    // Find the error message we inserted after the wrapper
                    errorDisplay = parent.nextElementSibling;
                    // Verify class just in case of markup changes
                    if (!errorDisplay || !errorDisplay.classList.contains('error-message')) {
                        // try to find it (it might be separated by a text node?)
                        // Actually simpler to just rely on nextElementSibling if we control insertion
                        errorDisplay = null; // Safety
                        let sibling = parent.nextSibling;
                        while (sibling) {
                            if (sibling.nodeType === 1 && sibling.classList.contains('error-message')) {
                                errorDisplay = sibling;
                                break;
                            }
                            sibling = sibling.nextSibling;
                        }
                    }
                } else {
                    errorDisplay = input.nextElementSibling;
                }

                // Check invalid
                const isInvalid = (!input.value.trim() && input.hasAttribute('required')) ||
                    (input.type === 'email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));

                if (isInvalid) {
                    isValid = false;

                    if (parent.classList.contains('form-group')) {
                        parent.classList.add('error');
                    } else if (parent.classList.contains('input-group-wrapper')) {
                        parent.classList.add('error'); // Add error class to WRAPPER
                    } else {
                        input.classList.add('error-border');
                    }

                    // Show message
                    if (errorDisplay) {
                        errorDisplay.style.opacity = '1';
                        errorDisplay.style.height = 'auto';
                        errorDisplay.style.transform = 'translateY(0)';
                        errorDisplay.textContent = (!input.value.trim()) ? 'This field is required' : 'Please enter a valid email';
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();

                // Reset Shake Animation
                const errorElements = form.querySelectorAll('.form-group.error, input.error-border, .input-group-wrapper.error');
                errorElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight;
                    el.style.animation = null;
                });
            }
        });
    });

    animatedElements.forEach(el => observer.observe(el));
});
