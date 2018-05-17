/* eslint-env browser */

// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


var t = {
  hideReasons: "skrýt odůvodnění",
  showReasons: "zobrazit odůvodnění",
}

import 'intersection-observer/intersection-observer'


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

  [].slice.call(document.querySelectorAll('.statement'))
    .forEach(function (statement) {
      var link = document.createElement('A');
      link.classList.add('show-reasons');
      link.innerHTML = '<span class="open">' + t.hideReasons + '</span>' 
        + '<span class="collapsed">' + t.showReasons + '</span>';
      link.setAttribute('href', '#');
      link.addEventListener('click', showAssessment);

      var utils = statement.querySelector('.utils');
      utils.insertBefore(link, utils.firstChild);

      if (!statement.classList.contains('important-statement')) statement.classList.add('collapsed');
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

  [].slice.call(document.querySelectorAll('img.lazy-load'))
    .forEach(io.observe.bind(io));
  

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
  lazySocials(
    document.querySelector('#facebook'),
    function () {
      var id = 'facebook-jssdk';
      var fjs = document.getElementsByTagName('script')[0];
      if (document.getElementById(id)) return;
      var js = document.createElement('script'); 
      js.id = id;
      js.src = "//connect.facebook.net/cs_CZ/sdk.js#xfbml=1&version=v2.7&appId=162983887479920";
      fjs.parentNode.insertBefore(js, fjs);
    }
  );

  /**
   * Run twitter embed
   */
  lazySocials(
    document.querySelector('#twitter'),
    function () {
      var js;
      var id = 'twitter-wjs';
      var fjs = document.getElementsByTagName('script')[0];
      var p = /^http:/.test(document.location) ? 'http' : 'https';
      
      if (!document.getElementById(id)) {
        js = document.createElement('script');
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js,fjs);
      }
    }
  );
});
