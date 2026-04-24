/* ===========================
   ANIMATIONS.JS — Smooth Scroll & GSAP Reveals
   =========================== */

(function () {
  let lenis;

  // ---- Lenis Smooth Scroll + GSAP ScrollTrigger Integration ----
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Synchronize Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback RAF if GSAP isn't loaded
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Ensure links with hashes use Lenis to scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, { offset: -80 }); // Offset for the fixed navbar
        }
      });
    });
  }

  // ---- Hero headline line-by-line reveal ----
  const lines = document.querySelectorAll('.hero__line');
  lines.forEach(line => {
    // Wrap text in inner span
    const text = line.textContent;
    line.innerHTML = `<span class="hero__line-inner">${text}</span>`;
  });

  // Trigger hero headline after short delay
  setTimeout(() => {
    document.querySelectorAll('.hero__line-inner').forEach((span, index) => {
      // Add 'in' class with staggered delay or use GSAP
      if (typeof gsap !== 'undefined') {
        gsap.to(span, {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          delay: index * 0.15
        });
      } else {
        setTimeout(() => { span.classList.add('in'); }, index * 150);
      }
    });
  }, 300);

  // ---- GSAP Scroll-Triggered Reveals for [data-reveal] elements ----
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const revealEls = document.querySelectorAll('[data-reveal]');
    
    revealEls.forEach(el => {
      gsap.fromTo(el, 
        { 
          y: 40, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%', // Trigger when the top of element hits 85% down viewport
            toggleActions: 'play none none reverse' // Re-animates slightly if scrolling back up
          }
        }
      );
    });
  } else {
    // Fallback to Intersection Observer if GSAP is not available
    const revealEls = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ---- Parallax subtle shift on scroll ----
  function parallax() {
    const scrollY = window.scrollY;

    // Hero canvas subtle vertical float
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
      canvas.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
  }

  window.addEventListener('scroll', parallax, { passive: true });
})();
