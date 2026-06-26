/* ==========================================================================
   1. EXTERNAL LIBRARIES INITIALIZATION
   ========================================================================== */

// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 50,
      duration: 800,
      easing: 'ease-out-cubic',
    });
  }
});
/* ==========================================================================
   Initialize Swiper.js for Google Reviews
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const googleReviewSwiper = document.querySelector('.googleReviewSwiper');

  if (googleReviewSwiper && typeof Swiper !== 'undefined' && !googleReviewSwiper.swiper) {
    new Swiper(googleReviewSwiper, {
      loop: true,
      grabCursor: true,
      centeredSlides: false,
      watchSlidesProgress: true,
      spaceBetween: 28,
      speed: 4500,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.googleReviewSwiper .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.googleReviewSwiper .swiper-button-next',
        prevEl: '.googleReviewSwiper .swiper-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        },
        1600: {
          slidesPerView: 4,
        },
      },
    });
  }
});
  



/* ==========================================================================
   2. DARK/LIGHT THEME TOGGLE
   ========================================================================== */
const htmlElement = document.documentElement;
const darkToggleBtn = document.getElementById('darkToggle');

// Load stored theme or check system default
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
} else {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = systemPrefersDark ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);
}

// Toggle click handler
if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  if (!darkToggleBtn) return;
  const icon = darkToggleBtn.querySelector('i');
  if (!icon) return;
  
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

/* ==========================================================================
   3. HERO BACKGROUND CANVAS PARTICLES
   ========================================================================== */
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const colors = ['#7C3AED', '#A855F7', '#EC4899'];
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;

  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const maxParticles = width < 768 ? 40 : 85;
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Check if theme is dark to adjust line drawing alpha
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    const lineAlpha = isDark ? 0.08 : 0.04;

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();

      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          ctx.beginPath();
          ctx.strokeStyle = particlesArray[i].color;
          ctx.globalAlpha = lineAlpha * (1 - distance / 110);
          ctx.lineWidth = 0.8;
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
}

/* ==========================================================================
   4. STATISTICAL COUNTER ANIMATION ON SCROLL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter');
  
  const startCounting = (counter) => {
    const target = parseInt(counter.parentElement.getAttribute('data-target') || counter.getAttribute('data-target'), 10);
    const duration = 1800; // Total count duration in ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeVal = progress * (2 - progress);
      const currentVal = Math.floor(easeVal * target);
      
      counter.innerText = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toLocaleString() + (target !== 2015 && target !== 250 ? '+' : '');
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counts = entry.target.querySelectorAll('.counter');
        counts.forEach(count => startCounting(count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const statsStrip = document.querySelector('.stats-strip');
  const placementsStats = document.querySelector('.placement-stats-box');
  
  if (statsStrip) counterObserver.observe(statsStrip);
  if (placementsStats) counterObserver.observe(placementsStats);
});

/* ==========================================================================
   5. NAVIGATION HEADER & SCROLL SPY LOGIC
   ========================================================================== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Add background shadow class to nav
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll Spy: Highlight active anchor link
  let currentActive = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentActive = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active-link');
    }
  });
});

/* ==========================================================================
   6. MOBILE HAMBURGER MENU
   ========================================================================== */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close menu when clicking a link
  const menuLinks = navLinksContainer.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   7. COURSE SEARCH & CATEGORY FILTERING
   ========================================================================== */
const courseSearch = document.getElementById('courseSearch');
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

function filterCourses() {
  const query = courseSearch ? courseSearch.value.toLowerCase().trim() : '';
  const activeFilterBtn = document.querySelector('.filter-btn.active');
  const category = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

  courseCards.forEach(card => {
    const title = card.querySelector('h3').innerText.toLowerCase();
    const desc = card.querySelector('p').innerText.toLowerCase();
    const cardCategory = card.getAttribute('data-category');

    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesCategory = category === 'all' || cardCategory === category;

    if (matchesSearch && matchesCategory) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Attach Search event
if (courseSearch) {
  courseSearch.addEventListener('input', filterCourses);
}

// Attach Filter click events
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCourses();
  });
});

/* ==========================================================================
   8. FAQ ACCORDION HANDLER
   ========================================================================== */
const faqHeaders = document.querySelectorAll('.faq-header');

faqHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const faqItem = header.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle selected FAQ
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

/* ==========================================================================
   9. CLIENT-SIDE CONTACT FORM VALIDATION
   ========================================================================== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    
    // Select elements
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const messageInput = document.getElementById('userMessage');
    const statusBox = document.getElementById('formStatus');
    const successBox = document.getElementById('formSuccess');
    const errorBox = document.getElementById('formError');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : '';

    // Reset error spans
    document.querySelectorAll('.error-text').forEach(err => err.innerText = '');
    if (statusBox) statusBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';
    if (errorBox) errorBox.style.display = 'none';

    // Name Validation (At least 3 characters)
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      document.getElementById('nameError').innerText = 'Please enter a valid full name (minimum 3 characters)';
      isValid = false;
    }

    // Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      document.getElementById('emailError').innerText = 'Please enter a valid email address';
      isValid = false;
    }

    // Message validation (minimum 10 characters)
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      document.getElementById('messageError').innerText = 'Please share your details/goals (minimum 10 characters)';
      isValid = false;
    }

    if (!isValid) return;

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending your message... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';
      }
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json',
        },
      });
      const result = await response.json().catch(() => ({
        success: false,
        message: 'Unable to send your message right now.',
      }));

      if (response.status !== 200) {
        throw new Error(result.message || 'Message could not be sent.');
      }

      if (statusBox) statusBox.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      contactForm.reset();

      setTimeout(() => {
        if (successBox) successBox.style.display = 'none';
      }, 5000);
    } catch (error) {
      if (statusBox) statusBox.style.display = 'none';
      if (errorBox) {
        const messageSpan = errorBox.querySelector('span');
        if (messageSpan) messageSpan.innerText = error.message;
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}

/* ==========================================================================
   10. NEWSLETTER FORM HANDLER
   ========================================================================== */
const newsletterBtn = document.getElementById('newsletterBtn');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterSuccess = document.getElementById('newsletterSuccess');

if (newsletterBtn && newsletterEmail) {
  newsletterBtn.addEventListener('click', () => {
    const email = newsletterEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address for subscription.');
      return;
    }

    if (newsletterSuccess) {
      newsletterSuccess.style.display = 'block';
      newsletterEmail.value = '';

      setTimeout(() => {
        newsletterSuccess.style.display = 'none';
      }, 4000);
    }
  });
}

/* ==========================================================================
   11. RIPPLE CLICK BUTTON EFFECTS
   ========================================================================== */
const rippleButtons = document.querySelectorAll('.ripple');

rippleButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleSpan = document.createElement('span');
    rippleSpan.classList.add('ripple-elem');
    rippleSpan.style.left = `${x}px`;
    rippleSpan.style.top = `${y}px`;

    btn.appendChild(rippleSpan);

    setTimeout(() => {
      rippleSpan.remove();
    }, 6000);
  });
});

/* ==========================================================================
   12. SCROLL PROGRESS INDICATOR & FLOATING ACCESSORIES
   ========================================================================== */
const scrollProgressBar = document.getElementById('scrollProgress');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  // Update Progress Bar
  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }

  // Show/Hide Back to top button
  if (scrollTop > 500) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});


// Scroll to top action
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   GRAPESGENIX FAQ CHATBOT ENGINE
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. KNOWLEDGE BASE
     All company information stored as structured Q&A entries.
     Each entry has: keywords[], title (display), and answer (HTML string).
  ------------------------------------------------------------------ */
  const KB = [
    {
      id: 'about',
      keywords: ['about', 'grapesgenix', 'what is', 'company', 'who are', 'tell me about', 'founded', 'founded in', 'history', 'background', 'introduction'],
      title: 'About GrapesGenix',
      answer: `<strong>GrapesGenix Technical Solutions Pvt Ltd</strong> is a leading IT company based in Thrissur, Kerala, founded in <strong>2015</strong> by <strong>Gopikrishnan P G</strong> and <strong>Rangaraj T R</strong>.<br><br>
We specialize in advanced technological solutions in <strong>IT and ITES</strong> — offering software development, web & mobile solutions, IT training, internships, and AI-powered services.<br><br>
🏷️ <em>"Transforming Ideas Into Technology"</em>`
    },
    {
      id: 'founding',
      keywords: ['when', 'founded', 'started', 'established', 'begin', 'year', 'origin', 'inception', '2015', 'founder', 'who founded', 'gopikrishnan', 'rangaraj'],
      title: 'Founding of GrapesGenix',
      answer: `GrapesGenix was founded in <strong>2015</strong> by <strong>Gopikrishnan P G</strong> and <strong>Rangaraj T R</strong>, starting from a humble <strong>100 sq.ft workspace</strong> in Thrissur, Kerala.<br><br>
From that small beginning, the company has grown to a team of <strong>30+ developers</strong> and serves clients across multiple sectors.`
    },
    {
      id: 'services',
      keywords: ['services', 'offer', 'provide', 'do you', 'what do', 'solutions', 'capabilities', 'work', 'help with', 'specialize'],
      title: 'Our Services',
      answer: `We offer a comprehensive range of IT services:<ul>
<li>💻 <strong>Software Development</strong></li>
<li>🌐 <strong>Web Design &amp; Development</strong></li>
<li>📱 <strong>Mobile App Development</strong></li>
<li>🌍 <strong>Domain Registration &amp; Hosting</strong></li>
<li>🛠️ <strong>Technical Support</strong></li>
<li>🔍 <strong>Search Engine Optimization (SEO)</strong></li>
<li>🎓 <strong>Software Training</strong></li>
<li>📋 <strong>Maintenance Contracts</strong></li>
</ul>
We also offer <strong>Expert Team</strong>, <strong>Quality Service</strong>, and <strong>24/7 Support</strong>.`
    },
    {
      id: 'web',
      keywords: ['web', 'website', 'web development', 'web design', 'frontend', 'backend', 'html', 'php', 'wordpress', 'web app'],
      title: 'Web Development',
      answer: `Yes! <strong>Web Design &amp; Development</strong> is one of our core services.<br><br>
We build responsive, modern websites and web applications tailored to your business needs — from simple landing pages to complex enterprise portals.<br><br>
📞 Contact us at <strong>+91 97441 12113</strong> or <a href="mailto:mail@grapestechs.com">mail@grapestechs.com</a> to discuss your project.`
    },
    {
      id: 'mobile',
      keywords: ['mobile', 'app', 'android', 'ios', 'flutter', 'react native', 'application', 'smartphone', 'apk', 'mobile app'],
      title: 'Mobile App Development',
      answer: `Absolutely! <strong>Mobile App Development</strong> is a major service at GrapesGenix.<br><br>
We develop feature-rich <strong>Android &amp; iOS</strong> applications using modern frameworks. We entered mobile app development in <strong>2016</strong> and have since delivered multiple successful products like our <em>Bus Reservation App</em> and <em>Farmers App</em>.<br><br>
📞 Reach us at <strong>+91 97441 12113</strong> to start your app project.`
    },
    {
      id: 'internships',
      keywords: ['internship', 'intern', 'training', 'learn', 'student', 'join', 'program', 'placement', 'enroll', 'apply', 'career', 'fresher', 'graduate'],
      title: 'Internship Programs',
      answer: `GrapesGenix offers <strong>5 specialized internship tracks</strong>:<ul>
<li>🖥️ Software Development Internship</li>
<li>📱 Mobile App Development Internship</li>
<li>🔌 Hardware &amp; Networking Internship</li>
<li>🤖 AI &amp; ML Internship</li>
<li>🌐 IoT Internship</li>
</ul>
⏱️ <strong>Duration:</strong> 3 to 6 months<br><br>
To enroll, contact us at <a href="mailto:mail@grapestechs.com">mail@grapestechs.com</a> or call <strong>+91 97441 12113</strong>.`
    },
    {
      id: 'duration',
      keywords: ['duration', 'how long', 'months', 'period', 'time', 'length', 'weeks', 'schedule'],
      title: 'Internship Duration',
      answer: `Our internship programs are available for a flexible duration of <strong>3 to 6 months</strong>, depending on the track and your availability.<br><br>
All programs include hands-on real-world project exposure. Contact us to find the right fit!`
    },
    {
      id: 'ioc',
      keywords: ['industry on campus', 'ioc', 'industry', 'campus', 'college', 'academic', 'bridge', 'partnership', 'partnered', 'academic partner', 'campus program'],
      title: 'Industry on Campus (IoC)',
      answer: `<strong>Industry on Campus (IoC)</strong> is our flagship initiative that bridges the gap between <strong>academics and industry</strong> by providing students with real-world work exposure while still pursuing their studies.<br><br>
🏫 <strong>Partner Colleges:</strong><ul>
<li>Model Polytechnic College, Kalletumkara</li>
<li>Model Polytechnic College, Karunagappally</li>
<li>Women's Polytechnic College, Nedupuzha</li>
<li>Presentation College of Arts &amp; Science, Puthenvelikkara</li>
</ul>
We expanded IoC initiatives significantly in <strong>2025</strong>.`
    },
    {
      id: 'colleges',
      keywords: ['college', 'polytechnic', 'partner college', 'which college', 'kalletumkara', 'karunagappally', 'nedupuzha', 'puthenvelikkara', 'presentation', 'women'],
      title: 'Partner Colleges',
      answer: `Our <strong>Industry on Campus (IoC)</strong> program partners with:<ul>
<li>📚 Model Polytechnic College, <strong>Kalletumkara</strong></li>
<li>📚 Model Polytechnic College, <strong>Karunagappally</strong></li>
<li>📚 Women's Polytechnic College, <strong>Nedupuzha</strong></li>
<li>📚 Presentation College of Arts &amp; Science, <strong>Puthenvelikkara</strong></li>
</ul>
The program gives students real-world exposure while completing their academic programs.`
    },
    {
      id: 'products',
      keywords: ['product', 'products', 'app built', 'developed', 'solution', 'library', 'queue', 'hospital', 'farmer', 'bus', 'qr', 'plant', 'what have you built', 'portfolio'],
      title: 'Our Products & Solutions',
      answer: `We have built several impactful software products:<ul>
<li>📚 <strong>Library Management App</strong> — streamlines library operations</li>
<li>🏥 <strong>Queue Management System for Hospitals</strong> — reduces patient wait times</li>
<li>🌱 <strong>Farmers App for Plant Recognition</strong> — AI-powered crop assistance</li>
<li>🚌 <strong>Bus Reservation App with QR Integration</strong> — digital ticketing system</li>
</ul>
These reflect our expertise across healthcare, education, agriculture, and transport sectors.`
    },
    {
      id: 'contact',
      keywords: ['contact', 'reach', 'phone', 'email', 'address', 'location', 'call', 'whatsapp', 'mail', 'number', 'office', 'where are you', 'touch'],
      title: 'Contact GrapesGenix',
      answer: `You can reach us through any of these channels:<br><br>
📍 <strong>Address:</strong><br>Gate No 71, Parakkott Lane, Patturaikkal,<br>Thrissur – 680020, Kerala, India<br><br>
📧 <strong>Email:</strong><br>
<a href="mailto:mail@grapestechs.com">mail@grapestechs.com</a><br>
<a href="mailto:info@grapestechs.com">info@grapestechs.com</a><br><br>
📞 <strong>Phone:</strong><br>
+91 97441 12113 &nbsp;|&nbsp; +91 77365 63694<br>
+91 90202 09949 &nbsp;|&nbsp; +91 75580 49107<br>
0487-2338800`
    },
    {
      id: 'location',
      keywords: ['where', 'located', 'address', 'thrissur', 'kerala', 'india', 'office', 'branch', 'place'],
      title: 'Our Location',
      answer: `Our headquarters is located at:<br><br>
📍 <strong>Gate No 71, Parakkott Lane, Patturaikkal,<br>Thrissur – 680020, Kerala, India</strong><br><br>
We also have a branch office in <strong>Karunagappally</strong>, opened in 2023.`
    },
    {
      id: 'journey',
      keywords: ['journey', 'history', 'milestone', 'timeline', 'growth', 'achievements', 'year', '2015', '2016', '2018', '2020', '2023', '2024', '2025', 'story', 'how did', 'evolution'],
      title: 'Company Journey',
      answer: `Here's our growth story:<br><br>
🚀 <strong>2015:</strong> Started in a 100 sq.ft workspace by Gopikrishnan P G &amp; Rangaraj T R<br>
📱 <strong>2016:</strong> Entered Mobile App Development, achieved <strong>ISO 9001:2015</strong><br>
🏭 <strong>2018:</strong> MSME Udyam Registration &amp; launched <strong>IoT division</strong><br>
🏢 <strong>2020:</strong> Private Limited incorporation, <strong>Startup India</strong> &amp; <strong>KSUM</strong> recognition<br>
🌍 <strong>2023:</strong> Opened Karunagappally branch &amp; launched <strong>Placement Cell</strong><br>
🏆 <strong>2024:</strong> Recognized by <strong>STED</strong> and <strong>SITTTR</strong><br>
👥 <strong>2025:</strong> Expanded to <strong>30+ developers</strong> &amp; expanded Industry on Campus initiatives`
    },
    {
      id: 'certifications',
      keywords: ['certification', 'certified', 'iso', 'accreditation', 'recognition', 'affiliation', 'msme', 'startup india', 'ksum', 'sted', 'sitttr', 'bharat sevak', 'registered'],
      title: 'Certifications & Affiliations',
      answer: `GrapesGenix holds the following certifications and recognitions:<ul>
<li>🏛️ <strong>Private Limited Company</strong> (incorporated 2020)</li>
<li>✅ <strong>ISO 9001:2015</strong> Certified (since 2016)</li>
<li>🏭 <strong>MSME Udyam</strong> Registered</li>
<li>🇮🇳 <strong>Startup India</strong> Recognized</li>
<li>🌟 <strong>KSUM</strong> (Kerala Startup Mission) Recognized</li>
<li>🎓 <strong>STED Council</strong> Recognized (2024)</li>
<li>🔬 <strong>SITTTR</strong> Recognized (2024)</li>
<li>🤝 <strong>Bharat Sevak Samaj</strong> Affiliated</li>
<li>🔭 <strong>Council for Technology and Science</strong> Affiliated</li>
</ul>`
    },
    {
      id: 'ai',
      keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'data science', 'nlp', 'computer vision'],
      title: 'AI & ML Services',
      answer: `Yes, GrapesGenix has an active <strong>AI &amp; ML</strong> division!<br><br>
We offer:<ul>
<li>🤖 <strong>AI &amp; ML Internship</strong> program for students</li>
<li>🌱 AI-powered products (e.g., Farmers Plant Recognition App)</li>
<li>Custom AI solution development for clients</li>
</ul>
Our team stays at the cutting edge of artificial intelligence and machine learning technologies.`
    },
    {
      id: 'iot',
      keywords: ['iot', 'internet of things', 'hardware', 'networking', 'embedded', 'raspberry', 'arduino', 'sensors', 'smart'],
      title: 'IoT Solutions',
      answer: `GrapesGenix launched its <strong>IoT (Internet of Things) division</strong> in <strong>2018</strong>.<br><br>
We offer:<ul>
<li>🌐 IoT system design and development</li>
<li>🔌 Hardware &amp; Networking Internship program</li>
<li>📡 Smart device integration solutions</li>
</ul>
Whether it's smart home, industrial automation, or healthcare IoT — we deliver reliable connected solutions.`
    },
    {
      id: 'seo',
      keywords: ['seo', 'search engine', 'google ranking', 'digital marketing', 'optimization', 'online visibility', 'ranking'],
      title: 'SEO Services',
      answer: `Yes! <strong>Search Engine Optimization (SEO)</strong> is one of our service offerings.<br><br>
We help businesses improve their online visibility and rank higher on search engines like Google. Our SEO services are tailored to your industry and business goals.<br><br>
Contact us at <a href="mailto:mail@grapestechs.com">mail@grapestechs.com</a> to learn more.`
    },
    {
      id: 'support',
      keywords: ['support', '24/7', 'help', 'assistance', 'maintenance', 'after sales', 'issue', 'troubleshoot'],
      title: '24/7 Support',
      answer: `GrapesGenix provides <strong>24/7 Technical Support</strong> and <strong>Maintenance Contracts</strong> for our clients.<br><br>
📞 <strong>Phone:</strong> +91 97441 12113<br>
📧 <strong>Email:</strong> <a href="mailto:mail@grapestechs.com">mail@grapestechs.com</a><br><br>
Our expert team is always ready to help resolve any technical issues promptly.`
    }
  ];

  /* ------------------------------------------------------------------
     2. FALLBACK RESPONSE (when no KB match is found)
  ------------------------------------------------------------------ */
  const FALLBACK_RESPONSES = [
    `I'm sorry, I don't have specific information on that. Please reach us directly:<br><br>📞 <strong>+91 97441 12113</strong><br>📧 <a href="mailto:mail@grapestechs.com">mail@grapestechs.com</a>`,
    `That's a great question! For detailed answers, please contact our team:<br><br>📧 <a href="mailto:info@grapestechs.com">info@grapestechs.com</a><br>📞 <strong>0487-2338800</strong>`,
    `I'm still learning! For the most accurate answer, please reach GrapesGenix at:<br><br>📞 <strong>+91 97441 12113</strong> or visit us at Thrissur, Kerala.`
  ];

  let fallbackIndex = 0;

  /* ------------------------------------------------------------------
     3. FUZZY / KEYWORD MATCHING ENGINE
     Scores each KB entry against the user's tokenised query.
  ------------------------------------------------------------------ */

  /**
   * Tokenise a string into lowercase words, stripping punctuation.
   */
  function tokenize(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  }

  /**
   * Compute Dice coefficient similarity between two strings.
   * Returns 0–1.
   */
  function diceSimilarity(a, b) {
    if (!a || !b) return 0;
    if (a === b) return 1;
    const bigramsA = new Set();
    const bigramsB = new Set();
    for (let i = 0; i < a.length - 1; i++) bigramsA.add(a.slice(i, i + 2));
    for (let i = 0; i < b.length - 1; i++) bigramsB.add(b.slice(i, i + 2));
    if (bigramsA.size === 0 || bigramsB.size === 0) return 0;
    let shared = 0;
    bigramsA.forEach(bg => { if (bigramsB.has(bg)) shared++; });
    return (2 * shared) / (bigramsA.size + bigramsB.size);
  }

  /**
   * Score a KB entry against a user query.
   * Higher = better match.
   */
  function scoreEntry(entry, queryTokens, rawQuery) {
    let score = 0;
    const rawLower = rawQuery.toLowerCase();

    for (const kw of entry.keywords) {
      // Exact substring match — high weight
      if (rawLower.includes(kw)) {
        score += 10 + kw.length * 0.5; // longer keyword = more weight
        continue;
      }
      // Token-level fuzzy match
      for (const qt of queryTokens) {
        const kwTokens = tokenize(kw);
        for (const kwt of kwTokens) {
          if (qt === kwt) {
            score += 8;
          } else if (qt.startsWith(kwt) || kwt.startsWith(qt)) {
            score += 4;
          } else {
            const dice = diceSimilarity(qt, kwt);
            if (dice > 0.6) score += dice * 5;
          }
        }
      }
    }
    return score;
  }

  /**
   * Find the best matching KB entry for a given query.
   * Returns null if nothing scores above the minimum threshold.
   */
  function findAnswer(rawQuery) {
    const tokens = tokenize(rawQuery);
    if (tokens.length === 0) return null;

    let best = null;
    let bestScore = 0;

    for (const entry of KB) {
      const s = scoreEntry(entry, tokens, rawQuery);
      if (s > bestScore) {
        bestScore = s;
        best = entry;
      }
    }

    const MIN_SCORE = 4; // tunable threshold
    return bestScore >= MIN_SCORE ? best : null;
  }

  /* ------------------------------------------------------------------
     4. DOM HELPERS
  ------------------------------------------------------------------ */

  function currentTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    const msgs = document.getElementById('gg-chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function appendMessage(sender, htmlContent) {
    const msgs = document.getElementById('gg-chat-messages');
    if (!msgs) return;

    const row = document.createElement('div');
    row.className = `gg-msg-row ${sender}`;

    if (sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'gg-msg-avatar';
      avatar.textContent = 'GG';
      row.appendChild(avatar);
    }

    const bubbleWrap = document.createElement('div');
    bubbleWrap.style.display = 'flex';
    bubbleWrap.style.flexDirection = 'column';
    bubbleWrap.style.maxWidth = '80%';

    const bubble = document.createElement('div');
    bubble.className = 'gg-bubble';
    bubble.innerHTML = htmlContent;

    const meta = document.createElement('div');
    meta.className = 'gg-bubble-meta';
    meta.textContent = currentTime();

    bubbleWrap.appendChild(bubble);
    bubbleWrap.appendChild(meta);
    row.appendChild(bubbleWrap);
    msgs.appendChild(row);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const msgs = document.getElementById('gg-chat-messages');
    if (!msgs) return;

    const row = document.createElement('div');
    row.className = 'gg-typing-row';
    row.id = 'gg-typing-row';

    const avatar = document.createElement('div');
    avatar.className = 'gg-msg-avatar';
    avatar.textContent = 'GG';

    const bubble = document.createElement('div');
    bubble.className = 'gg-typing-bubble';
    bubble.innerHTML = '<span class="gg-dot"></span><span class="gg-dot"></span><span class="gg-dot"></span>';

    row.appendChild(avatar);
    row.appendChild(bubble);
    msgs.appendChild(row);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('gg-typing-row');
    if (el) el.remove();
  }

  function disableInput(disabled) {
    const input = document.getElementById('gg-chat-input');
    const btn = document.getElementById('gg-chat-send');
    if (input) input.disabled = disabled;
    if (btn) btn.disabled = disabled;
  }

  /* ------------------------------------------------------------------
     5. CHATBOT CORE LOGIC
  ------------------------------------------------------------------ */

  function processQuery(rawQuery) {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    // Show user message
    appendMessage('user', trimmed);

    // Lock input
    disableInput(true);

    // Simulate typing delay (600 – 1200ms)
    const delay = 600 + Math.random() * 600;

    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();

      const match = findAnswer(trimmed);
      if (match) {
        appendMessage('bot', match.answer);
      } else {
        const fb = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
        fallbackIndex++;
        appendMessage('bot', fb);
      }

      disableInput(false);
      const input = document.getElementById('gg-chat-input');
      if (input) { input.focus(); autoResize(input); }
    }, delay);
  }

  /* ------------------------------------------------------------------
     6. INITIALISATION
  ------------------------------------------------------------------ */

  function initChatbot() {
    const toggle      = document.getElementById('gg-chat-toggle');
    const chatWindow  = document.getElementById('gg-chat-window');
    const closeBtn    = document.getElementById('gg-chat-close');
    const sendBtn     = document.getElementById('gg-chat-send');
    const inputEl     = document.getElementById('gg-chat-input');
    const badge       = document.getElementById('gg-chat-badge');
    const quickBtns   = document.querySelectorAll('.gg-quick-btn');
    const msgs        = document.getElementById('gg-chat-messages');

    if (!toggle || !chatWindow) return;

    let isOpen = false;

    /* --- Auto-resize textarea --- */
    function autoResize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    }

    /* --- Open / Close --- */
    function openChat() {
      isOpen = true;
      chatWindow.classList.add('gg-open');
      chatWindow.setAttribute('aria-hidden', 'false');
      toggle.querySelector('.gg-icon-open').style.display = 'none';
      toggle.querySelector('.gg-icon-close').style.display = 'flex';
      if (badge) badge.classList.add('hidden');
      // Render welcome message on first open
      if (msgs && msgs.children.length === 0) {
        renderWelcome();
      }
      setTimeout(() => { if (inputEl) inputEl.focus(); }, 350);
    }

    function closeChat() {
      isOpen = false;
      chatWindow.classList.remove('gg-open');
      chatWindow.setAttribute('aria-hidden', 'true');
      toggle.querySelector('.gg-icon-open').style.display = 'flex';
      toggle.querySelector('.gg-icon-close').style.display = 'none';
    }

    toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    /* --- Welcome message --- */
    function renderWelcome() {
      appendMessage('bot',
        `👋 Hello! I'm the <strong>GrapesGenix Virtual Assistant</strong>.<br><br>
I can answer your questions about our <em>services, internships, IoC program, products, contact details</em>, and more!<br><br>
Use the quick buttons below or type your question. 🚀`
      );
    }

    /* --- Send on button click --- */
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (inputEl && inputEl.value.trim()) {
          const val = inputEl.value;
          inputEl.value = '';
          autoResize(inputEl);
          processQuery(val);
        }
      });
    }

    /* --- Send on Enter (Shift+Enter = new line) --- */
    if (inputEl) {
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (inputEl.value.trim()) {
            const val = inputEl.value;
            inputEl.value = '';
            autoResize(inputEl);
            processQuery(val);
          }
        }
      });
      inputEl.addEventListener('input', () => autoResize(inputEl));
    }

    /* --- Quick Buttons --- */
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          if (!isOpen) openChat();
          setTimeout(() => processQuery(query), isOpen ? 0 : 400);
        }
      });
    });

    /* --- Close on outside click (desktop) --- */
    document.addEventListener('click', (e) => {
      if (isOpen && !document.getElementById('gg-chatbot').contains(e.target)) {
        closeChat();
      }
    });

    /* --- Keyboard: Escape to close --- */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

})(); /* End of Chatbot IIFE */
