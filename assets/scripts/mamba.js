'use strict';
(() => {
  const canvas = document.getElementById('rotation-demo');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const angle = document.getElementById('angle');
  const retention = document.getElementById('retention');
  const steps = 80;
  function draw() {
    const theta = Number(angle.value) * Math.PI / 180;
    const rho = Number(retention.value);
    document.getElementById('angle-value').textContent = `${angle.value}°`;
    document.getElementById('retention-value').textContent = rho.toFixed(3);
    const radius = Math.pow(rho, steps);
    document.getElementById('demo-status').textContent = `Both final state magnitudes: ${radius.toFixed(3)}. Same retention; ${theta === 0 ? 'identical trajectories at zero rotation.' : 'different paths through state space.'}`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const x0 = canvas.width / 2, y0 = canvas.height / 2, scale = 172;
    const point = (x, y) => [x0 + scale * x, y0 - scale * y];
    ctx.strokeStyle = '#dce5e8'; ctx.lineWidth = 1.5;
    for (const r of [0.5, 1]) {
      ctx.beginPath(); ctx.arc(x0, y0, scale * r, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(x0 - 205, y0); ctx.lineTo(x0 + 235, y0);
    ctx.moveTo(x0, y0 - 195); ctx.lineTo(x0, y0 + 195); ctx.stroke();
    ctx.fillStyle = '#647078'; ctx.font = '15px sans-serif';
    ctx.fillText('H', x0 + 248, y0 + 5); ctx.fillText('P', x0 + 9, y0 - 188);
    ctx.fillText('0', x0 + 6, y0 + 18); ctx.fillText('start (1, 0)', x0 + scale + 15, y0 - 13);
    for (const [frequency, color] of [[0, '#1f77b4'], [theta, '#eb822c']]) {
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.beginPath();
      for (let t = 0; t <= steps; t += 0.2) {
        const r = Math.pow(rho, t), p = point(r * Math.cos(frequency * t), r * Math.sin(frequency * t));
        if (t === 0) ctx.moveTo(...p); else ctx.lineTo(...p);
      }
      ctx.stroke();
      const end = point(radius * Math.cos(frequency * steps), radius * Math.sin(frequency * steps));
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(...end, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#83949a'; ctx.lineWidth = 1.2; ctx.setLineDash([4, 5]);
    ctx.beginPath(); ctx.arc(x0, y0, scale * radius, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
  }
  angle.addEventListener('input', draw);
  retention.addEventListener('input', draw);
  draw();
})();

(() => {
  document.querySelectorAll('.results-switcher').forEach(switcher => {
  const tabs = [...switcher.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  panels.forEach((panel, i) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[i].id);
    panel.tabIndex = 0;
  });
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  function followHash(scroll = false) {
    const target = document.getElementById(location.hash.slice(1));
    const index = panels.findIndex(panel => target && panel.contains(target));
    if (index < 0) return;
    const disclosure = target.closest('details');
    if (disclosure) disclosure.open = true;
    select(index);
    if (scroll) requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      select(i);
      // Keep direct links consistent without moving the page on a dot click.
      history.replaceState(null, '', '#' + panels[i].querySelector('h3').id);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    });
  });
  select(0);
  switcher.hidden = false;
  followHash(true);
  window.addEventListener('hashchange', () => followHash(true));
  });
})();
