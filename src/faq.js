// Master-detail FAQ: clicking a question shows only its answer on the right.
const questions = [...document.querySelectorAll('.faq-questions button')];
const answers = [...document.querySelectorAll('.faq-answers p')];

questions.forEach((question, i) => {
  question.addEventListener('click', () => {
    questions.forEach((q, j) => {
      q.classList.toggle('is-active', j === i);
      q.setAttribute('aria-expanded', String(j === i));
    });
    answers.forEach((a, j) => a.classList.toggle('is-active', j === i));
  });
});
