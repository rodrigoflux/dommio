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

  // Language Switcher Functionality
  const translations = {
    "en": {
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
      "hero-title": "Your Bridge to Global Markets: LATAM Exports, Amplified",
      "hero-subtitle": "Connecting Latin America's finest producers with vetted global buyers through proven sales expertise, strategic market access, and dedicated relationship management.",
      "discover-approach": "Expand Your Global Reach",
      "data-driven-title": "Expert-Driven Export Success",
      "data-driven-description": "Dommio Global transforms how Latin American suppliers access global markets by combining deep market knowledge with proven sales expertise. We build profitable, sustainable export channels that create lasting partnerships and continuous growth—not just one-time transactions.",
      "tab-suppliers": "For Suppliers",
      "tab-buyers": "For Buyers",
      "market-intelligence-title": "Strategic Market Access",
      "market-intelligence-desc": "Access your most lucrative global market opportunities using our deep market knowledge and established buyer networks, eliminating guesswork from your export strategy.",
      "buyer-prospecting-title": "Expert Buyer Prospecting",
      "buyer-prospecting-desc": "Connect with pre-qualified international buyers actively seeking your products, reducing your sales cycle and increasing conversion rates through proven relationship-building.",
      "sales-outreach-title": "Strategic Sales Outreach",
      "sales-outreach-desc": "Maximize response rates and engagement through targeted communication strategies informed by cultural expertise and market knowledge.",
      "documentation-title": "Deal Structuring & Proposal Development",
      "documentation-desc": "Create compelling, professional proposals that win deals. We help structure offers, develop pricing strategies, and craft persuasive presentations that clearly communicate value and differentiate you from competitors.",
      "negotiation-title": "Expert Negotiation Support",
      "negotiation-desc": "Achieve optimal deal terms and stronger contracts through our market knowledge and cultural negotiation expertise, protecting your interests while building trust.",
      "customer-success-title": "Customer Success & Retention",
      "customer-success-desc": "Transform first orders into lasting partnerships through proactive relationship management, driving repeat business and creating predictable revenue streams.",
      "insightful-title": "Insightful LATAM Sourcing",
      "insightful-desc": "Access unique, high-quality Latin American products that stand out in your market, identified through advanced trend analysis and our vetted supplier network.",
      "vetting-title": "Rigorous Supplier Vetting",
      "vetting-desc": "Minimize supply chain risks with our comprehensive evaluation of supplier reliability, capacity, quality standards, and export readiness using proprietary assessment methodologies.",
      "procurement-title": "Efficient Procurement Facilitation",
      "procurement-desc": "Reduce procurement cycle times and administrative burden through our streamlined process management, informed by best practices and local market knowledge.",
      "coordination-title": "Quality Assurance Coordination",
      "coordination-desc": "Ensure product consistency and meet your specific quality requirements through coordinated standards implementation and verification across international boundaries.",
      "logistics-title": "Product Sampling & Verification",
      "logistics-desc": "Reduce purchase risk and build confidence through coordinated product sampling, quality verification, and pre-shipment testing. We facilitate proper sample logistics and coordinate with third-party testing facilities to ensure products meet your exact specifications before larger orders.",
      "ongoing-title": "Ongoing Success Management",
      "ongoing-desc": "Develop reliable, high-performing LATAM supply chain partnerships that continuously deliver value through our dedicated success management approach.",
      "beyond-brokerage": "BEYOND BROKERAGE,",
      "intelligent-growth": "INTELLIGENT GROWTH.",
      "strategic-partner": "YOUR STRATEGIC EXPORT PARTNER",
      "company-description": "At Dommio, we transform Latin American exports through the powerful combination of deep market knowledge, expert sales execution, and committed relationship management. Beyond simple connections, we architect sustainable, profitable global partnerships that deliver measurable results. Our proven approach enables smarter market entry strategies, stronger competitive positioning, and accelerated growth in diverse international markets.",
      "request-info": "Request More Info",
      "market-access-title": "STRATEGIC MARKET ACCESS",
      "market-access-desc": "Expand your reach into high-value global markets strategically selected to maximize your specific competitive advantages and diversify your export portfolio.",
      "sales-execution-title": "EXPERT SALES EXECUTION",
      "sales-execution-desc": "Accelerate your sales cycle and boost conversion rates through our proven engagement processes and established global buyer network.",
      "powered-growth-title": "EXPERT-POWERED GROWTH",
      "powered-growth-desc": "Make informed export decisions that consistently outperform industry averages through expert market analysis and proven relationship management.",
      "industries-title": "Industries We Empower",
      "industries-subtitle": "Connecting Latin American Excellence with Global Demand, Backed by Industry-Specific Intelligence",
      "fresh-produce-title": "Fresh Produce",
      "fresh-produce-desc": "Premium LATAM fruits, vegetables, and specialty crops for international markets.",
      "processed-foods-title": "Processed Foods",
      "processed-foods-desc": "Authentic Latin American flavors and innovative food products for global markets.",
      "beverages-title": "Beverages",
      "beverages-desc": "Premium Latin American spirits, specialty coffees, and unique beverages for international markets.",
      "tech-title": "Technology & Electronics",
      "tech-desc": "Latin American technology and electronics for global supply chains.",
      "industrial-title": "Industrial Materials",
      "industrial-desc": "High-quality Latin American materials and components for global manufacturing and construction.",
      "platform-title": "A process you can trust",
      "platform-subtitle": "Transform Your Export Operations with Expert Guidance, Complete Transparency, and Proven Results",
      "deal-tracking-title": "Real-Time Deal Tracking",
      "deal-tracking-desc": "Eliminate uncertainty with transparent monitoring of every deal milestone, enabling proactive issue resolution and creating accountability throughout the export process.",
      "workspace-title": "Collaborative Workspace",
      "workspace-desc": "Accelerate deal progress through streamlined communication and document sharing between all stakeholders, reducing delays and miscommunication risks.",
      "doc-hub-title": "Secure Document Hub",
      "doc-hub-desc": "Eliminate documentation headaches with centralized, secure storage and management of all export-related contracts, certifications, and trade documents.",
      "payment-title": "Payment Coordination",
      "payment-desc": "Coordinate payment schedules and track progress to ensure smooth financial transactions throughout the export process.",
      "connect-title": "Connect With Dommio",
      "connect-subtitle": "Start your journey to intelligent, data-driven global growth with a personalized export or sourcing consultation.",
      "name": "Your Name",
      "company": "Your Company",
      "email": "Your Email",
      "phone": "Your Phone Number",
      "message": "Your Message",
      "send": "Send Message",
      "faq-title": "Frequently Asked Questions",
      "faq-q1": "How does Dommio use sales intelligence?",
      "faq-a1": "We transform export outcomes through our multi-layered intelligence approach: market analytics identify optimal opportunities, AI-powered tools qualify promising leads, competitive landscape analysis shapes positioning, personalized outreach strategies drive engagement, and performance tracking enables continuous optimization. This unified intelligence framework consistently delivers higher success rates and faster market penetration for our clients.",
      "faq-q2": "What does 'Customer Success' mean for Dommio?",
      "faq-a2": "Customer Success is our commitment to your long-term growth beyond the initial transaction. We actively manage buyer relationships, provide ongoing performance insights, facilitate strategic communication, and proactively identify expansion opportunities. This approach transforms single deals into lasting partnerships with predictable repeat business, ultimately building your sustainable global presence.",
      "faq-q3": "How is Dommio different from traditional export brokers?",
      "faq-a3": "Unlike traditional brokers who simply match buyers and sellers, Dommio provides an intelligence-powered strategic partnership focused on sustainable growth. We combine data-driven market insights, proactive sales facilitation, and dedicated customer success to create lasting partnerships. Our transparent approach with real-time visibility into the entire export process builds trust and accountability, consistently delivering higher success rates and long-term value.",
      "faq-q4": "Which global markets do you specialize in?",
      "faq-a4": "We help Latin American suppliers diversify and expand globally, with particular expertise in key regions across Europe, Asia, and the Middle East. While these regions represent significant growth opportunities, our approach is tailored to each client's specific products, competitive advantages, and strategic goals. We identify the optimal mix of established and emerging markets to build a resilient, diversified export portfolio.",
      "faq-q5": "How do you ensure transparency throughout the process?",
      "faq-a5": "Our structured approach delivers complete visibility by keeping both suppliers and buyers informed at every stage with regular progress updates, organized communication records, clear document tracking, transparent payment milestone coordination, and detailed performance reporting. This transparency eliminates uncertainty, enables proactive issue resolution, and builds the trust necessary for successful long-term partnerships throughout the export/import journey.",
      "faq-q6": "What are your fees?",
      "faq-a6": "We work on a commission basis, typically 5-10% of successful deals. This aligns our success with yours - we only get paid when you do. No upfront costs, no hidden fees. Our success is directly tied to your success."
    },
    "es": {
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
      "hero-title": "Su Puerta al Mundo: Potenciando las Exportaciones Latinoamericanas",
      "hero-subtitle": "Conectamos a los mejores productores de América Latina con compradores globales verificados a través de nuestra experiencia comercial, acceso estratégico a mercados y gestión dedicada de relaciones.",
      "discover-approach": "Impulse su Presencia Global",
      "data-driven-title": "Éxito Exportador Basado en Experiencia",
      "data-driven-description": "Dommio Global transforma cómo las empresas latinoamericanas acceden a mercados internacionales combinando conocimiento profundo de mercados con experiencia comercial comprobada. Desarrollamos canales de exportación rentables y sostenibles que generan alianzas duraderas y crecimiento continuo—no solo transacciones aisladas.",
      "tab-suppliers": "Para Exportadores",
      "tab-buyers": "Para Compradores",
      "market-intelligence-title": "Acceso Estratégico a Mercados",
      "market-intelligence-desc": "Accede a tus oportunidades más rentables en mercados globales utilizando nuestro conocimiento profundo de mercados y redes establecidas de compradores, eliminando la incertidumbre de tu estrategia de exportación.",
      "buyer-prospecting-title": "Prospección Experta de Compradores",
      "buyer-prospecting-desc": "Conectamos tu negocio con compradores internacionales precalificados que buscan activamente tus productos, acortando ciclos de venta y aumentando tasas de conversión mediante construcción probada de relaciones.",
      "sales-outreach-title": "Estrategias Estratégicas de Venta",
      "sales-outreach-desc": "Maximiza respuestas y genera mayor interés a través de comunicaciones estratégicas respaldadas por experiencia cultural y conocimiento de mercados.",
      "documentation-title": "Estructuración de Ofertas y Desarrollo de Propuestas",
      "documentation-desc": "Crea propuestas profesionales y convincentes que ganen contratos. Te ayudamos a estructurar ofertas, desarrollar estrategias de precios y crear presentaciones persuasivas que comunican claramente el valor y te diferencian de la competencia.",
      "negotiation-title": "Apoyo Experto en Negociaciones",
      "negotiation-desc": "Obtén términos comerciales óptimos y contratos más sólidos gracias a nuestro conocimiento profundo de mercados internacionales y experiencia en negociación multicultural, protegiendo tus intereses mientras construyes relaciones de confianza.",
      "customer-success-title": "Desarrollo y Retención de Clientes",
      "customer-success-desc": "Convertimos primeras órdenes en relaciones comerciales duraderas mediante gestión proactiva de clientes, generando negocios recurrentes y creando flujos de ingresos predecibles para tu empresa.",
      "insightful-title": "Sourcing Estratégico en Latinoamérica",
      "insightful-desc": "Accede a productos latinoamericanos únicos y de alta calidad que destacarán en tu mercado, identificados mediante análisis avanzado de tendencias y nuestra red verificada de proveedores.",
      "vetting-title": "Verificación Exhaustiva de Proveedores",
      "vetting-desc": "Minimiza riesgos en tu cadena de suministro con nuestra evaluación integral de confiabilidad, capacidad, calidad y preparación exportadora de proveedores, utilizando metodologías exclusivas de validación.",
      "procurement-title": "Facilitación Eficiente de Compras",
      "procurement-desc": "Reduce tiempos de adquisición y carga administrativa gracias a nuestra gestión optimizada de procesos, respaldada por mejores prácticas y conocimiento profundo de mercados locales.",
      "coordination-title": "Coordinación de Aseguramiento de Calidad",
      "coordination-desc": "Garantiza consistencia en tus productos y cumple con estándares específicos mediante implementación y verificación coordinada de normas de calidad a través de fronteras internacionales.",
      "logistics-title": "Muestreo y Verificación de Productos",
      "logistics-desc": "Reduce el riesgo de compra y genera confianza mediante muestreo coordinado de productos, verificación de calidad y pruebas previas al embarque. Facilitamos la logística apropiada de muestras y coordinamos con laboratorios especializados para asegurar que los productos cumplan exactamente con tus especificaciones antes de órdenes mayores.",
      "ongoing-title": "Gestión Continua del Éxito Comercial",
      "ongoing-desc": "Desarrolla relaciones comerciales latinoamericanas confiables y de alto rendimiento que generen valor continuamente mediante nuestro enfoque dedicado de gestión para el éxito sostenible.",
      "beyond-brokerage": "MÁS ALLÁ DE LA INTERMEDIACIÓN,",
      "intelligent-growth": "CRECIMIENTO INTELIGENTE.",
      "strategic-partner": "TU ALIADO ESTRATÉGICO PARA SU EXPANSIÓN GLOBAL",
      "company-description": "En Dommio transformamos las exportaciones latinoamericanas mediante la poderosa combinación de conocimiento profundo de mercados, ejecución comercial experta y gestión dedicada de relaciones. Más allá de simples conexiones, diseñamos alianzas globales rentables y sostenibles que entregan resultados medibles. Nuestro enfoque comprobado te permite desarrollar estrategias de entrada a mercados más inteligentes, posicionamiento competitivo superior y crecimiento acelerado en diversos mercados internacionales.",
      "request-info": "Solicitar Información",
      "market-access-title": "ACCESO ESTRATÉGICO A MERCADOS",
      "market-access-desc": "Expande tu alcance hacia mercados globales de alto valor, seleccionados estratégicamente para maximizar tus ventajas competitivas y diversificar tu portafolio de exportación.",
      "sales-execution-title": "EJECUCIÓN COMERCIAL EXPERTA",
      "sales-execution-desc": "Acelera tu ciclo de ventas y aumenta tus tasas de conversión mediante nuestros procesos probados y nuestra extensa red de compradores globales.",
      "powered-growth-title": "CRECIMIENTO IMPULSADO POR EXPERTOS",
      "powered-growth-desc": "Toma decisiones de exportación informadas que consistentemente superan los promedios de la industria mediante análisis experto de mercados y gestión comprobada de relaciones.",
      "industries-title": "Sectores que Impulsamos",
      "industries-subtitle": "Conectamos la Excelencia Latinoamericana con la Demanda Global, Respaldados por Inteligencia Específica para cada Industria",
      "fresh-produce-title": "Productos Frescos",
      "fresh-produce-desc": "Frutas, verduras y cultivos especiales premium de Latinoamérica para mercados internacionales.",
      "processed-foods-title": "Alimentos Procesados",
      "processed-foods-desc": "Sabores auténticos latinoamericanos y productos alimenticios innovadores para mercados globales.",
      "beverages-title": "Bebidas",
      "beverages-desc": "Destilados premium latinoamericanos, cafés de especialidad y bebidas únicas para mercados internacionales.",
      "tech-title": "Tecnología y Electrónica",
      "tech-desc": "Tecnología y electrónicos latinoamericanos para cadenas de suministro globales.",
      "industrial-title": "Materiales Industriales",
      "industrial-desc": "Materiales y componentes latinoamericanos de alta calidad para manufactura y construcción global.",
      "platform-title": "Un proceso en el que puedes confiar",
      "platform-subtitle": "Transforme sus Exportaciones con Orientación Experta, Transparencia Completa y Resultados Comprobados",
      "deal-tracking-title": "Seguimiento de Operaciones en Tiempo Real",
      "deal-tracking-desc": "Elimina la incertidumbre con monitoreo transparente de cada etapa de tus operaciones, permitiendo resolución proactiva de problemas y creando responsabilidad en todo el proceso exportador.",
      "workspace-title": "Espacio de Trabajo Colaborativo",
      "workspace-desc": "Acelera el progreso de tus negociaciones mediante comunicación simplificada y compartición segura de documentos entre todos los participantes, reduciendo retrasos y riesgos de malentendidos.",
      "doc-hub-title": "Centro Seguro de Documentación",
      "doc-hub-desc": "Elimina las complicaciones documentales con almacenamiento centralizado y gestión segura de todos tus contratos, certificaciones y documentos comerciales internacionales.",
      "payment-title": "Coordinación de Pagos",
      "payment-desc": "Coordina cronogramas de pago y realiza seguimiento del progreso para asegurar transacciones financieras fluidas durante todo el proceso de exportación.",
      "connect-title": "Conecte con Dommio",
      "connect-subtitle": "Inicia tu camino hacia un crecimiento global inteligente con una consultoría personalizada para tus exportaciones o abastecimiento internacional.",
      "name": "Nombre",
      "company": "Empresa",
      "email": "Correo Electrónico",
      "phone": "Teléfono",
      "message": "Mensaje",
      "send": "Enviar Mensaje",
      "faq-title": "Preguntas Frecuentes",
      "faq-q1": "¿Cómo utiliza Dommio la inteligencia comercial?",
      "faq-a1": "Transformamos los resultados de exportación mediante nuestro enfoque de inteligencia multicapa: análisis de mercado que identifica oportunidades óptimas, herramientas de IA que califican prospectos prometedores, análisis competitivo que perfila estrategias de posicionamiento, comunicación personalizada que genera compromiso, y seguimiento de desempeño que permite optimización continua. Este marco integrado de inteligencia comercial entrega consistentemente tasas de éxito superiores y penetración más rápida de mercados internacionales para nuestros clientes.",
      "faq-q2": "¿Qué significa 'Éxito del Cliente' para Dommio?",
      "faq-a2": "El Éxito del Cliente representa nuestro compromiso con tu crecimiento a largo plazo más allá de la transacción inicial. Gestionamos activamente relaciones con compradores, proporcionamos análisis continuo de desempeño, facilitamos comunicación estratégica e identificamos proactivamente oportunidades de expansión. Este enfoque transforma operaciones individuales en alianzas duraderas con negocios recurrentes predecibles, construyendo finalmente una presencia global sostenible para tu empresa.",
      "faq-q3": "¿En qué se diferencia Dommio de los intermediarios tradicionales?",
      "faq-a3": "A diferencia de intermediarios tradicionales que simplemente conectan compradores y vendedores, Dommio ofrece una alianza estratégica impulsada por inteligencia enfocada en crecimiento sostenible. Combinamos insights de mercado basados en datos, facilitación proactiva de ventas y gestión dedicada del éxito del cliente para crear relaciones comerciales duraderas. Nuestro enfoque transparente con visibilidad en tiempo real de todo el proceso exportador genera confianza y responsabilidad, entregando consistentemente mayores tasas de éxito y valor a largo plazo.",
      "faq-q4": "¿En qué mercados globales se especializa Dommio?",
      "faq-a4": "Ayudamos a empresas latinoamericanas a diversificarse y expandirse globalmente, con experiencia particular en regiones clave de Europa, Asia y Medio Oriente. Aunque estas regiones representan oportunidades significativas de crecimiento, nuestro enfoque está adaptado a los productos específicos, ventajas competitivas y objetivos estratégicos de cada cliente. Identificamos la combinación óptima de mercados establecidos y emergentes para construir un portafolio exportador resiliente y diversificado.",
      "faq-q5": "¿Cómo garantizan la transparencia durante todo el proceso?",
      "faq-a5": "Nuestro enfoque estructurado proporciona visibilidad completa manteniendo tanto a exportadores como a compradores informados en cada etapa con actualizaciones regulares de progreso, registros organizados de comunicación, seguimiento claro de documentos, coordinación transparente de hitos de pago y reportes detallados de desempeño. Esta transparencia elimina la incertidumbre, permite la resolución proactiva de problemas y construye la confianza necesaria para relaciones comerciales exitosas a largo plazo durante todo el proceso de exportación e importación.",
      "faq-q6": "¿Cuáles son sus honorarios?",
      "faq-a6": "Trabajamos por comisión, típicamente 5-10% de operaciones exitosas. Esto alinea nuestro éxito con el suyo - solo cobramos cuando usted cobra. Sin costos iniciales, sin honorarios ocultos. Nuestro éxito está directamente ligado a su éxito."
    }
  };

  // Function to set the language
  function setLanguage(lang) {
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

  // Initialize language switcher
  const savedLanguage = localStorage.getItem('language') || 'en';
  setLanguage(savedLanguage);
  
  // Add event listeners to language buttons
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

}); // End DOMContentLoaded