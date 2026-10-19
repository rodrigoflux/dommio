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
          // Reveal tab content before scrolling to a buyer or supplier link.
          if (targetElement.classList.contains('tab-content')) {
            const targetTab = Array.from(tabs).find(tab =>
              `${tab.getAttribute('data-tab')}-content` === targetElement.id
            );
            if (targetTab) targetTab.click();
          }
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

        // Include the audience in the existing message template as well as its own field.
        contactForm.addEventListener('formdata', function(event) {
            const audience = contactForm.elements.namedItem('inquiry_type');
            if (audience.value) {
                const audienceLabel = audience.labels[0].textContent;
                const audienceName = audience.selectedOptions[0].textContent;
                event.formData.set('message', `${audienceLabel}: ${audienceName}\n\n${event.formData.get('message') || ''}`);
            }
        });

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

  // Language Switcher Functionality
  const translations = {
    "en": {
      "audience-label": "I am a",
      "audience-placeholder": "Select buyer or supplier",
      "audience-buyer": "Buyer",
      "audience-supplier": "Supplier",
      "buyer-introduction": "Tell us what you need to buy. DommioGlobal identifies potential Latin American suppliers and manages the commercial conversation—from product questions and quotations through negotiation and order follow-up.",
      "page-title": "DommioGlobal | Latin American Suppliers & International Buyers",
      "commission-title": "We earn our commission when you get paid.",
      "commission-description": "There are no upfront fees. Suppliers pay a commission when they receive payment from the buyer. The commission, scope of work, and payment conditions are agreed in writing before work begins. Buyers pay no separate sourcing fee.",
      "footer-description": "Helping Latin American suppliers and international buyers move business forward through clear offers and consistent follow-up.",
      "home": "Home",
      "about": "About Us",
      "services": "Services",
      "for-buyers": "For Buyers",
      "for-suppliers": "For Suppliers",
      "contact-us": "Contact Us",
      "contact": "Contact",
      "about-us": "About Us",
      "our-process": "Our Process",
      "industries-nav": "Industries",
      "deal-tracking": "Deal Management",
      "faq-nav": "FAQ",
      "hero-title": "Connecting Latin American suppliers with international buyers.",
      "hero-subtitle": "Your single point of contact for buying and selling across borders. We pursue sales opportunities, clarify quotations, and follow up on responses—so you spend less time chasing answers and more time making business decisions.",
      "discover-approach": "Let’s Talk Business",
      "data-driven-title": "From First Contact to Repeat Business",
      "data-driven-description": "DommioGlobal helps Latin American suppliers develop business with international buyers. We identify prospects, lead sales outreach, develop commercial proposals, and support negotiations—with continued follow-up to pursue orders and repeat business.",
      "tab-suppliers": "For Suppliers",
      "tab-buyers": "For Buyers",
      "market-intelligence-title": "Market Development",
      "market-intelligence-desc": "We assess your product offering, pricing, and commercial priorities to focus sales efforts on relevant markets and buyer profiles.",
      "buyer-prospecting-title": "Buyer Prospecting",
      "buyer-prospecting-desc": "We research potential buyers and assess their product needs, purchasing interest, and fit with your offer.",
      "sales-outreach-title": "Direct Sales Outreach",
      "sales-outreach-desc": "We approach potential buyers, present your products, respond to questions, and follow up to develop sales conversations.",
      "documentation-title": "Commercial Proposals",
      "documentation-desc": "We work with you to develop quotations that communicate your product’s value, pricing, quantities, and commercial terms.",
      "negotiation-title": "Negotiation & Closing Support",
      "negotiation-desc": "We address buyer objections, support negotiations, and follow up on purchasing decisions, with commercial terms subject to your approval.",
      "customer-success-title": "Account Development",
      "customer-success-desc": "Build on the first sale. We stay in touch with buyers about reorders and additional products so new opportunities receive attention after the initial deal.",
      "insightful-title": "Supplier Search",
      "insightful-desc": "We identify Latin American suppliers whose products may match your requirements and coordinate communication through DommioGlobal.",
      "vetting-title": "Product & Commercial Information",
      "vetting-desc": "We gather available specifications, supplier-provided documentation, and commercial details for your review.",
      "procurement-title": "Quotations & Offers",
      "procurement-desc": "Understand the offer before you decide. We clarify prices, quantities, lead times, and payment terms so you can assess quotations with fewer unanswered questions.",
      "coordination-title": "Purchasing Requirements",
      "coordination-desc": "We work with you to clarify product, packaging, and delivery requirements, then coordinate supplier responses.",
      "logistics-title": "Negotiation Support",
      "logistics-desc": "We coordinate discussions on commercial terms, gather supplier responses, and follow up on outstanding points.",
      "ongoing-title": "Order & Reorder Follow-Up",
      "ongoing-desc": "Spend less time chasing updates. We follow up on order questions and purchasing needs so you know what is pending and what comes next.",
      "beyond-brokerage": "YOUR PRODUCTS.",
      "intelligent-growth": "OUR SALES FOCUS.",
      "strategic-partner": "YOUR PARTNER IN INTERNATIONAL SALES",
      "company-description": "Relevant prospects, a clear offer, and persistent follow-up help keep commercial discussions moving. DommioGlobal pursues buyer interest, clarifies requirements, and follows up on proposals and negotiations so you can focus on decisions rather than chasing responses.",
      "request-info": "Discuss an Opportunity",
      "market-access-title": "Targeted Prospecting",
      "market-access-desc": "We identify potential buyers whose product needs and purchasing requirements fit your offer, then focus outreach on those opportunities.",
      "sales-execution-title": "Active Sales Execution",
      "sales-execution-desc": "We lead outreach, present your offer, address commercial questions, and follow up on proposals and negotiations to pursue the order.",
      "powered-growth-title": "Account Development",
      "powered-growth-desc": "We stay in contact after the first order to discuss purchasing needs, repeat orders, and opportunities for additional products.",
      "industries-title": "Industries We Serve",
      "industries-subtitle": "Latin American products for international buyers.",
      "fresh-produce-title": "Fresh Produce",
      "fresh-produce-desc": "Premium LATAM fruits, vegetables, and specialty crops.",
      "processed-foods-title": "Processed Foods",
      "processed-foods-desc": "Authentic Latin American flavors and innovative food products.",
      "beverages-title": "Beverages",
      "beverages-desc": "Premium Latin American spirits, specialty coffees, and unique beverages.",
      "platform-title": "From Prospect to Repeat Business",
      "platform-subtitle": "Clearer offers, fewer unanswered questions, and consistent follow-up from the first conversation to the next order.",
      "deal-tracking-title": "Identify Opportunities",
      "deal-tracking-desc": "We review your products and sales priorities, research potential buyers, and start conversations about their purchasing needs.",
      "workspace-title": "Develop the Offer",
      "workspace-desc": "We clarify buyer requirements and work with you on a proposal covering products, pricing, quantities, and commercial terms.",
      "doc-hub-title": "Negotiate and Pursue the Order",
      "doc-hub-desc": "We address questions and objections, support negotiations, and follow up on the buying decision, with terms subject to your approval.",
      "payment-title": "Follow Up and Develop the Account",
      "payment-desc": "Keep momentum after the first order. We follow up on outstanding questions and future purchasing needs to help develop repeat business.",
      "connect-title": "Tell Us What You Sell—or What You Need to Source",
      "connect-subtitle": "Looking for buyers or searching for products? Share your offer or purchasing requirements, and we’ll discuss the next steps with you.",
      "name": "Your Name",
      "company": "Your Company",
      "email": "Your Email",
      "phone": "Your Phone Number",
      "message": "Your Message",
      "send": "Send Message",
      "faq-title": "Frequently Asked Questions",
      "faq-q1": "What support does DommioGlobal provide?",
      "faq-a1": "For suppliers, we prospect buyers, lead outreach, and follow up on proposals and negotiations. For buyers, we gather product information, clarify quotations, and follow up on questions so purchasing decisions are based on clearer information.",
      "faq-q2": "How do you identify commercial opportunities?",
      "faq-a2": "We review the supplier’s product offering and target markets, identify potential buyers, contact relevant businesses, and follow up on interest and quotation requests.",
      "faq-q3": "How do you keep commercial discussions moving?",
      "faq-a3": "We gather outstanding questions, follow up with the relevant parties, and clarify responses before passing them on. That means less time chasing separate replies and a clearer view of what still needs to be decided.",
      "faq-q4": "Which markets do you work with?",
      "faq-a4": "We help Latin American suppliers explore international opportunities. The markets considered depend on the product, buyer requirements, and the supplier’s ability to serve them.",
      "faq-q5": "How will I receive updates?",
      "faq-a5": "You receive updates on buyer responses, quotation status, and open questions, with clear next steps so you know where each opportunity stands.",
      "faq-q6": "What are your fees?",
      "faq-a6": "There are no upfront fees. Suppliers pay a commission when they receive payment from the buyer. The commission, scope of work, and payment conditions are agreed in writing before work begins. Buyers pay no separate sourcing fee."
    },
    "es": {
      "audience-label": "Soy",
      "audience-placeholder": "Seleccione comprador o proveedor",
      "audience-buyer": "Comprador",
      "audience-supplier": "Proveedor",
      "buyer-introduction": "Cuéntenos qué necesita comprar. DommioGlobal identifica proveedores latinoamericanos potenciales y gestiona la conversación comercial, desde consultas sobre productos y cotizaciones hasta negociaciones y seguimiento de pedidos.",
      "page-title": "DommioGlobal | Proveedores latinoamericanos y compradores internacionales",
      "commission-title": "Cobramos nuestra comisión cuando usted recibe el pago.",
      "commission-description": "No hay pagos por adelantado. Los proveedores pagan una comisión cuando reciben el pago del comprador. La comisión, el alcance del trabajo y las condiciones de pago se acuerdan por escrito antes de comenzar. Los compradores no pagan una tarifa adicional por la búsqueda de proveedores.",
      "footer-description": "Ayudamos a proveedores latinoamericanos y compradores internacionales a avanzar en sus negocios con ofertas claras y seguimiento constante.",
      "home": "Inicio",
      "about": "Nosotros",
      "services": "Servicios",
      "for-buyers": "Para Compradores",
      "for-suppliers": "Para Proveedores",
      "contact-us": "Contáctenos",
      "contact": "Contacto",
      "about-us": "Nosotros",
      "our-process": "Procesos",
      "industries-nav": "Sectores",
      "deal-tracking": "Gestión de Operaciones",
      "faq-nav": "FAQ",
      "hero-title": "Conectamos a proveedores latinoamericanos con compradores internacionales.",
      "hero-subtitle": "Su único punto de contacto para comprar y vender en el extranjero. Buscamos oportunidades de venta, aclaramos cotizaciones y damos seguimiento a las respuestas para que dedique menos tiempo a buscar contestaciones y más a tomar decisiones comerciales.",
      "discover-approach": "Hablemos de negocios",
      "data-driven-title": "Desde el primer contacto hasta las ventas recurrentes",
      "data-driven-description": "DommioGlobal ayuda a proveedores latinoamericanos a desarrollar negocios con compradores internacionales. Identificamos prospectos, lideramos el contacto comercial, desarrollamos propuestas y apoyamos las negociaciones, con seguimiento continuo para buscar pedidos y ventas recurrentes.",
      "tab-suppliers": "Para Proveedores",
      "tab-buyers": "Para Compradores",
      "market-intelligence-title": "Desarrollo de mercados",
      "market-intelligence-desc": "Analizamos su oferta de productos, precios y prioridades comerciales para enfocar los esfuerzos de venta en mercados y perfiles de compradores relevantes.",
      "buyer-prospecting-title": "Prospección de compradores",
      "buyer-prospecting-desc": "Investigamos compradores potenciales y evaluamos sus necesidades de producto, interés de compra y compatibilidad con su oferta.",
      "sales-outreach-title": "Contacto comercial directo",
      "sales-outreach-desc": "Contactamos a compradores potenciales, presentamos sus productos, atendemos consultas y damos seguimiento para desarrollar conversaciones de venta.",
      "documentation-title": "Propuestas comerciales",
      "documentation-desc": "Trabajamos con usted para desarrollar cotizaciones que comuniquen el valor de su producto, precios, cantidades y condiciones comerciales.",
      "negotiation-title": "Apoyo en negociación y cierre",
      "negotiation-desc": "Atendemos objeciones de compradores, apoyamos las negociaciones y damos seguimiento a las decisiones de compra, con condiciones comerciales sujetas a su aprobación.",
      "customer-success-title": "Desarrollo de cuentas",
      "customer-success-desc": "Dé continuidad a la primera venta. Mantenemos el contacto con compradores sobre recompras y productos adicionales para atender nuevas oportunidades después de la operación inicial.",
      "insightful-title": "Búsqueda de proveedores",
      "insightful-desc": "Identificamos proveedores latinoamericanos cuyos productos puedan ajustarse a sus requisitos y centralizamos la comunicación a través de DommioGlobal.",
      "vetting-title": "Información de productos y condiciones comerciales",
      "vetting-desc": "Recopilamos especificaciones disponibles, documentación proporcionada por los proveedores y detalles comerciales para su revisión.",
      "procurement-title": "Cotizaciones y ofertas",
      "procurement-desc": "Comprenda la oferta antes de decidir. Aclaramos precios, cantidades, plazos de entrega y condiciones de pago para que pueda evaluar las cotizaciones con menos dudas pendientes.",
      "coordination-title": "Requisitos de compra",
      "coordination-desc": "Trabajamos con usted para aclarar los requisitos del producto, empaque y entrega, y coordinamos las respuestas de los proveedores.",
      "logistics-title": "Apoyo en negociaciones",
      "logistics-desc": "Coordinamos las conversaciones sobre condiciones comerciales, recopilamos las respuestas de los proveedores y damos seguimiento a los puntos pendientes.",
      "ongoing-title": "Seguimiento de pedidos y recompras",
      "ongoing-desc": "Dedique menos tiempo a solicitar actualizaciones. Damos seguimiento a consultas sobre pedidos y necesidades de compra para que sepa qué está pendiente y cuál es el siguiente paso.",
      "beyond-brokerage": "SUS PRODUCTOS.",
      "intelligent-growth": "NUESTRO ENFOQUE EN VENTAS.",
      "strategic-partner": "SU ALIADO EN VENTAS INTERNACIONALES",
      "company-description": "Los prospectos relevantes, una oferta clara y el seguimiento constante ayudan a que las conversaciones comerciales avancen. DommioGlobal da seguimiento al interés de compradores, aclara requisitos y atiende propuestas y negociaciones para que usted se concentre en decidir y no en perseguir respuestas.",
      "request-info": "Hablemos de una oportunidad",
      "market-access-title": "Prospección dirigida",
      "market-access-desc": "Identificamos compradores potenciales cuyas necesidades de producto y requisitos de compra se ajusten a su oferta y enfocamos el contacto comercial en esas oportunidades.",
      "sales-execution-title": "Ejecución comercial activa",
      "sales-execution-desc": "Lideramos el contacto comercial, presentamos su oferta, atendemos consultas comerciales y damos seguimiento a propuestas y negociaciones para buscar el cierre.",
      "powered-growth-title": "Desarrollo de cuentas",
      "powered-growth-desc": "Mantenemos el contacto después del primer pedido para conversar sobre necesidades de compra, pedidos recurrentes y oportunidades para productos adicionales.",
      "industries-title": "Sectores que atendemos",
      "industries-subtitle": "Productos latinoamericanos para compradores internacionales.",
      "fresh-produce-title": "Productos Frescos",
      "fresh-produce-desc": "Frutas, verduras y cultivos especiales premium de Latinoamérica.",
      "processed-foods-title": "Alimentos Procesados",
      "processed-foods-desc": "Sabores auténticos latinoamericanos y productos alimenticios innovadores.",
      "beverages-title": "Bebidas",
      "beverages-desc": "Destilados premium latinoamericanos, cafés de especialidad y bebidas únicas.",
      "platform-title": "Del prospecto a las ventas recurrentes",
      "platform-subtitle": "Ofertas más claras, menos dudas pendientes y seguimiento constante desde la primera conversación hasta el siguiente pedido.",
      "deal-tracking-title": "Identificar oportunidades",
      "deal-tracking-desc": "Revisamos sus productos y prioridades de venta, investigamos compradores potenciales e iniciamos conversaciones sobre sus necesidades de compra.",
      "workspace-title": "Desarrollar la oferta",
      "workspace-desc": "Aclaramos los requisitos del comprador y trabajamos con usted en una propuesta que incluya productos, precios, cantidades y condiciones comerciales.",
      "doc-hub-title": "Negociar y buscar el cierre",
      "doc-hub-desc": "Atendemos consultas y objeciones, apoyamos las negociaciones y damos seguimiento a la decisión de compra, con condiciones sujetas a su aprobación.",
      "payment-title": "Dar seguimiento y desarrollar la cuenta",
      "payment-desc": "Mantenga el impulso después del primer pedido. Damos seguimiento a consultas pendientes y futuras necesidades de compra para ayudar a desarrollar ventas recurrentes.",
      "connect-title": "Cuéntenos qué vende o qué necesita comprar",
      "connect-subtitle": "¿Busca compradores o productos? Comparta su oferta o sus requisitos de compra y conversemos sobre los próximos pasos.",
      "name": "Nombre",
      "company": "Empresa",
      "email": "Correo Electrónico",
      "phone": "Teléfono",
      "message": "Mensaje",
      "send": "Enviar mensaje",
      "faq-title": "Preguntas Frecuentes",
      "faq-q1": "¿Qué apoyo ofrece DommioGlobal?",
      "faq-a1": "Para proveedores, buscamos compradores, lideramos el contacto comercial y damos seguimiento a propuestas y negociaciones. Para compradores, recopilamos información de productos, aclaramos cotizaciones y atendemos consultas para facilitar decisiones de compra con información más clara.",
      "faq-q2": "¿Cómo identifican oportunidades comerciales?",
      "faq-a2": "Revisamos la oferta de productos y los mercados objetivo del proveedor, identificamos compradores potenciales, contactamos a empresas relevantes y damos seguimiento al interés y a las solicitudes de cotización.",
      "faq-q3": "¿Cómo ayudan a que las conversaciones comerciales avancen?",
      "faq-a3": "Recopilamos consultas pendientes, damos seguimiento con las partes correspondientes y aclaramos las respuestas antes de compartirlas. Así usted dedica menos tiempo a buscar respuestas por separado y tiene mayor claridad sobre las decisiones pendientes.",
      "faq-q4": "¿Con qué mercados trabajan?",
      "faq-a4": "Ayudamos a proveedores latinoamericanos a explorar oportunidades internacionales. Los mercados que consideramos dependen del producto, los requisitos de los compradores y la capacidad del proveedor para atenderlos.",
      "faq-q5": "¿Cómo recibiré actualizaciones?",
      "faq-a5": "Recibe actualizaciones sobre respuestas de compradores, estado de cotizaciones y consultas pendientes, con próximos pasos claros para saber en qué etapa se encuentra cada oportunidad.",
      "faq-q6": "¿Cuáles son sus honorarios?",
      "faq-a6": "No hay pagos por adelantado. Los proveedores pagan una comisión cuando reciben el pago del comprador. La comisión, el alcance del trabajo y las condiciones de pago se acuerdan por escrito antes de comenzar. Los compradores no pagan una tarifa adicional por la búsqueda de proveedores."
    }
  };

  // Function to set the language
  function setLanguage(lang) {
    document.documentElement.lang = lang;

    // Save the selected language to localStorage
    localStorage.setItem('language', lang);
    
    // Update active state of language buttons
    document.querySelectorAll('.lang-option').forEach(option => {
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });
  }

  // Keep expanded answers sized to their translated content.
  function resizeExpandedAnswers() {
    document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(question => {
      const answer = question.closest('.faq-item').querySelector('.faq-answer');
      answer.style.maxHeight = 'none';
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  }

  // Initialize language switcher
  const savedLanguage = localStorage.getItem('language') || 'en';
  setLanguage(savedLanguage);
  
  // Add event listeners to language buttons
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      setLanguage(lang);
      resizeExpandedAnswers();
    });
  });

}); // End DOMContentLoaded
