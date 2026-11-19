
(() => {
  'use strict';
  const stages = [
    'Youth arrest rates',
    'Camps & supervised activities',
    'Skills, leadership & community',
    'Arts & culture',
    'Aquatics',
    'Sports & Fitness'
  ];
  const group = document.querySelector('[data-swap-group="recreation"]');
  const label = document.getElementById('recreation-stage');
  const frames = group ? [...group.querySelectorAll('[data-frame]')] : [];
  const steps = [...document.querySelectorAll('[data-swap="recreation"][data-step]')];
  const incomeGroup = document.querySelector('[data-swap-group="income"]');
  const incomeFrames = incomeGroup ? [...incomeGroup.querySelectorAll('.swap-frame')] : [];
  const incomeSteps = [...document.querySelectorAll('[data-swap="income"][data-step]')];
  const fill = document.getElementById('progress-fill');
  let activeFrame = -1;
  let activeIncomeFrame = -1;
  let scheduled = false;

  function setFrame(index) {
    if (index === activeFrame || !frames.length) return;
    activeFrame = index;
    if (group) group.dataset.frame = String(index);
    // Intentional: no animation, pan, zoom, or movement between map frames.
    frames.forEach((img, i) => {
      const active = i === index;
      img.classList.toggle('is-active', active);
      img.setAttribute('aria-hidden', String(!active));
    });
    if (label) label.textContent = stages[index] || '';
  }

  function setIncomeFrame(index) {
    if (!incomeGroup || index === activeIncomeFrame || index < 0 || index >= incomeFrames.length) return;
    activeIncomeFrame = index;
    incomeGroup.dataset.frame = String(index);
    incomeFrames.forEach((img, i) => {
      const active = i === index;
      img.classList.toggle('is-active', active);
      img.setAttribute('aria-hidden', String(!active));
    });
  }

  function update() {
    scheduled = false;
    const viewportH = window.innerHeight;
    const referenceY = viewportH * 0.53;
    if (steps.length) {
      let bestIndex = 0;
      let bestDistance = Infinity;
      steps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        // Prefer the step that currently crosses the central reading line.
        const distance = referenceY < rect.top ? rect.top - referenceY : referenceY > rect.bottom ? referenceY - rect.bottom : 0;
        if (distance < bestDistance) { bestDistance = distance; bestIndex = i; }
      });
      setFrame(bestIndex);
    }
    if (incomeSteps.length) {
      let bestIndex = 0;
      let bestDistance = Infinity;
      incomeSteps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const distance = referenceY < rect.top ? rect.top - referenceY : referenceY > rect.bottom ? referenceY - rect.bottom : 0;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = Number(step.dataset.step);
        }
      });
      setIncomeFrame(bestIndex);
    }
    if (fill) {
      const range = document.documentElement.scrollHeight - viewportH;
      fill.style.width = `${range <= 0 ? 100 : Math.min(100, Math.max(0, window.scrollY / range * 100))}%`;
    }
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', update);
  update();
})();
