/* eslint-env browser */

import '@babel/polyfill';

// NodeList.forEach is in core-js v3, but since we are using still v2 through
// webpacker/babel-preset-env, we just polyfill it ourselves here
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Polyfills Element.closest and Element.matches which Stimulus need.
// We are not using the @stimulus/polyfills package, because it contains
// some core-js polyfills which would be duplicate, because we are already
// adding them via babel
import elementClosestPolyfill from 'element-closest';
elementClosestPolyfill(window);

// Needed for Element.classList.toggle's second parameter to work in IE11
import 'classlist-polyfill';

// Replaces all css variables (var(--my-var)) with actual values in
// browsers which do not support css variables, like IE11
import cssVars from 'css-vars-ponyfill';
cssVars();

import 'intersection-observer/intersection-observer';

import '../application';

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Find closest parent of given element that has className
   * @param {HTMLElement} elem
   * @param {string} className
   * @return {HTMLElement}
   */
  function findClosest(elem, className) {
    // eslint-disable-next-line no-param-reassign
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.classList.contains(className)) {
        return elem;
      }
    }

    return null;
  }

  /**
   * Shows assessment of given statement
   * @param {Event} event
   */
  function showAssessment(event) {
    const parent = findClosest(event.target, 'statement');

    if (parent) {
      parent.classList.toggle('collapsed');
    }

    event.preventDefault();
    event.stopPropagation();
  }

  [].slice.call(document.querySelectorAll('.statement')).forEach(function(statement) {
    var blockquote = statement.querySelector('.statement-content > blockquote');

    // 44px means that the quote is one-liner
    if (blockquote.clientHeight === 44) {
      statement.classList.add('oneliner-statement');
    }

    var link = statement.querySelector('.show-reasons');
    link.addEventListener('click', showAssessment);

    // Show the full explanation only when short explanation is not present
    // and the statement is marked as important.
    if (
      !statement.classList.contains('important-statement') ||
      statement.querySelector('.reasons-short')
    ) {
      statement.classList.add('collapsed');
    }
  });

  [].slice
    .call(document.querySelectorAll('.container-statement-show'))
    .forEach(function(statementDetail) {
      var blockquote = statementDetail.querySelector('.statement-content > blockquote');

      // 63px means that the quote is one-liner
      if (blockquote.clientHeight === 63) {
        statementDetail.classList.add('oneliner-statement');
      }
    });

  /**
   * Render images if they are in the view port
   * @param {IntersectionObserverEntry[]} entries
   */
  function renderIntersectingImages(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('src', entry.target.getAttribute('data-src'));
      }
    });
  }

  const io = new IntersectionObserver(renderIntersectingImages);

  [].slice.call(document.querySelectorAll('img.lazy-load')).forEach(io.observe.bind(io));

  function lazySocials(el, code) {
    if (window.innerWidth >= 900 && el) {
      var fbIo = new IntersectionObserver(renderFb);
      fbIo.observe(el);

      function renderFb(entries) {
        if (entries[0].isIntersecting) {
          fbIo.unobserve(el);
          code();
        }
      }
    }
  }

  /**
   * Run FB embed
   */
  lazySocials(document.querySelector('#facebook'), function() {
    var id = 'facebook-jssdk';
    var fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById(id)) return;
    var js = document.createElement('script');
    js.id = id;
    js.src = '//connect.facebook.net/cs_CZ/sdk.js#xfbml=1&version=v2.7&appId=162983887479920';
    fjs.parentNode.insertBefore(js, fjs);
  });

  /**
   * Run twitter embed
   */
  lazySocials(document.querySelector('#twitter'), function() {
    var js;
    var id = 'twitter-wjs';
    var fjs = document.getElementsByTagName('script')[0];
    var p = /^http:/.test(document.location) ? 'http' : 'https';

    if (!document.getElementById(id)) {
      js = document.createElement('script');
      js.id = id;
      js.src = p + '://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js, fjs);
    }
  });
});
