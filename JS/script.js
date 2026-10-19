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
      "commission-suppliers-title": "For Suppliers",
      "commission-suppliers-description": "No upfront fees. The commission is agreed in writing before work begins and is payable when you receive payment from the buyer.",
      "commission-buyers-title": "For Buyers",
      "commission-buyers-description": "No additional fee for supplier sourcing and commercial management. Our commission is paid by the supplier.",
      "audience-label": "I am a",
      "audience-placeholder": "Select buyer or supplier",
      "audience-buyer": "Buyer",
      "audience-supplier": "Supplier",
      "buyer-introduction": "We help you find Latin American suppliers that match your requirements and manage the commercial process—from supplier search and offers to negotiations, order confirmation, and repeat purchases.",
      "page-title": "DommioGlobal | Latin American Suppliers & International Buyers",
      "commission-title": "A Clear Model for Both Sides",
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
      "hero-title": "Your partner in international trade.",
      "hero-subtitle": "We connect Latin American suppliers with international buyers and manage the commercial process—from finding the right partners to proposals, negotiations, closing, and repeat orders.",
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
      "beyond-brokerage": "New Business Partners.",
      "intelligent-growth": "Lasting Relationships.",
      "strategic-partner": "YOUR PARTNER FOR BUYING AND SELLING INTERNATIONALLY",
      "company-description": "Finding the right partner is just the beginning. DommioGlobal matches buyer requirements with supplier offerings and manages the commercial process to help both sides complete transactions and build lasting relationships.",
      "request-info": "Discuss an Opportunity",
      "market-access-title": "Search Based on Your Needs",
      "market-access-desc": "We find buyers for your products or suppliers who can meet your purchasing requirements.",
      "sales-execution-title": "Commercial Management from Start to Finish",
      "sales-execution-desc": "We handle initial outreach, coordinate offers, support negotiations, and follow up through closing.",
      "powered-growth-title": "Support Beyond the First Order",
      "powered-growth-desc": "We stay in touch to follow up on the transaction, address new requirements, and help prepare future orders.",
      "industries-title": "Industries We Serve",
      "industries-subtitle": "Latin American products for international buyers.",
      "fresh-produce-title": "Fresh Produce",
      "fresh-produce-desc": "Premium LATAM fruits, vegetables, and specialty crops.",
      "processed-foods-title": "Processed Foods",
      "processed-foods-desc": "Authentic Latin American flavors and innovative food products.",
      "beverages-title": "Beverages",
      "beverages-desc": "Premium Latin American spirits, specialty coffees, and unique beverages.",
      "platform-title": "How We Work",
      "deal-tracking-title": "We Understand Your Business",
      "deal-tracking-desc": "Tell us what you sell or need to source, including volumes, requirements, and commercial goals.",
      "workspace-title": "We Find the Right Partner",
      "workspace-desc": "We identify potential buyers or suppliers who may be a suitable match and make the first contact.",
      "doc-hub-title": "We Manage the Commercial Process",
      "doc-hub-desc": "We coordinate proposals, support negotiations on pricing and terms, and follow up until both parties confirm the order.",
      "payment-title": "We Keep the Relationship Moving",
      "payment-desc": "We stay in touch after closing to address questions about the transaction and help prepare future purchases and sales.",
      "connect-title": "Tell Us What You Sell—or What You Need to Source",
      "connect-subtitle": "Looking for buyers or searching for products? Share your offer or purchasing requirements, and we’ll discuss the next steps with you.",
      "name": "Your Name",
      "company": "Your Company",
      "email": "Your Email",
      "phone": "Your Phone Number",
      "message": "Your Message",
      "send": "Send Message",
      "faq-title": "Frequently Asked Questions",
      "faq-q1": "What does DommioGlobal do?",
      "faq-a1": "We connect Latin American suppliers with international buyers and manage the commercial process: partner searches, initial outreach, proposals, negotiation support, and order follow-up.",
      "faq-q2": "I’m a supplier. What do you need to start finding buyers?",
      "faq-a2": "Information about your products, specifications, supply capacity, minimum order quantities, indicative pricing, and commercial terms. We use this information to agree on the buyer profiles and markets to explore.",
      "faq-q3": "I’m a buyer. Can you source a product with specific requirements?",
      "faq-a3": "Yes. Share your specifications, quantities, packaging requirements, destination, and timelines. We look for suppliers who may meet those requirements and coordinate information and offers for your review.",
      "faq-logistics-question": "Who handles logistics?",
      "faq-logistics-answer": "The supplier and buyer agree on transport and delivery responsibilities. Our work focuses on managing the commercial process, maintaining the communication needed to follow up on the transaction.",
      "faq-q4": "Which markets do you work with?",
      "faq-a4": "We help Latin American suppliers explore international opportunities. The markets considered depend on the product, buyer requirements, and the supplier’s ability to serve them.",
      "faq-q5": "How will I receive updates?",
      "faq-a5": "You receive updates on buyer or supplier responses, quotation status, and open questions, with clear next steps so you know where each opportunity stands.",
      "faq-q6": "How do you charge for your services?",
      "faq-a6": "There are no upfront fees. The supplier’s commission is agreed in writing before work begins and is payable upon receiving payment from the buyer. Buyers pay no additional fee for supplier sourcing and commercial management."
    },
    "es": {
      "commission-suppliers-title": "Para proveedores",
      "commission-suppliers-description": "Sin anticipos. La comisión se acuerda por escrito antes de comenzar y se paga cuando usted recibe el pago del comprador.",
      "commission-buyers-title": "Para compradores",
      "commission-buyers-description": "Sin tarifa adicional por la búsqueda de proveedores y la gestión comercial. Nuestra comisión la paga el proveedor.",
      "faq-logistics-question": "¿Quién se encarga de la logística?",
      "faq-logistics-answer": "El proveedor y el comprador acuerdan las responsabilidades de transporte y entrega. Nuestro trabajo se centra en la gestión comercial, manteniendo la comunicación necesaria para dar seguimiento a la operación.",
      "audience-label": "Soy:",
      "audience-placeholder": "Seleccione comprador o proveedor",
      "audience-buyer": "Comprador",
      "audience-supplier": "Proveedor",
      "buyer-introduction": "Le ayudamos a encontrar proveedores latinoamericanos que se ajusten a sus requisitos y gestionamos el proceso comercial: desde la búsqueda de proveedores y la presentación de ofertas hasta la negociación, la confirmación de pedidos y las compras recurrentes.",
      "page-title": "DommioGlobal | Proveedores latinoamericanos y compradores internacionales",
      "commission-title": "Un modelo claro para ambas partes",
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
      "hero-title": "Su aliado en comercio internacional.",
      "hero-subtitle": "Conectamos a proveedores de América Latina con compradores internacionales y gestionamos el proceso comercial completo: desde la búsqueda de socios comerciales hasta la presentación de ofertas, la negociación, el cierre y los pedidos recurrentes.",
      "discover-approach": "Hablemos de negocios",
      "data-driven-title": "Desde el primer contacto hasta las ventas recurrentes",
      "data-driven-description": "DommioGlobal ayuda a proveedores latinoamericanos a desarrollar negocios con compradores internacionales. Identificamos prospectos, lideramos el contacto comercial, desarrollamos propuestas y apoyamos las negociaciones, con seguimiento continuo para buscar pedidos y ventas recurrentes.",
      "tab-suppliers": "Para proveedores",
      "tab-buyers": "Para compradores",
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
      "insightful-desc": "Buscamos proveedores latinoamericanos que puedan ofrecer los productos, volúmenes y condiciones que necesita.",
      "vetting-title": "Información sobre productos",
      "vetting-desc": "Reunimos las especificaciones, fichas técnicas y documentación de los proveedores para que cuente con la información necesaria antes de comprar.",
      "procurement-title": "Cotizaciones y ofertas",
      "procurement-desc": "Coordinamos ofertas de los proveedores y revisamos con usted los precios, las cantidades, los plazos de entrega y las condiciones de pago.",
      "coordination-title": "Requisitos de compra",
      "coordination-desc": "Comunicamos a los proveedores sus requisitos de producto, empaque y entrega, y damos seguimiento para que las propuestas respondan a lo que necesita.",
      "logistics-title": "Apoyo en la negociación",
      "logistics-desc": "Le acompañamos en la negociación de precios y condiciones comerciales, presentamos sus solicitudes a los proveedores y buscamos acuerdos que funcionen para ambas partes.",
      "ongoing-title": "Seguimiento de pedidos y próximas compras",
      "ongoing-desc": "Mantenemos la comunicación después del cierre, damos seguimiento a sus pedidos y le ayudamos a preparar sus próximas compras.",
      "beyond-brokerage": "Nuevos socios comerciales.",
      "intelligent-growth": "Relaciones duraderas.",
      "strategic-partner": "SU ALIADO PARA COMPRAR Y VENDER EN EL EXTRANJERO",
      "company-description": "Encontrar al socio adecuado es solo el comienzo. En DommioGlobal conectamos las necesidades del comprador con la oferta del proveedor y gestionamos el proceso comercial para concretar operaciones y construir relaciones a largo plazo.",
      "request-info": "Hablemos de una oportunidad",
      "market-access-title": "Búsqueda según sus necesidades",
      "market-access-desc": "Buscamos compradores para sus productos o proveedores que respondan a sus requisitos de compra.",
      "sales-execution-title": "Gestión comercial de principio a fin",
      "sales-execution-desc": "Nos encargamos del contacto inicial, la presentación de ofertas, el apoyo en la negociación y el seguimiento hasta el cierre.",
      "powered-growth-title": "Continuidad después del primer pedido",
      "powered-growth-desc": "Mantenemos la comunicación para dar seguimiento a la operación, atender nuevas necesidades y facilitar los próximos pedidos.",
      "industries-title": "Sectores que atendemos",
      "industries-subtitle": "Conectamos la oferta latinoamericana con compradores de todo el mundo.",
      "fresh-produce-title": "Productos frescos",
      "fresh-produce-desc": "Frutas, verduras y otros productos agrícolas de América Latina.",
      "processed-foods-title": "Alimentos procesados",
      "processed-foods-desc": "Alimentos envasados, especialidades regionales y productos con valor agregado.",
      "beverages-title": "Bebidas",
      "beverages-desc": "Destilados, cafés de especialidad y otras bebidas de origen latinoamericano.",
      "platform-title": "Así trabajamos",
      "deal-tracking-title": "Conocemos su negocio",
      "deal-tracking-desc": "Cuéntenos qué vende o qué necesita comprar, sus volúmenes, requisitos y objetivos comerciales.",
      "workspace-title": "Buscamos al socio adecuado",
      "workspace-desc": "Identificamos compradores o proveedores que puedan encajar y establecemos el primer contacto.",
      "doc-hub-title": "Gestionamos la operación comercial",
      "doc-hub-desc": "Coordinamos propuestas, apoyamos la negociación de precios y condiciones y damos seguimiento hasta que ambas partes confirmen el pedido.",
      "payment-title": "Damos continuidad a la relación",
      "payment-desc": "Seguimos en contacto después del cierre para atender consultas sobre la operación y preparar futuras compras y ventas.",
      "connect-title": "Cuéntenos qué vende o qué necesita comprar",
      "connect-subtitle": "Si busca nuevos compradores o proveedores latinoamericanos, comparta con nosotros sus productos o requisitos de compra para conocer cómo podemos ayudarle.",
      "name": "Nombre",
      "company": "Empresa",
      "email": "Correo electrónico",
      "phone": "Teléfono",
      "message": "Mensaje",
      "send": "Enviar mensaje",
      "faq-title": "Preguntas frecuentes",
      "faq-q1": "¿Qué hace DommioGlobal?",
      "faq-a1": "Conectamos a proveedores de América Latina con compradores internacionales y gestionamos el proceso comercial: búsqueda de socios, contacto inicial, propuestas, apoyo en negociaciones y seguimiento de pedidos.",
      "faq-q2": "Soy proveedor. ¿Qué necesitan para empezar a buscar compradores?",
      "faq-a2": "Información sobre sus productos, especificaciones, capacidad de suministro, cantidades mínimas, precios de referencia y condiciones comerciales. Con esta información, definimos con usted el perfil de comprador y los mercados que conviene explorar.",
      "faq-q3": "Soy comprador. ¿Pueden buscar un producto con requisitos específicos?",
      "faq-a3": "Sí. Comparta las especificaciones, cantidades, requisitos de empaque, destino y plazos que necesita. Buscamos proveedores que puedan ajustarse a esos requisitos y coordinamos la información y las ofertas para su evaluación.",
      "faq-q4": "¿Con qué mercados trabajan?",
      "faq-a4": "Buscamos oportunidades para proveedores latinoamericanos en mercados internacionales. La selección depende del producto, los requisitos del comprador y la capacidad del proveedor para abastecer ese mercado.",
      "faq-q5": "¿Cómo me mantendrán informado?",
      "faq-a5": "Le compartimos los avances de cada oportunidad: contactos realizados, respuestas de compradores o proveedores, propuestas enviadas, negociaciones en curso y próximos pasos. También le avisamos cuando necesitamos información o una decisión de su parte.",
      "faq-q6": "¿Cómo cobran sus servicios?",
      "faq-a6": "No solicitamos anticipos. La comisión del proveedor se acuerda por escrito antes de comenzar y se paga cuando recibe el pago del comprador. Los compradores no pagan una tarifa adicional por la búsqueda de proveedores y la gestión comercial."
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
