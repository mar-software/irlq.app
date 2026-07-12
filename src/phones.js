// 3D rotator for the three hero phones: they sit on a circular turntable
// (perspective + translateZ), auto-spin one slot every 5s, and can be dragged.
const STEP = 120; // degrees between the three phones
const AUTO_MS = 5000;
const SPIN_MS = 900;
const MAX_TILT = 26; // deg of rotateY a phone picks up at the sides
const FLING_VELOCITY = 0.25; // deg per ms

const stage = document.querySelector('.phones');
const phones = stage ? [...stage.querySelectorAll('.phone')] : [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (stage && phones.length) {
  let angle = 0; // turntable rotation in degrees; phone i sits at angle + i * STEP
  let rafId = null;
  let autoTimer = null;

  const radius = () => stage.offsetWidth * 0.65;

  function render() {
    const r = radius();
    phones.forEach((phone, i) => {
      const a = ((angle + i * STEP) * Math.PI) / 180;
      const x = Math.sin(a) * r;
      const z = (Math.cos(a) - 1) * r; // 0 at the front, -2r at the back
      const tilt = Math.sin(a) * MAX_TILT;
      phone.style.transform = `translateX(-50%) translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${tilt.toFixed(2)}deg)`;
      phone.style.zIndex = String(Math.round(1000 + z));
    });
  }

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function animateTo(target, duration = SPIN_MS) {
    cancelAnimationFrame(rafId);
    // rAF is frozen in hidden tabs and unwanted under reduced motion: jump instead.
    if (reducedMotion.matches || document.hidden) {
      angle = target;
      render();
      return;
    }
    const from = angle;
    const delta = target - from;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      angle = from + delta * easeInOut(t);
      render();
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function restartAuto() {
    clearInterval(autoTimer);
    if (reducedMotion.matches) return;
    autoTimer = setInterval(() => {
      if (document.hidden) return;
      animateTo(angle - STEP);
    }, AUTO_MS);
  }

  // ---- drag to spin ----
  let dragging = false;
  let startX = 0;
  let startAngle = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0; // deg per ms, signed

  const degPerPx = () => 180 / stage.offsetWidth; // full width of drag = half a turn

  stage.addEventListener('pointerdown', (e) => {
    dragging = true;
    cancelAnimationFrame(rafId);
    clearInterval(autoTimer);
    startX = lastX = e.clientX;
    startAngle = angle;
    lastT = e.timeStamp;
    velocity = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
  });

  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dt = e.timeStamp - lastT;
    if (dt > 0) velocity = ((e.clientX - lastX) * degPerPx()) / dt;
    lastX = e.clientX;
    lastT = e.timeStamp;
    angle = startAngle + (e.clientX - startX) * degPerPx();
    render();
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    // Snap to the nearest slot; a fast flick biases the snap in its direction.
    const fling = Math.abs(velocity) > FLING_VELOCITY ? Math.sign(velocity) : 0;
    const target = Math.round((angle + fling * STEP * 0.5) / STEP) * STEP;
    animateTo(target, 600);
    restartAuto();
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  phones.forEach((phone) => {
    phone.draggable = false; // native image drag would swallow pointermove
  });

  window.addEventListener('resize', render);

  render();
  restartAuto();
}
