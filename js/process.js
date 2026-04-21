/* ===========================
   PROCESS.JS — Active Step on Scroll
   Highlights each process step as user scrolls
   and swaps the sticky image accordingly
   =========================== */

(function () {
  const steps = document.querySelectorAll('.process__step');
  const images = document.querySelectorAll('.process__img');

  if (!steps.length) return;

  function setActiveStep(stepNum) {
    steps.forEach(s => s.classList.remove('active'));
    images.forEach(img => img.classList.remove('active'));

    const activeStep = document.querySelector(`.process__step[data-step="${stepNum}"]`);
    const activeImg = document.querySelector(`.process__img[data-step="${stepNum}"]`);

    if (activeStep) activeStep.classList.add('active');
    if (activeImg) activeImg.classList.add('active');
  }

  // Default to step 1
  setActiveStep(1);

  // IntersectionObserver for each step
  const stepObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNum = entry.target.getAttribute('data-step');
          setActiveStep(stepNum);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '-20% 0px -40% 0px',
    }
  );

  steps.forEach(step => stepObserver.observe(step));

  // Click on step
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = step.getAttribute('data-step');
      setActiveStep(stepNum);
    });
  });
})();
