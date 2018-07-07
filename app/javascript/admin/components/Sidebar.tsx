/* eslint jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import Authorize from './Authorize';

const categories = [
  {
    title: 'Výstupy',
    links: [
      { to: '/admin/articles', title: 'Články', enabled: true, permissions: ['articles:view'] },
      { to: '/admin/tags', title: 'Štítky', permissions: ['tags:view'] },
      { to: '/admin/sources', title: 'Výroky', enabled: true, permissions: ['sources:view'] },
      { to: '/admin/visualizations', title: 'Vizualizace', permissions: ['visualizations:view'] },
      { to: '/admin/images', title: 'Obrázky', permissions: ['images:view'] },
    ],
  },
  {
    title: 'Kontext',
    links: [
      { to: '/admin/speakers', title: 'Lidé', enabled: true, permissions: ['speakers:view'] },
      {
        to: '/admin/bodies',
        title: 'Strany a skupiny',
        enabled: true,
        permissions: ['bodies:view'],
      },
      { to: '/admin/media', title: 'Pořady', permissions: ['media:view'] },
    ],
  },
  {
    title: 'O nás',
    links: [
      { to: '/admin/users', title: 'Tým', enabled: true, permissions: ['users:view'] },
      { to: '/admin/availability', title: 'Dostupnost', permissions: ['availability:view'] },
      { to: '/admin/pages', title: 'Stránky', permissions: ['pages:view'] },
      { to: '/admin/navigation', title: 'Menu', permissions: ['menu:view'] },
    ],
  },
];

export default function Sidebar() {
  return (
    <div style={{ flexBasis: 270, flexGrow: 0, flexShrink: 0 }}>
      <div className="sidebar">
        {categories.map((category) => (
          <Authorize
            key={category.title}
            permissions={category.links.reduce(
              (carry, link) => [...carry, ...(link.permissions || [])],
              [],
            )}
          >
            <h6 className="sidebar-menu-title">{category.title}</h6>

            <ul className={classNames(Classes.LIST_UNSTYLED, 'sidebar-menu')}>
              {category.links.map((link) => (
                <Authorize key={link.to} permissions={link.permissions || []}>
                  <li>
                    {link.enabled ? (
                      <NavLink
                        to={link.to}
                        className={Classes.MENU_ITEM}
                        activeClassName={Classes.ACTIVE}
                      >
                        <span>{link.title}</span>
                      </NavLink>
                    ) : (
                      <a
                        href=""
                        className={classNames(Classes.MENU_ITEM, Classes.DISABLED)}
                        onClick={(e) => e.preventDefault()}
                      >
                        <span>{link.title}</span>
                      </a>
                    )}
                  </li>
                </Authorize>
              ))}
            </ul>
          </Authorize>
        ))}
      </div>
    </div>
  );
}
