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
      "about": "Our Services",
      "services": "Services",
      "for-buyers": "For Buyers",
      "for-suppliers": "For Suppliers",
      "contact-us": "Contact Us",
      "contact": "Contact",
      "about-us": "Our Services",
      "our-process": "Our Process",
      "industries-nav": "Industries",
      "deal-tracking": "How We Work",
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
      "commission-suppliers-description": "Sin anticipos. Acordamos la comisión por escrito antes de comenzar y solo cobramos cuando usted recibe el pago del comprador.",
      "commission-buyers-title": "Para compradores",
      "commission-buyers-description": "No cobramos una tarifa adicional por buscar proveedores ni por gestionar el proceso comercial. Nuestra comisión la paga el proveedor.",
      "faq-logistics-question": "¿Quién se encarga de la logística?",
      "faq-logistics-answer": "El comprador y el proveedor acuerdan quién se encarga del transporte y la entrega. Nosotros nos enfocamos en la gestión comercial y mantenemos el contacto con ambas partes para dar seguimiento al pedido.",
      "audience-label": "Soy:",
      "audience-placeholder": "Seleccione comprador o proveedor",
      "audience-buyer": "Comprador",
      "audience-supplier": "Proveedor",
      "buyer-introduction": "Encontramos proveedores latinoamericanos que se ajusten a sus necesidades y gestionamos el proceso comercial: desde la búsqueda y la presentación de ofertas hasta la negociación, la confirmación del pedido y las próximas compras.",
      "page-title": "DommioGlobal | Proveedores latinoamericanos y compradores internacionales",
      "commission-title": "Un modelo claro para ambas partes",
      "footer-description": "Ayudamos a proveedores latinoamericanos y compradores internacionales a avanzar en sus negocios con ofertas claras y seguimiento constante.",
      "home": "Inicio",
      "about": "Nuestros servicios",
      "services": "Servicios",
      "for-buyers": "Para Compradores",
      "for-suppliers": "Para Proveedores",
      "contact-us": "Contáctenos",
      "contact": "Contacto",
      "about-us": "Nuestros servicios",
      "our-process": "Procesos",
      "industries-nav": "Sectores",
      "deal-tracking": "Así trabajamos",
      "faq-nav": "FAQ",
      "hero-title": "Su aliado en comercio internacional.",
      "hero-subtitle": "Conectamos a proveedores de América Latina con compradores internacionales y nos encargamos de la gestión comercial: buscamos oportunidades, presentamos ofertas, apoyamos la negociación y damos seguimiento hasta el cierre y los siguientes pedidos.",
      "discover-approach": "Hablemos de negocios",
      "data-driven-title": "Desde el primer contacto hasta las ventas recurrentes",
      "data-driven-description": "Ayudamos a proveedores latinoamericanos a encontrar clientes en el extranjero y desarrollar relaciones comerciales a largo plazo. Buscamos compradores, presentamos sus productos, preparamos propuestas y acompañamos las negociaciones hasta concretar pedidos. Después de la primera venta, seguimos trabajando para generar nuevas oportunidades.",
      "tab-suppliers": "Para proveedores",
      "tab-buyers": "Para compradores",
      "market-intelligence-title": "Desarrollo de mercados",
      "market-intelligence-desc": "Conocemos sus productos, precios y objetivos para identificar los mercados y tipos de compradores en los que conviene concentrar la búsqueda.",
      "buyer-prospecting-title": "Búsqueda de compradores",
      "buyer-prospecting-desc": "Identificamos compradores potenciales y evaluamos si sus necesidades, volúmenes e interés de compra se ajustan a lo que usted ofrece.",
      "sales-outreach-title": "Contacto comercial directo",
      "sales-outreach-desc": "Nos ponemos en contacto con los compradores, presentamos sus productos y damos seguimiento para despertar interés y avanzar hacia una propuesta.",
      "documentation-title": "Propuestas comerciales",
      "documentation-desc": "Preparamos con usted ofertas que destaquen el valor de sus productos y detallen precios, cantidades y condiciones de venta.",
      "negotiation-title": "Negociación y cierre",
      "negotiation-desc": "Atendemos preguntas y objeciones, apoyamos la negociación y damos seguimiento hasta concretar el pedido. Usted aprueba los precios y las condiciones de cada operación.",
      "customer-success-title": "Seguimiento y nuevas ventas",
      "customer-success-desc": "La relación continúa después del primer pedido. Mantenemos el contacto con sus clientes para conocer sus próximas necesidades, ofrecer otros productos e impulsar nuevas compras.",
      "insightful-title": "Búsqueda de proveedores",
      "insightful-desc": "Buscamos proveedores que puedan ofrecer los productos, cantidades y condiciones que necesita.",
      "vetting-title": "Información sobre productos",
      "vetting-desc": "Reunimos especificaciones, fichas técnicas y documentación de los proveedores para que tenga la información necesaria antes de comprar.",
      "procurement-title": "Cotizaciones y ofertas",
      "procurement-desc": "Solicitamos ofertas de acuerdo con sus requisitos y revisamos con usted los precios, las cantidades, los plazos de entrega y las condiciones de pago.",
      "coordination-title": "Requisitos de compra",
      "coordination-desc": "Comunicamos a los proveedores sus necesidades de producto, empaque y entrega, y damos seguimiento para que sus propuestas respondan a lo que busca.",
      "logistics-title": "Apoyo en la negociación",
      "logistics-desc": "Le acompañamos en la negociación de precios y condiciones comerciales, presentamos sus solicitudes a los proveedores y buscamos acuerdos que funcionen para ambas partes.",
      "ongoing-title": "Seguimiento de pedidos y próximas compras",
      "ongoing-desc": "Mantenemos la comunicación después del cierre, damos seguimiento a sus pedidos y le ayudamos a preparar sus próximas compras.",
      "beyond-brokerage": "Nuevos socios comerciales.",
      "intelligent-growth": "Relaciones duraderas.",
      "strategic-partner": "SU ALIADO PARA COMPRAR Y VENDER EN EL EXTRANJERO",
      "company-description": "Encontrar al socio adecuado es el primer paso. Acercamos a compradores y proveedores con necesidades e intereses compatibles y gestionamos el proceso comercial para que puedan llegar a acuerdos, concretar pedidos y seguir haciendo negocios.",
      "request-info": "Contáctenos",
      "market-access-title": "Compradores y proveedores para su negocio",
      "market-access-desc": "Buscamos clientes para sus productos o proveedores que puedan abastecer lo que necesita.",
      "sales-execution-title": "Gestión comercial de principio a fin",
      "sales-execution-desc": "Nos encargamos del contacto inicial, las ofertas y el seguimiento de la negociación hasta que ambas partes acuerden el pedido.",
      "powered-growth-title": "Seguimos después del cierre",
      "powered-growth-desc": "Mantenemos la comunicación para dar seguimiento a los pedidos, atender nuevas necesidades y facilitar las próximas operaciones.",
      "industries-title": "Sectores que atendemos",
      "industries-subtitle": "Productos de América Latina para mercados internacionales.",
      "fresh-produce-title": "Productos frescos",
      "fresh-produce-desc": "Frutas, verduras y otros productos agrícolas de origen latinoamericano.",
      "processed-foods-title": "Alimentos procesados",
      "processed-foods-desc": "Alimentos envasados, especialidades regionales y productos con valor agregado.",
      "beverages-title": "Bebidas",
      "beverages-desc": "Destilados, cafés de especialidad y otras bebidas de América Latina.",
      "platform-title": "Así trabajamos",
      "deal-tracking-title": "Conocemos lo que necesita",
      "deal-tracking-desc": "Cuéntenos qué vende o qué busca comprar, en qué cantidades y bajo qué condiciones.",
      "workspace-title": "Encontramos opciones para su negocio",
      "workspace-desc": "Buscamos compradores o proveedores que se ajusten a sus necesidades e iniciamos el contacto.",
      "doc-hub-title": "Llevamos la negociación hasta el pedido",
      "doc-hub-desc": "Coordinamos las propuestas, apoyamos la negociación de precios y condiciones y damos seguimiento hasta que comprador y proveedor confirmen el pedido.",
      "payment-title": "Trabajamos en la siguiente oportunidad",
      "payment-desc": "Seguimos en contacto después del cierre para atender consultas sobre el pedido y conocer las próximas necesidades de ambas partes.",
      "connect-title": "Cuéntenos qué vende o qué necesita comprar",
      "connect-subtitle": "Comparta sus productos o requisitos de compra y conversemos sobre cómo podemos ayudarle a encontrar nuevos clientes o proveedores.",
      "name": "Nombre",
      "company": "Empresa",
      "email": "Correo electrónico",
      "phone": "Teléfono",
      "message": "Mensaje",
      "send": "Enviar mensaje",
      "faq-title": "Preguntas frecuentes",
      "faq-q1": "¿Qué hace DommioGlobal?",
      "faq-a1": "Conectamos a proveedores de América Latina con compradores internacionales y gestionamos el proceso comercial, desde la búsqueda y el primer contacto hasta las ofertas, la negociación, el cierre y el seguimiento de futuras compras.",
      "faq-q2": "Soy proveedor. ¿Qué necesitan para empezar?",
      "faq-a2": "Necesitamos conocer sus productos, especificaciones, capacidad de suministro, pedidos mínimos, precios de referencia y condiciones de venta. Con esa información, definimos juntos qué compradores y mercados buscar.",
      "faq-q3": "Soy comprador. ¿Pueden encontrar un producto con requisitos específicos?",
      "faq-a3": "Sí. Cuéntenos qué producto necesita, en qué cantidad, con qué presentación o empaque, para qué destino y en qué plazo. Buscamos proveedores que puedan atender su solicitud y le presentamos opciones y ofertas para que las evalúe.",
      "faq-q4": "¿Con qué mercados trabajan?",
      "faq-a4": "Conectamos a proveedores de América Latina con compradores de distintos mercados internacionales. Las oportunidades que exploramos dependen del producto, los requisitos del comprador y la capacidad del proveedor para atenderlos.",
      "faq-q5": "¿Cómo me mantendrán informado?",
      "faq-a5": "Le compartimos los contactos realizados, las respuestas recibidas, las propuestas enviadas y el avance de las negociaciones. También le indicamos los siguientes pasos y le avisamos cuando necesitamos información o una decisión de su parte.",
      "faq-q6": "¿Cómo cobran sus servicios?",
      "faq-a6": "Trabajamos sin anticipos. Acordamos la comisión con el proveedor por escrito antes de comenzar y la cobramos cuando este recibe el pago del comprador. Los compradores no pagan una tarifa adicional por nuestros servicios de búsqueda y gestión comercial."
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
