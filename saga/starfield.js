/* ============================================================
   starfield.js — 星野 / 流星 / 视差 / 滚动揭示
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('starfield');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  var W = 0, H = 0, DPR = 1;
  var stars = [], meteors = [];
  var mouse = { x: 0.5, y: 0.5 }, aim = { x: 0.5, y: 0.5 };
  var scrollY = 0, lastMeteor = 0;

  function build() {
    var count = Math.min(300, Math.max(70, Math.round((W * H) / 9000)));
    stars = [];
    for (var i = 0; i < count; i++) {
      var z = Math.random() * 0.85 + 0.15;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: z,
        r: 0.35 + z * 1.5,
        tw: Math.random() * Math.PI * 2,
        tws: 0.35 + Math.random() * 1.5,
        gold: Math.random() < 0.16
      });
    }
  }

  function resize() {
    if (!ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function spawnMeteor() {
    var fromLeft = Math.random() < 0.5;
    meteors.push({
      x: fromLeft ? -60 : W + 60,
      y: Math.random() * H * 0.55,
      vx: (fromLeft ? 1 : -1) * (2.4 + Math.random() * 2.4),
      vy: 1.1 + Math.random() * 1.2,
      life: 1,
      len: 90 + Math.random() * 120
    });
  }

  function draw(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    mouse.x += (aim.x - mouse.x) * 0.045;
    mouse.y += (aim.y - mouse.y) * 0.045;

    var px = (mouse.x - 0.5) * 26;
    var py = (mouse.y - 0.5) * 18 - scrollY * 0.02;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = 0.62 + Math.sin(t * 0.0012 * s.tws + s.tw) * 0.38;
      var x = s.x + px * s.z;
      var y = ((s.y + py * s.z) % H + H) % H;

      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      if (s.gold) {
        ctx.fillStyle = 'rgba(232,200,122,' + (0.30 + tw * 0.55).toFixed(3) + ')';
      } else {
        ctx.fillStyle = 'rgba(180,255,215,' + (0.20 + tw * 0.62).toFixed(3) + ')';
      }
      ctx.fill();

      if (s.r > 1.25) {
        var g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 7);
        g.addColorStop(0, 'rgba(0,229,122,' + (0.16 * tw).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(0,229,122,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, s.r * 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 流星
    for (var m = meteors.length - 1; m >= 0; m--) {
      var o = meteors[m];
      o.x += o.vx;
      o.y += o.vy;
      o.life -= 0.006;
      if (o.life <= 0 || o.y > H + 80 || o.x < -160 || o.x > W + 160) {
        meteors.splice(m, 1);
        continue;
      }
      var nx = o.x - o.vx * (o.len / 8);
      var ny = o.y - o.vy * (o.len / 8);
      var lg = ctx.createLinearGradient(o.x, o.y, nx, ny);
      lg.addColorStop(0, 'rgba(200,255,225,' + (0.85 * o.life).toFixed(3) + ')');
      lg.addColorStop(0.4, 'rgba(0,229,122,' + (0.35 * o.life).toFixed(3) + ')');
      lg.addColorStop(1, 'rgba(0,229,122,0)');
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  if (ctx) {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('mousemove', function (e) {
      aim.x = e.clientX / window.innerWidth;
      aim.y = e.clientY / window.innerHeight;
    }, { passive: true });

    if (!reduce) {
      requestAnimationFrame(draw);
      setInterval(function () {
        if (meteors.length < 2 && Math.random() < 0.55) spawnMeteor();
      }, 3800);
    } else {
      draw(0);
    }
  }

  /* ---------- 滚动揭示 ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = parseInt(en.target.getAttribute('data-delay') || '0', 10);
        en.target.style.transitionDelay = d + 'ms';
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    items.forEach(function (el, i) {
      var parent = el.parentNode;
      var idx = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
      el.setAttribute('data-delay', String((idx % 3) * 90));
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 光晕跟随（卡片） ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.card'), function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
})();