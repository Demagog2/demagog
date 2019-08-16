import { Controller } from 'stimulus';
import tippy from 'tippy.js/umd/index.js';

export default class extends Controller {
  static targets = ['mobileNavigation', 'desktopNavigationMenuItemButton'];

  initialize() {
    this.desktopNavigationMenuItemButtonTargets.forEach((el) => {
      tippy(el, {
        appendTo: 'parent',
        boundary: document.querySelector('body'),
        content: (menuItemButtonEl) => {
          const submenuItemsEl = menuItemButtonEl.parentElement.querySelector('.submenu-items');
          return document.importNode(submenuItemsEl, true);
        },
        duration: 0,
        flip: false,
        interactive: true,
        interactiveBorder: 0,
        onHidden: (tippyInstance) => {
          tippyInstance.reference.setAttribute('aria-expanded', 'false');
        },
        onShown: (tippyInstance) => {
          tippyInstance.reference.setAttribute('aria-expanded', 'true');
        },
        placement: 'bottom-start',
        role: 'menu',
      });
    });
  }

  toggleMobileNavigationMenu(e) {
    this.mobileNavigationTarget.classList.toggle('open');

    e.stopPropagation();
    e.preventDefault();
  }
}
