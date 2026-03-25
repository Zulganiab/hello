// app.js — Phase 3: render sample articles and provide search + tab filtering
(function(){
  'use strict';

  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    initSearchShortcuts();
    initTabs();
    renderArticles(window.ARTICLES || []);
    initCardActivation();
  });

  function initMenuToggle(){
    const btn = qs('.menu-toggle');
    const sidebar = qs('.sidebar');
    if(!btn) return;
    // create mobile nav container
    createMobileNav();
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      // on narrow screens, open mobile nav overlay; otherwise toggle sidebar
      if(window.innerWidth <= 720){
        if(!document.body.classList.contains('mobile-nav-open')) openMobileNav(); else closeMobileNav();
      } else {
        sidebar && (sidebar.style.display = expanded ? 'none' : 'block');
      }
    });
  }

  function createMobileNav(){
    if(qs('.mobile-nav')) return;
    const mobile = document.createElement('div');
    mobile.id = 'mobileNav';
    mobile.className = 'mobile-nav';
    // clone primary nav
    const prim = qs('.primary-nav');
    const clone = prim ? prim.cloneNode(true) : document.createElement('nav');
    clone.classList.add('primary-nav');
    mobile.appendChild(clone);
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-mobile';
    closeBtn.setAttribute('aria-label','Close menu');
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = closeMobileNav;
    mobile.appendChild(closeBtn);
    document.body.appendChild(mobile);
    // clicking a link should close the mobile nav
    clone.addEventListener('click', (e)=>{ const a = e.target.closest('a'); if(a) setTimeout(closeMobileNav, 120); });
  }

  function openMobileNav(){
    const mobile = qs('.mobile-nav');
    if(!mobile) return;
    mobile.classList.add('open');
    document.body.classList.add('mobile-nav-open');
  }

  function closeMobileNav(){
    const mobile = qs('.mobile-nav');
    if(!mobile) return;
    mobile.classList.remove('open');
    document.body.classList.remove('mobile-nav-open');
    const toggle = qs('.menu-toggle');
    toggle && toggle.setAttribute('aria-expanded','false');
  }

  // close mobile nav on escape
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) closeMobileNav(); });

  function initSearchShortcuts(){
    const input = qs('#searchInput');
    if(!input) return;
    // Focus search with `/`
    window.addEventListener('keydown', (e)=>{
      if(e.key === '/' && document.activeElement !== input){
        e.preventDefault(); input.focus();
      }
    });

    // Prevent form submit (no backend yet)
    const form = input.closest('form');
    form && form.addEventListener('submit', (ev)=>{
      ev.preventDefault(); input.blur();
    });

    // live search
    input.addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      const filtered = filterArticles(q);
      renderArticles(filtered, q);
    });
  }

  function initTabs(){
    const tabs = qsa('.tabs .tab');
    if(!tabs.length) return;
    tabs.forEach(t => t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      const label = t.textContent.trim();
      if(label === 'All') renderArticles(window.ARTICLES);
      else renderArticles((window.ARTICLES || []).filter(a => a.category.toLowerCase() === label.toLowerCase()));
    }));
  }

  function filterArticles(query){
    if(!query) return window.ARTICLES.slice();
    return (window.ARTICLES || []).filter(a => {
      const hay = [a.title, a.excerpt, a.category, (a.tags||[]).join(' '), a.author?.name||''].join(' ').toLowerCase();
      return hay.includes(query);
    });
  }

  function renderArticles(list, query){
    const grid = qs('.card-grid');
    if(!grid) return;
    if(!list || list.length === 0){
      grid.innerHTML = `<div class="empty-state" role="status" style="padding:20px;color:var(--muted)">No articles found${query?` for "${escapeHtml(query)}"`:''}. Try different keywords or browse categories.</div>`;
      return;
    }

    const html = list.map(a => {
      return `
        <article class="card reveal" data-id="${a.id}" tabindex="0">
          <div class="thumb" role="img" aria-label="${escapeHtml(a.title)} thumbnail"></div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(a.title)}</h3>
            <p class="card-excerpt">${escapeHtml(a.excerpt)}</p>
            <div class="card-meta">
              <span class="badge">${escapeHtml(a.category)}</span>
              <time datetime="${escapeHtml(a.date)}">${new Date(a.date).toLocaleDateString()}</time>
            </div>
          </div>
        </article>`;
    }).join('');
    grid.innerHTML = html;
    // mark grid as active panel for transition
    grid.classList.add('tab-panel','active');
    // stagger reveal for cards
    const cards = Array.from(grid.querySelectorAll('.card.reveal'));
    cards.forEach((c, i)=>{ c.classList.remove('visible'); c.style.transitionDelay = (i*80)+'ms'; });
    requestAnimationFrame(()=>{ cards.forEach(c=>c.classList.add('visible')); });
    initCardActivation();
  }

  function initCardActivation(){
    const grid = qs('.card-grid');
    if(!grid) return;
    // click delegation for cards
    grid.onclick = function(e){
      const card = e.target.closest('.card');
      if(!card) return;
      const id = card.dataset.id;
      openArticlePanel(id);
    };

    // make keyboard interaction work for newly rendered cards
    qsa('.card').forEach(c => {
      c.onkeydown = function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); c.click(); }
      };
    });
  }

  function openArticlePanel(id){
    const article = (window.ARTICLES || []).find(a=>a.id===id);
    if(!article) return;
    const panel = qs('#articlePanel');
    const overlay = qs('#overlay');
    const title = qs('#panelTitle');
    const author = qs('#panelAuthor');
    const date = qs('#panelDate');
    const body = qs('#panelBody');
    const relatedList = qs('#relatedList');

    title.textContent = article.title;
    author.textContent = article.author?.name || 'Unknown';
    date.textContent = new Date(article.date).toLocaleDateString();

    // simulate small loading skeleton for polish
    body.innerHTML = '<div class="skeleton thumb"></div><div style="height:12px;margin-top:10px" class="skeleton"></div><div style="height:12px;margin-top:8px" class="skeleton"></div>';
    body.classList.add('skeleton');
    setTimeout(()=>{
      body.classList.remove('skeleton');
      body.innerHTML = article.body || '<p>No content.</p>';
    }, 260);

    // related
    relatedList.innerHTML = (article.related || []).map(id => {
      const a = (window.ARTICLES||[]).find(x=>x.id===id);
      if(!a) return '';
      return `<a href="#" class="related-item" data-id="${a.id}">${escapeHtml(a.title)}</a>`;
    }).join('') || '<div class="muted">No related articles.</div>';

    // show
    panel.setAttribute('aria-hidden','false');
    overlay.removeAttribute('data-hidden');
    overlay.setAttribute('aria-hidden','false');

    // push hash for basic routing/back button
    try{ history.pushState({article:id}, '', `#/article/${id}`); }catch(e){}

    // focus management
    const firstFocusable = qs('#panelClose');
    firstFocusable && firstFocusable.focus();

    // attach handlers
    qs('#panelClose').onclick = closeArticlePanel;
    overlay.onclick = closeArticlePanel;
    document.addEventListener('keydown', panelKeyHandler);
    // delegation for related items
    relatedList.onclick = function(e){
      const a = e.target.closest('.related-item');
      if(!a) return; e.preventDefault(); const id2 = a.dataset.id; openArticlePanel(id2);
    };
  }

  // Scroll reveal using IntersectionObserver
  function initScrollReveal(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('visible'); o.unobserve(en.target); }
      });
    },{threshold:0.12,rootMargin:'0px 0px -60px 0px'});
    const els = qsa('.reveal');
    els.forEach(el=>obs.observe(el));
  }

  // Initialize reveals for existing page elements
  document.addEventListener('DOMContentLoaded', ()=>{
    // add reveal to hero and sections
    const hero = qs('.hero'); hero && hero.classList.add('reveal');
    qsa('.section').forEach(s=>s.classList.add('reveal'));
    initScrollReveal();
  });

  function closeArticlePanel(){
    const panel = qs('#articlePanel');
    const overlay = qs('#overlay');
    if(!panel) return;
    panel.setAttribute('aria-hidden','true');
    overlay.setAttribute('data-hidden','true');
    overlay.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown', panelKeyHandler);
    // update history (go back) if possible
    try{ if(location.hash.startsWith('#/article/')) history.back(); }catch(e){}
  }

  function panelKeyHandler(e){
    if(e.key === 'Escape') closeArticlePanel();
    // trap focus: keep focus inside panel when open (simple)
    const panel = qs('#articlePanel');
    if(!panel || panel.getAttribute('aria-hidden') === 'true') return;
    const focusable = Array.from(panel.querySelectorAll('button,a,[tabindex]')).filter(n => !n.hasAttribute('disabled'));
    if(focusable.length === 0) return;
    const first = focusable[0], last = focusable[focusable.length-1];
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  // basic hash routing: open article when url contains #/article/:id
  window.addEventListener('popstate', ()=>{
    const m = location.hash.match(/#\/article\/(.+)$/);
    if(m){ const id = m[1]; openArticlePanel(id); }
    else closeArticlePanel();
  });
  // open on initial load if hash points to an article
  (function checkInitialHash(){
    const m = location.hash.match(/#\/article\/(.+)$/);
    if(m) openArticlePanel(m[1]);
  })();

  function escapeHtml(str){
    if(!str) return '';
    return String(str).replace(/[&<>\"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;' }[c]||c));
  }

})();
