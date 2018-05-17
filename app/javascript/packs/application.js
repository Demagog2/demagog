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

document.addEventListener('DOMContentLoaded', function () {
  /**
   * Find closest parent of given element that has className
   * @param {HTMLElement} elem
   * @param {string} className
   * @return {HTMLElement}
   */
  function findClosest(elem, className) {
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
    var parent = findClosest(event.target, 'statement');
    if (parent) parent.classList.toggle('collapsed');

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
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.setAttribute('src', entry.target.getAttribute('data-src'));
      }
    });
  }

  var io = new IntersectionObserver(renderIntersectingImages);

  [].slice.call(document.querySelectorAll('img.lazy-load'))
    .forEach(io.observe.bind(io));
  

  /**
   * Run FB embed
   */
  function runFbCode(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/cs_CZ/sdk.js#xfbml=1&version=v2.7&appId=162983887479920";
    fjs.parentNode.insertBefore(js, fjs);
  };

  if (window.innerWidth >= 900) {
    var fbIo = new IntersectionObserver(renderFb);
    fbIo.observe(document.querySelector('#facebook'));

    function renderFb(entries) {
      if (entries[0].isIntersecting) {
        fbIo.unobserve(document.querySelector('#facebook'));
        runFbCode(document, 'script', 'facebook-jssdk');
      }
    }
  }


  /**
   * Run twitter embed
   */
  function runTwitterCode(d, s, id) {
    var js, fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
      js = d.createElement(s);
      js.id = id;
      js.src = p + '://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js,fjs);
    }
  }

  if (window.innerWidth >= 900) {
    var twIo = new IntersectionObserver(renderTwitter);
    twIo.observe(document.querySelector('#twitter'));

    function renderTwitter(entries) {
      if (entries[0].isIntersecting) {
        twIo.unobserve(document.querySelector('#twitter'));
        runTwitterCode(document,"script","twitter-wjs");
      }
    }
  }
});
