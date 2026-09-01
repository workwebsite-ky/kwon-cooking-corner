/* ==========================================================================
   KWON COOKING CORNER — site behaviour
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies. Every block is independent and bails out
   quietly if its markup is not present on the current page, so this single
   file can be shared by all five pages.

   01. Config          — the few values a non-developer may want to change
   02. Preloader
   03. Sticky nav + mobile drawer
   04. Scroll reveal (IntersectionObserver)
   05. Animated stat counters
   06. Hero parallax
   07. FAQ accordion
   08. Back-to-top button
   09. Gallery lightbox
   10. Contact form (mailto fallback)
   11. Footer year
   ========================================================================== */

(function () {
  'use strict';

  /* ======================================================================
     01. CONFIG  — edit these two lines to change where enquiries go
     ====================================================================== */
  var CONFIG = {
    email: 'kwoncookingcorner@gmail.com',
    phone: '+17272883681'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };


  /* ======================================================================
     02. PRELOADER
     Hides as soon as the window load event fires (or after 2.2s as a
     safety net, so a slow image can never trap the visitor behind it).
     ====================================================================== */
  (function preloader() {
    var el = $('#loader');
    if (!el) return;

    var hide = function () {
      el.classList.add('is-done');
      document.body.classList.remove('no-scroll');
      window.setTimeout(function () { el.remove(); }, 800);
    };

    window.addEventListener('load', function () { window.setTimeout(hide, 380); });
    window.setTimeout(hide, 2200);
  })();


  /* ======================================================================
     03. STICKY NAV + MOBILE DRAWER
     ====================================================================== */
  (function navigation() {
    var nav = $('#nav');
    if (!nav) return;

    /* --- glass background once we scroll past the hero lip --- */
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* --- hamburger drawer --- */
    var toggle = $('#navToggle');
    var drawer = $('#navDrawer');
    if (!toggle || !drawer) return;

    var setOpen = function (open) {
      toggle.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    // close when a link is tapped or Esc is pressed
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  })();


  /* ======================================================================
     04. SCROLL REVEAL
     Any element with [data-reveal] fades/slides in once. An optional
     [data-delay="120"] staggers it by that many milliseconds.
     ====================================================================== */
  (function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    // No IntersectionObserver (or reduced motion) -> just show everything.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.delay || '0', 10);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();


  /* ======================================================================
     05. ANIMATED COUNTERS
     <span class="stat__value" data-count="500" data-suffix="+">0</span>
     ====================================================================== */
  (function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    var run = function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var dur = 1700;
      var start = null;

      if (reduceMotion) {
        el.textContent = prefix + target + suffix;
        return;
      }

      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        // ease-out-expo for a satisfying settle
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  })();


  /* ======================================================================
     06. HERO PARALLAX
     Gentle vertical drift on the hero photo. rAF-throttled and skipped on
     touch devices, where it costs more than it gives.
     ====================================================================== */
  (function parallax() {
    var img = $('#heroImg');
    if (!img || reduceMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          img.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0) scale(1.06)';
        }
        ticking = false;
      });
    }, { passive: true });
  })();


  /* ======================================================================
     07. FAQ ACCORDION
     One panel open at a time; max-height is set from scrollHeight so the
     transition is smooth without hard-coding any panel size.
     ====================================================================== */
  (function faq() {
    var items = $$('.faq__item');
    if (!items.length) return;

    var close = function (item) {
      item.classList.remove('is-open');
      $('.faq__a', item).style.maxHeight = null;
      $('.faq__q', item).setAttribute('aria-expanded', 'false');
    };

    items.forEach(function (item) {
      var q = $('.faq__q', item);
      var a = $('.faq__a', item);
      if (!q || !a) return;

      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(close);
        if (!isOpen) {
          item.classList.add('is-open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // keep the open panel correctly sized if the window is resized
    window.addEventListener('resize', function () {
      var open = $('.faq__item.is-open');
      if (open) $('.faq__a', open).style.maxHeight = $('.faq__a', open).scrollHeight + 'px';
    });
  })();


  /* ======================================================================
     08. BACK TO TOP
     ====================================================================== */
  (function backToTop() {
    var btn = $('#toTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  })();


  /* ======================================================================
     09. GALLERY LIGHTBOX
     ====================================================================== */
  (function lightbox() {
    var triggers = $$('[data-lightbox]');
    var box = $('#lightbox');
    if (!triggers.length || !box) return;

    var img = $('img', box);
    var cap = $('.lightbox__caption', box);

    var open = function (src, caption) {
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      box.classList.add('is-open');
      document.body.classList.add('no-scroll');
    };
    var close = function () {
      box.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    };

    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        var full = t.dataset.lightbox || $('img', t).src;
        open(full, t.dataset.caption || $('img', t).alt);
      });
    });

    $('.lightbox__close', box).addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();


  /* ======================================================================
     10. CONTACT FORM
     There is no back-end here, so the form validates in the browser and
     then hands a fully pre-filled message to the visitor's mail client.
     Swap the marked block for a fetch() to Formspree/Netlify/EmailJS to
     collect submissions server-side instead.
     ====================================================================== */
  (function contactForm() {
    var form = $('#contactForm');
    if (!form) return;

    var status = $('#formStatus');

    var say = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status is-visible ' + (ok ? 'form-status--ok' : 'form-status--err');
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {
        name:    (form.name_field.value  || '').trim(),
        email:   (form.email_field.value || '').trim(),
        phone:   (form.phone_field.value || '').trim(),
        service: form.service_field.value || 'General enquiry',
        date:    form.date_field.value || 'Not specified',
        message: (form.message_field.value || '').trim()
      };

      if (!data.name || !data.email || !data.message) {
        say('Please fill in your name, email and a short message so Jakwon can get back to you.', false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
        say('That email address does not look right — please double-check it.', false);
        return;
      }

      /* ---- BEGIN mailto handoff (replace with your form service) ---- */
      var subject = 'New enquiry from ' + data.name + ' — ' + data.service;
      var body =
        'Name: '    + data.name    + '\n' +
        'Email: '   + data.email   + '\n' +
        'Phone: '   + (data.phone || 'Not provided') + '\n' +
        'Service: ' + data.service + '\n' +
        'Event date: ' + data.date + '\n\n' +
        'Message:\n' + data.message + '\n';

      window.location.href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(body);
      /* ---- END mailto handoff ---- */

      say('Thank you, ' + data.name.split(' ')[0] + '! Your email app is opening with the details filled in — just hit send. In a hurry? Text ' + CONFIG.phone + '.', true);
      form.reset();
    });
  })();


  /* ======================================================================
     11. FOOTER YEAR
     ====================================================================== */
  $$('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
