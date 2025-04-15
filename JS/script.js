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
      "hero-title": "Your Bridge to Global Markets: LATAM Exports, Amplified",
      "hero-subtitle": "Connecting Latin America's finest producers with vetted global buyers through data-driven market intelligence, expert sales facilitation, and dedicated partnership success strategies.",
      "discover-approach": "Expand Your Global Reach",
      "data-driven-title": "Intelligence-Powered Export Success",
      "data-driven-description": "Dommio International transforms how Latin American suppliers access global markets by combining proprietary market intelligence with proven sales expertise. We build profitable, sustainable export channels that create lasting partnerships and continuous growth—not just one-time transactions.",
      "tab-suppliers": "For Suppliers",
      "tab-buyers": "For Buyers",
      "market-intelligence-title": "Targeted Market Intelligence",
      "market-intelligence-desc": "Pinpoint your most lucrative global market opportunities using our proprietary data analysis and predictive insights, eliminating guesswork from your export strategy.",
      "buyer-prospecting-title": "AI-Powered Buyer Prospecting",
      "buyer-prospecting-desc": "Connect with pre-qualified international buyers actively seeking your products, reducing your sales cycle and increasing conversion rates through data-driven matching.",
      "sales-outreach-title": "Intelligence-Led Sales Outreach",
      "sales-outreach-desc": "Maximize response rates and engagement through targeted communication strategies informed by market intelligence and buyer behavior analysis.",
      "documentation-title": "Export Documentation Support",
      "documentation-desc": "Eliminate compliance barriers and accelerate market entry with expert guidance through complex certifications and international trade documentation.",
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
      "logistics-title": "Logistics & Compliance Liaison",
      "logistics-desc": "Navigate cross-border logistics and regulatory requirements seamlessly with our trusted partner network and specialized import compliance expertise.",
      "ongoing-title": "Ongoing Success Management",
      "ongoing-desc": "Develop reliable, high-performing LATAM supply chain partnerships that continuously deliver value through our dedicated success management approach.",
      "beyond-brokerage": "BEYOND BROKERAGE,",
      "intelligent-growth": "INTELLIGENT GROWTH.",
      "strategic-partner": "YOUR STRATEGIC EXPORT PARTNER",
      "company-description": "At Dommio, we transform Latin American exports through the powerful combination of deep market intelligence, expert sales execution, and committed customer success. Beyond simple connections, we architect sustainable, profitable global partnerships that deliver measurable results. Our data-driven approach enables smarter market entry strategies, stronger competitive positioning, and accelerated growth in diverse international markets.",
      "request-info": "Request More Info",
      "market-access-title": "STRATEGIC MARKET ACCESS",
      "market-access-desc": "Expand your reach into high-value global markets strategically selected to maximize your specific competitive advantages and diversify your export portfolio.",
      "sales-execution-title": "EXPERT SALES EXECUTION",
      "sales-execution-desc": "Accelerate your sales cycle and boost conversion rates through our proven engagement processes and established global buyer network.",
      "powered-growth-title": "INTELLIGENCE-POWERED GROWTH",
      "powered-growth-desc": "Make data-driven export decisions that consistently outperform industry averages through AI-enhanced market analysis and performance optimization.",
      "industries-title": "Industries We Empower",
      "industries-subtitle": "Connecting Latin American Excellence with Global Demand, Backed by Industry-Specific Intelligence",
      "fresh-produce-title": "Fresh Produce",
      "fresh-produce-desc": "Bringing premium LATAM fruits, vegetables, and specialty crops to international markets with logistics expertise that preserves quality and extends shelf life.",
      "processed-foods-title": "Processed Foods",
      "processed-foods-desc": "Introducing global consumers to authentic Latin American flavors and innovative food products through strategic market positioning and cultural storytelling.",
      "beverages-title": "Beverages",
      "beverages-desc": "Expanding market share for premium Latin American spirits, specialty coffees, and unique beverages through targeted channel development and positioning strategies.",
      "tech-title": "Technology & Electronics",
      "tech-desc": "Positioning Latin America's innovative tech manufacturing capabilities to capture growing market share in global technology supply chains and emerge as a trusted source.",
      "industrial-title": "Industrial Materials",
      "industrial-desc": "Integrating high-quality Latin American materials and components into global manufacturing and construction supply chains through qualification and certification support.",
      "platform-title": "Intelligent Deal Management",
      "platform-subtitle": "Transform Your Export Operations with Data-Driven Visibility, Collaboration, and Actionable Insights",
      "deal-tracking-title": "Real-Time Deal Tracking",
      "deal-tracking-desc": "Eliminate uncertainty with transparent monitoring of every deal milestone, enabling proactive issue resolution and creating accountability throughout the export process.",
      "workspace-title": "Collaborative Workspace",
      "workspace-desc": "Accelerate deal progress through streamlined communication and document sharing between all stakeholders, reducing delays and miscommunication risks.",
      "dashboard-title": "Actionable Intelligence Dashboard",
      "dashboard-desc": "Make informed strategic decisions based on performance analytics and market trend data, continuously optimizing your approach for sustainable growth.",
      "doc-hub-title": "Secure Document Hub",
      "doc-hub-desc": "Eliminate documentation headaches with centralized, secure storage and management of all export-related contracts, certifications, and trade documents.",
      "payment-title": "Milestone Payment Tracking",
      "payment-desc": "Enhance financial predictability and trust through transparent payment schedule tracking linked to verified shipment milestones and status updates.",
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
      "faq-q5": "How does your platform provide transparency?",
      "faq-a5": "Our intelligent deal management approach delivers unprecedented visibility by providing both suppliers and buyers with real-time access to deal progress, communication records, document status, payment milestones, and performance analytics. This transparency eliminates uncertainty, enables proactive issue resolution, and builds the trust necessary for successful long-term partnerships throughout the export/import journey."
    },
    "es": {
      "home": "Inicio",
      "about": "Nosotros",
      "services": "Servicios",
      "for-buyers": "Para Compradores",
      "for-suppliers": "Para Proveedores",
      "contact-us": "Contáctenos",
      "contact": "Contacto",
      "hero-title": "Su Puerta al Mundo: Potenciando las Exportaciones Latinoamericanas",
      "hero-subtitle": "Vinculamos a los productores más destacados de América Latina con compradores globales calificados mediante inteligencia de mercado basada en datos, facilitación estratégica de ventas y un compromiso continuo con el éxito de su negocio.",
      "discover-approach": "Impulse su Presencia Global",
      "data-driven-title": "Éxito Exportador Basado en Inteligencia de Datos",
      "data-driven-description": "Dommio International revoluciona el acceso de empresas latinoamericanas a mercados internacionales combinando inteligencia de mercado exclusiva con experiencia comercial comprobada. Desarrollamos canales de exportación rentables y sostenibles que generan alianzas duraderas y crecimiento continuo—no solo transacciones aisladas.",
      "tab-suppliers": "Para Exportadores",
      "tab-buyers": "Para Importadores",
      "market-intelligence-title": "Inteligencia de Mercado Estratégica",
      "market-intelligence-desc": "Identifique con precisión sus oportunidades más rentables en mercados globales utilizando nuestro análisis predictivo y datos exclusivos, eliminando la incertidumbre de su estrategia de exportación.",
      "buyer-prospecting-title": "Prospección de Compradores con IA",
      "buyer-prospecting-desc": "Conectamos su negocio con compradores internacionales precalificados que buscan activamente sus productos, acortando ciclos de venta y aumentando tasas de conversión mediante tecnología de emparejamiento inteligente.",
      "sales-outreach-title": "Estrategias de Venta con Inteligencia Aplicada",
      "sales-outreach-desc": "Maximice respuestas y genere mayor interés a través de comunicaciones estratégicas respaldadas por inteligencia de mercado y análisis avanzado del comportamiento de compradores.",
      "documentation-title": "Gestión Documental para Exportaciones",
      "documentation-desc": "Supere barreras regulatorias y acelere su entrada a nuevos mercados con nuestra asesoría especializada en certificaciones complejas y documentación de comercio internacional.",
      "negotiation-title": "Apoyo Experto en Negociaciones",
      "negotiation-desc": "Obtenga términos comerciales óptimos y contratos más sólidos gracias a nuestro conocimiento profundo de mercados internacionales y experticia en negociación multicultural, protegiendo sus intereses mientras construye relaciones de confianza.",
      "customer-success-title": "Desarrollo y Retención de Clientes",
      "customer-success-desc": "Convertimos primeras órdenes en relaciones comerciales duraderas mediante gestión proactiva de clientes, generando negocios recurrentes y creando flujos de ingresos predecibles para su empresa.",
      "insightful-title": "Sourcing Estratégico en Latinoamérica",
      "insightful-desc": "Acceda a productos latinoamericanos únicos y de alta calidad que destacarán en su mercado, identificados mediante análisis avanzado de tendencias y nuestra red verificada de proveedores.",
      "vetting-title": "Verificación Exhaustiva de Proveedores",
      "vetting-desc": "Minimice riesgos en su cadena de suministro con nuestra evaluación integral de confiabilidad, capacidad, calidad y preparación exportadora de proveedores, utilizando metodologías exclusivas de validación.",
      "procurement-title": "Facilitación Eficiente de Compras",
      "procurement-desc": "Reduzca tiempos de adquisición y carga administrativa gracias a nuestra gestión optimizada de procesos, respaldada por mejores prácticas y conocimiento profundo de mercados locales.",
      "coordination-title": "Coordinación de Aseguramiento de Calidad",
      "coordination-desc": "Garantice consistencia en sus productos y cumpla con estándares específicos mediante implementación y verificación coordinada de normas de calidad a través de fronteras internacionales.",
      "logistics-title": "Gestión Logística y Regulatoria",
      "logistics-desc": "Navigue sin contratiempos por la compleja logística internacional y requisitos regulatorios con nuestra red de socios confiables y experiencia especializada en cumplimiento normativo.",
      "ongoing-title": "Gestión Continua del Éxito Comercial",
      "ongoing-desc": "Desarrolle relaciones comerciales latinoamericanas confiables y de alto rendimiento que generen valor continuamente mediante nuestro enfoque dedicado de gestión para el éxito sostenible.",
      "beyond-brokerage": "MÁS ALLÁ DE LA INTERMEDIACIÓN,",
      "intelligent-growth": "CRECIMIENTO INTELIGENTE.",
      "strategic-partner": "SU ALIADO ESTRATÉGICO PARA LA EXPANSIÓN GLOBAL",
      "company-description": "En Dommio transformamos las exportaciones latinoamericanas mediante la poderosa combinación de inteligencia de mercado avanzada, ejecución comercial experta y compromiso con el éxito del cliente. Más allá de simples conexiones, diseñamos alianzas globales rentables y sostenibles que entregan resultados medibles. Nuestro enfoque basado en datos permite desarrollar estrategias de entrada a mercados más inteligentes, posicionamiento competitivo superior y crecimiento acelerado en diversos mercados internacionales.",
      "request-info": "Solicitar Información",
      "market-access-title": "ACCESO ESTRATÉGICO A MERCADOS",
      "market-access-desc": "Expanda su alcance hacia mercados globales de alto valor, seleccionados estratégicamente para maximizar sus ventajas competitivas y diversificar su portafolio de exportación.",
      "sales-execution-title": "EJECUCIÓN COMERCIAL EXPERTA",
      "sales-execution-desc": "Acelere su ciclo de ventas y aumente sus tasas de conversión mediante nuestros procesos probados y nuestra extensa red de compradores globales.",
      "powered-growth-title": "CRECIMIENTO IMPULSADO POR DATOS",
      "powered-growth-desc": "Tome decisiones de exportación respaldadas por datos que consistentemente superan los promedios de la industria mediante análisis de mercado potenciado por IA y optimización continua de resultados.",
      "industries-title": "Sectores que Impulsamos",
      "industries-subtitle": "Conectamos la Excelencia Latinoamericana con la Demanda Global, Respaldados por Inteligencia Específica para cada Industria",
      "fresh-produce-title": "Productos Frescos",
      "fresh-produce-desc": "Llevamos frutas, verduras y cultivos especiales premium de Latinoamérica a mercados internacionales con experticia logística que preserva la calidad y extiende la vida útil de los productos.",
      "processed-foods-title": "Alimentos Procesados",
      "processed-foods-desc": "Presentamos al mundo los auténticos sabores latinoamericanos y productos alimenticios innovadores mediante posicionamiento estratégico y una narrativa que resalta nuestro patrimonio cultural.",
      "beverages-title": "Bebidas",
      "beverages-desc": "Expandimos la presencia global de destilados premium latinoamericanos, cafés de especialidad y bebidas únicas mediante desarrollo estratégico de canales y posicionamiento diferenciado.",
      "tech-title": "Tecnología y Electrónica",
      "tech-desc": "Posicionamos las innovadoras capacidades tecnológicas de América Latina para capturar mayor participación en cadenas de suministro globales y consolidarnos como fuente confiable de productos tecnológicos.",
      "industrial-title": "Materiales Industriales",
      "industrial-desc": "Integramos materiales y componentes latinoamericanos de alta calidad en cadenas globales de manufactura y construcción mediante apoyo especializado en certificación y calificación.",
      "platform-title": "Gestión Inteligente de Operaciones",
      "platform-subtitle": "Transforme sus Exportaciones con Visibilidad Basada en Datos, Colaboración Efectiva y Análisis Accionable",
      "deal-tracking-title": "Seguimiento de Operaciones en Tiempo Real",
      "deal-tracking-desc": "Elimine la incertidumbre con monitoreo transparente de cada etapa de sus operaciones, permitiendo resolución proactiva de problemas y creando responsabilidad en todo el proceso exportador.",
      "workspace-title": "Espacio de Trabajo Colaborativo",
      "workspace-desc": "Acelere el progreso de sus negociaciones mediante comunicación simplificada y compartición segura de documentos entre todos los participantes, reduciendo retrasos y riesgos de malentendidos.",
      "dashboard-title": "Panel de Inteligencia Comercial",
      "dashboard-desc": "Tome decisiones estratégicas informadas basadas en análisis de desempeño y datos de tendencias de mercado, optimizando continuamente su enfoque para un crecimiento sostenible.",
      "doc-hub-title": "Centro Seguro de Documentación",
      "doc-hub-desc": "Elimine las complicaciones documentales con almacenamiento centralizado y gestión segura de todos sus contratos, certificaciones y documentos comerciales internacionales.",
      "payment-title": "Seguimiento de Pagos por Etapas",
      "payment-desc": "Mejore la previsibilidad financiera y genere confianza mediante el seguimiento transparente de cronogramas de pago vinculados a hitos de embarque verificados y actualizaciones de estado.",
      "connect-title": "Conecte con Dommio",
      "connect-subtitle": "Inicie su camino hacia un crecimiento global inteligente con una consultoría personalizada para sus exportaciones o abastecimiento internacional.",
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
      "faq-a2": "El Éxito del Cliente representa nuestro compromiso con su crecimiento a largo plazo más allá de la transacción inicial. Gestionamos activamente relaciones con compradores, proporcionamos análisis continuo de desempeño, facilitamos comunicación estratégica e identificamos proactivamente oportunidades de expansión. Este enfoque transforma operaciones individuales en alianzas duraderas con negocios recurrentes predecibles, construyendo finalmente una presencia global sostenible para su empresa.",
      "faq-q3": "¿En qué se diferencia Dommio de los intermediarios tradicionales?",
      "faq-a3": "A diferencia de intermediarios tradicionales que simplemente conectan compradores y vendedores, Dommio ofrece una alianza estratégica impulsada por inteligencia enfocada en crecimiento sostenible. Combinamos insights de mercado basados en datos, facilitación proactiva de ventas y gestión dedicada del éxito del cliente para crear relaciones comerciales duraderas. Nuestro enfoque transparente con visibilidad en tiempo real de todo el proceso exportador genera confianza y responsabilidad, entregando consistentemente mayores tasas de éxito y valor a largo plazo.",
      "faq-q4": "¿En qué mercados globales se especializa Dommio?",
      "faq-a4": "Ayudamos a empresas latinoamericanas a diversificarse y expandirse globalmente, con experiencia particular en regiones clave de Europa, Asia y Medio Oriente. Aunque estas regiones representan oportunidades significativas de crecimiento, nuestro enfoque está adaptado a los productos específicos, ventajas competitivas y objetivos estratégicos de cada cliente. Identificamos la combinación óptima de mercados establecidos y emergentes para construir un portafolio exportador resiliente y diversificado.",
      "faq-q5": "¿Cómo proporciona transparencia su plataforma?",
      "faq-a5": "Nuestro sistema de gestión inteligente de operaciones ofrece visibilidad sin precedentes al proporcionar tanto a exportadores como a compradores acceso en tiempo real al avance de negociaciones, registros de comunicación, estado de documentos, hitos de pago y análisis de desempeño. Esta transparencia elimina la incertidumbre, permite la resolución proactiva de problemas y construye la confianza necesaria para relaciones comerciales exitosas a largo plazo durante todo el proceso de exportación e importación."
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