document.addEventListener('DOMContentLoaded', function() {

  // Tabs functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabs.length > 0 && tabContents.length > 0) {
      tabs.forEach(tab => {
          tab.addEventListener('click', () => {
              const tabId = tab.getAttribute('data-tab');

              // Remove active class from all tabs and contents
              tabs.forEach(t => t.classList.remove('active'));
              tabContents.forEach(content => content.classList.remove('active'));

              // Add active class to clicked tab and corresponding content
              tab.classList.add('active');
              const activeContent = document.getElementById(`${tabId}-content`);
              if (activeContent) {
                  activeContent.classList.add('active');
              }
          });
      });
  }

  // Header background change on scroll
  const header = document.querySelector('header');
  if (header) {
      // Apply initial state based on scroll position on load
      const checkHeaderScroll = () => {
          if (window.scrollY > 50) {
              header.classList.add('scrolled');
          } else {
              header.classList.remove('scrolled');
          }
      };
      window.addEventListener('scroll', checkHeaderScroll);
      checkHeaderScroll(); // Run on load
  }

   // Simple Video Pause after 7 seconds
    const video = document.getElementById('heroVideo');
    if (video) {
        video.play().then(() => {
            console.log("Hero video started.");
            setTimeout(() => {
                if (!video.paused) {
                    video.pause();
                    console.log("Hero video paused after timeout.");
                }
            }, 7000);
        }).catch(error => {
            console.warn("Hero video autoplay prevented:", error);
        });
    }

  // --- CORRECTED FAQ Accordion Functionality ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (question && answer) {
        // Set initial aria attributes
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.maxHeight = '0'; // Ensure it starts collapsed

        question.addEventListener('click', () => {
          const isExpanded = question.getAttribute('aria-expanded') === 'true';

          // Toggle attributes
          question.setAttribute('aria-expanded', String(!isExpanded));
          answer.setAttribute('aria-hidden', String(isExpanded)); // Corrected: true when collapsing, false when expanding

          if (!isExpanded) {
            // Expand: Set max-height to scrollHeight for animation
            // scrollHeight includes padding of the element *itself* and its children.
            answer.style.maxHeight = answer.scrollHeight + 'px';
          } else {
            // Collapse: Set max-height back to 0
            answer.style.maxHeight = '0';
          }
        });

        // Optional: Recalculate scrollHeight on window resize for open items
        // Avoids content clipping if window is resized while FAQ is open
        window.addEventListener('resize', () => {
            if (question.getAttribute('aria-expanded') === 'true') {
                // Temporarily remove max-height to get accurate scrollHeight
                answer.style.maxHeight = 'none';
                const currentScrollHeight = answer.scrollHeight;
                answer.style.maxHeight = currentScrollHeight + 'px';
                 // Add a slight delay before setting back to 'none' if needed,
                 // but usually setting it directly works. If flicker occurs, uncomment below.
                // setTimeout(() => { answer.style.maxHeight = currentScrollHeight + 'px'; }, 0);
            }
        });
      }
    });
  }
  // --- END CORRECTED FAQ ---

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Close mobile menu if open
           const nav = document.querySelector('header nav');
           if(nav && nav.classList.contains('active')){
               nav.classList.remove('active');
               const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
               if(mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
           }
        }
      }
    });
  });

  // Mobile Menu Toggle Functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('header nav');

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      const isExpanded = nav.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    document.addEventListener('click', function(event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);

      if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  // EmailJS Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');
    const submitButton = document.getElementById('submitButton');

    if (contactForm && formResponse && submitButton) {
        // !!! IMPORTANT: Replace with your ACTUAL EmailJS credentials !!!
        const EMAILJS_PUBLIC_KEY = "lKexp3-c014Ddpsu3"; // Replace 'YOUR_PUBLIC_KEY'
        const EMAILJS_SERVICE_ID = "service_krpvgef";      // Replace 'YOUR_SERVICE_ID'
        const EMAILJS_TEMPLATE_ID = "dommio_contact";     // Replace 'YOUR_TEMPLATE_ID'
        // !!! -------------------------------------------------------- !!!

        let emailJsInitialized = false;
        if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
             try {
                 emailjs.init(EMAILJS_PUBLIC_KEY);
                 emailJsInitialized = true;
                 console.log("EmailJS Initialized.");
             } catch (err) {
                 console.error("Failed to initialize EmailJS:", err);
                 formResponse.innerHTML = '<div class="error-message">Contact form configuration error. Please contact support.</div>';
                 submitButton.disabled = true; // Disable form if config fails
             }
        } else {
            console.warn("EmailJS Public Key is not set or is a placeholder. Form submission will be simulated.");
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            formResponse.innerHTML = '';

            if (emailJsInitialized && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID') {
                 emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
                    .then(function() {
                        formResponse.innerHTML = '<div class="success-message">Thank you! Your message has been sent successfully. We\'ll be in touch soon.</div>';
                        contactForm.reset();
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    }, function(error) {
                        console.error('EmailJS Send Failed:', error);
                        let errorMsg = 'Sorry, there was an error sending your message. Please try again later or contact us directly.';
                        if (error && error.status === 412) { // Example specific error check
                            errorMsg = 'There seems to be a configuration issue with the contact form. Please contact us directly.';
                        }
                        formResponse.innerHTML = `<div class="error-message">${errorMsg}</div>`;
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    });
            } else {
                console.log("EmailJS not configured or using placeholders. Simulating form submission.");
                setTimeout(() => {
                    formResponse.innerHTML = '<div class="success-message">(Simulated) Thank you! Your message would have been sent.</div>';
                    contactForm.reset();
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    } else {
        console.warn("Contact form elements not found. Submission functionality disabled.");
    }

}); // End DOMContentLoaded
