(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMAIL = 'yanvieiradecarvalhoqa@gmail.com';
  var WA = '5521983799413';

  /* Círculos de status: número e borda avançam juntos de 0 até o valor final */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateRing(el, delay) {
    var target = +el.dataset.target, pct = +el.dataset.pct;
    var num = el.querySelector('.num'), fgs = el.querySelectorAll('.fg,.gl');
    if (reduce) { num.textContent = target; fgs.forEach(function (f) { f.style.strokeDashoffset = 100 - pct; }); return; }
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / dur, 1), e = easeOut(t);
      num.textContent = Math.round(target * e);
      fgs.forEach(function (f) { f.style.strokeDashoffset = 100 - pct * e; });
      if (t < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay);
  }
  document.querySelectorAll('.ring').forEach(function (r, i) { animateRing(r, 500 + i * 200); });

  /* Logs digitando linha por linha */
  var lines = [
    ['i', '[INFO]', ' Iniciando testes...'],
    ['p', '[PASS]', ' API ServeRest - 30/32'],
    ['p', '[PASS]', ' Chamados Senatec - 35/44'],
    ['f', '[FAIL]', ' Falhas registradas - 11'],
    ['i', '[INFO]', ' Gerando relatório...']
  ];
  var pre = document.getElementById('logs');
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function render(n) {
    pre.innerHTML = lines.slice(0, n).map(function (l, i) {
      var cur = i === n - 1 && n === lines.length ? ' <span class="cur"></span>' : '';
      return '<span class="' + l[0] + '">' + l[1] + '</span>' + esc(l[2]) + cur;
    }).join('\n');
  }
  if (reduce) { render(lines.length); }
  else { for (var k = 1; k <= lines.length; k++) (function (n) { setTimeout(function () { render(n); }, 900 + n * 600); })(k); }

  /* Menu mobile */
  var burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });

  /* Item ativo no menu */
  var links = [].slice.call(menu.querySelectorAll('a'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(function (s) { if (s) spy.observe(s); });

  /* Entrada suave das seções (uma vez) */
  var rv = document.querySelectorAll('.sec .wrap');
  rv.forEach(function (el) { el.classList.add('rv'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* Voltar ao topo */
  var top = document.querySelector('.totop');
  window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 600); }, { passive: true });
  top.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  /* Formulário: e-mail abre o Gmail no navegador; WhatsApp abre a conversa com a mensagem pronta */
  var form = document.getElementById('form');
  function data() { var f = new FormData(form); return { n: f.get('nome'), m: f.get('msg') }; }
  function mailParts() {
    var d = data();
    return { su: 'Contato pelo portfólio: ' + d.n, body: d.m + '\n\n' + d.n };
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var p = mailParts();
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) + '&su=' + encodeURIComponent(p.su) + '&body=' + encodeURIComponent(p.body), '_blank', 'noopener');
  });
  document.getElementById('alt-mail').addEventListener('click', function (ev) {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    var p = mailParts();
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(p.su) + '&body=' + encodeURIComponent(p.body);
  });
  document.getElementById('send-wa').addEventListener('click', function () {
    if (!form.reportValidity()) return;
    var d = data();
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá Yan, aqui é ' + d.n + '. ' + d.m), '_blank', 'noopener');
  });
})();
