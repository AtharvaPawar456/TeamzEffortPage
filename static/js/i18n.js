/**
 * TeamzEffort client-side i18n
 * Locales: en (default), mr, hi
 * Catalogs: window.TZ_I18N_DATA (from i18n-data.js, built from i18n/*.yaml)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tz-lang';
  var SUPPORTED = { en: true, mr: true, hi: true };
  var DEFAULT_LANG = 'en';
  var currentLang = DEFAULT_LANG;
  var catalogs = window.TZ_I18N_DATA || {};
  var listeners = [];

  function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function t(key) {
    if (!key) return '';
    var val = getByPath(catalogs[currentLang], key);
    if (val == null || val === '') {
      val = getByPath(catalogs[DEFAULT_LANG], key);
    }
    return val != null ? String(val) : key;
  }

  function detectLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('lang');
      if (q && SUPPORTED[q]) return q;
    } catch (e) { /* ignore */ }

    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED[stored]) return stored;
    } catch (e) { /* ignore */ }

    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('mr') === 0) return 'mr';
    if (nav.indexOf('hi') === 0) return 'hi';
    return DEFAULT_LANG;
  }

  function setDocumentLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    // Devanagari-friendly class for font stack
    if (lang === 'mr' || lang === 'hi') {
      document.documentElement.classList.add('lang-deva');
    } else {
      document.documentElement.classList.remove('lang-deva');
    }
  }

  function applyMeta() {
    var title = t('meta.title');
    if (title && title !== 'meta.title') document.title = title;

    function setMeta(selector, attr, value) {
      if (!value || value.indexOf('meta.') === 0) return;
      var el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }

    setMeta('meta[name="description"]', 'content', t('meta.description'));
    setMeta('meta[property="og:title"]', 'content', t('meta.og_title'));
    setMeta('meta[property="og:description"]', 'content', t('meta.og_description'));
    setMeta('meta[name="twitter:title"]', 'content', t('meta.og_title'));
    setMeta('meta[name="twitter:description"]', 'content', t('meta.og_description'));
  }

  function applyDom() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = t(key);
      if (value === key) return;
      el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var value = t(key);
      if (value === key) return;
      el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var value = t(key);
      if (value === key) return;
      el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      var value = t(key);
      if (value === key) return;
      el.setAttribute('aria-label', value);
    });

    // Language switcher active state
    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      var code = btn.getAttribute('data-lang-set');
      var active = code === currentLang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('is-active', active);
    });
  }

  function apply() {
    applyMeta();
    applyDom();
    listeners.forEach(function (fn) {
      try {
        fn(currentLang);
      } catch (e) { /* ignore */ }
    });
  }

  function setLang(lang, options) {
    options = options || {};
    if (!SUPPORTED[lang]) lang = DEFAULT_LANG;
    currentLang = lang;
    setDocumentLang(lang);

    if (options.persist !== false) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) { /* ignore */ }
    }

    // Optional URL hint without reload
    if (options.updateUrl) {
      try {
        var url = new URL(window.location.href);
        if (lang === DEFAULT_LANG) url.searchParams.delete('lang');
        else url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      } catch (e) { /* ignore */ }
    }

    apply();
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function bindSwitcher() {
    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var code = btn.getAttribute('data-lang-set');
        if (code && code !== currentLang) {
          setLang(code, { updateUrl: true });
        }
      });
    });
  }

  function init() {
    if (!catalogs.en) {
      console.warn('[i18n] No catalogs loaded (TZ_I18N_DATA missing). Run npm run build:i18n');
      catalogs.en = {};
    }
    bindSwitcher();
    setLang(detectLang(), { persist: true, updateUrl: false });
  }

  window.TZi18n = {
    t: t,
    setLang: setLang,
    getLang: function () {
      return currentLang;
    },
    apply: apply,
    onChange: onChange,
    supported: Object.keys(SUPPORTED),
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
