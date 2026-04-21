/* ===========================
   FAQ.JS — Accordion
   Smooth expand/collapse with aria attrs
   =========================== */

(function () {
  const questions = document.querySelectorAll('.faq__question');

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all
      questions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const a = q.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // Open first by default
  if (questions.length > 0) {
    questions[0].setAttribute('aria-expanded', 'true');
    const firstAnswer = questions[0].nextElementSibling;
    if (firstAnswer) firstAnswer.classList.add('open');
  }
})();
