/**
 * HAAR Official Storefront Automated Patch
 * - Activates and styles the Minimal Matte Black Top Promotion Banner
 * - Directs banner click to /member/login.html
 * - Links BRACELET in Desktop & Mobile GNB to /category/BRACELET/77/
 */
(function() {
  'use strict';

  var BANNER_COOKIE_NAME = 'haar_top_banner_closed';
  var BRACELET_URL = '/category/BRACELET/77/';
  var LOGIN_URL = '/member/login.html';
  var BANNER_TEXT = '첫 쇼핑을 지원하는 3,000원 할인 회원가입 쿠폰';

  // 1. Inject CSS for immediate, smooth rendering without FOUC
  function injectStyles() {
    if (document.getElementById('haar-patch-styles')) return;
    var style = document.createElement('style');
    style.id = 'haar-patch-styles';
    style.textContent = [
      '.main_top_banner {',
      '  background-color: #111111 !important;',
      '  color: #ffffff !important;',
      '  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;',
      '}',
      '.main_top_banner.haar-visible {',
      '  display: block !important;',
      '}',
      '.main_top_banner.haar-hidden {',
      '  display: none !important;',
      '}',
      '.main_top_banner .top_banner_box_inner {',
      '  position: relative !important;',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  padding: 10px 20px !important;',
      '  max-width: 1440px !important;',
      '  margin: 0 auto !important;',
      '}',
      '.main_top_banner .top_banner_text {',
      '  flex: 1 !important;',
      '  text-align: center !important;',
      '  margin: 0 !important;',
      '}',
      '.main_top_banner .top_banner_text a {',
      '  color: #ffffff !important;',
      '  font-size: 12px !important;',
      '  font-weight: 500 !important;',
      '  letter-spacing: 0.05em !important;',
      '  text-decoration: none !important;',
      '  display: inline-block !important;',
      '  transition: opacity 0.2s ease !important;',
      '}',
      '.main_top_banner .top_banner_text a:hover {',
      '  opacity: 0.8 !important;',
      '}',
      '.main_top_banner .top_banner_close {',
      '  position: absolute !important;',
      '  right: 20px !important;',
      '  top: 50% !important;',
      '  transform: translateY(-50%) !important;',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  gap: 6px !important;',
      '  cursor: pointer !important;',
      '}',
      '.main_top_banner .top_banner_close label {',
      '  color: rgba(255, 255, 255, 0.6) !important;',
      '  font-size: 11px !important;',
      '  cursor: pointer !important;',
      '  margin: 0 !important;',
      '}',
      '.main_top_banner .top_banner_close .icoClose {',
      '  color: #ffffff !important;',
      '  cursor: pointer !important;',
      '  filter: brightness(0) invert(1) !important;',
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  function isBannerDismissed() {
    return document.cookie.split(';').some(function(item) {
      return item.trim().indexOf(BANNER_COOKIE_NAME + '=') === 0;
    });
  }

  function setBannerDismissed() {
    var date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = BANNER_COOKIE_NAME + '=1; expires=' + date.toUTCString() + '; path=/';
  }

  // 2. Patch Top Banner
  function patchBanner() {
    var banner = document.querySelector('.main_top_banner');
    if (!banner) return;

    if (isBannerDismissed()) {
      banner.classList.add('haar-hidden');
      banner.classList.remove('haar-visible');
      banner.style.display = 'none';
      return;
    }

    banner.classList.add('haar-visible');
    banner.classList.remove('haar-hidden');
    banner.style.display = 'block';
    banner.setAttribute('data-ez-display', 'visible');
    banner.classList.remove('ez-align-left');
    banner.classList.add('ez-align-center');

    var link = banner.querySelector('.top_banner_text a');
    if (link) {
      link.href = LOGIN_URL;
      link.setAttribute('data-href', LOGIN_URL);
      link.textContent = BANNER_TEXT;
      link.style.color = '#ffffff';
    }

    if (!banner.getAttribute('data-haar-bound')) {
      banner.setAttribute('data-haar-bound', 'true');
      var closeBox = banner.querySelector('.top_banner_close');
      if (closeBox) {
        closeBox.addEventListener('click', function(e) {
          var chk = banner.querySelector('#top_banner_box_cloase');
          if (chk && chk.checked) {
            setBannerDismissed();
          }
          banner.classList.add('haar-hidden');
          banner.classList.remove('haar-visible');
          banner.style.display = 'none';
        });
      }
    }
  }

  // 3. Patch GNB and Slide Menu Links
  function patchGnb() {
    var selectors = [
      '.top_category a',
      '#slide_add_category a',
      '.navigation-menu__category a',
      'nav[role="navigation"] a'
    ];
    var anchors = document.querySelectorAll(selectors.join(','));
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      if (a.textContent.trim().toUpperCase() === 'BRACELET') {
        var href = a.getAttribute('href');
        if (!href || href === '#' || href === '#none' || href.indexOf('BRACELET') === -1) {
          a.setAttribute('href', BRACELET_URL);
          if (a.getAttribute('data-href')) {
            a.setAttribute('data-href', BRACELET_URL);
          }
        }
      }
    }
  }

  function runPatches() {
    injectStyles();
    patchBanner();
    patchGnb();
  }

  // Run immediately and on DOM readiness
  injectStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPatches);
  } else {
    runPatches();
  }

  window.addEventListener('load', runPatches);

  // MutationObserver for SPA / dynamic menu toggle
  var observer = new MutationObserver(function(mutations) {
    patchBanner();
    patchGnb();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();
