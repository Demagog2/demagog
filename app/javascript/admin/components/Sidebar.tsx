/* eslint jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Classes, Colors } from '@blueprintjs/core';
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
      <div
        style={{
          position: 'fixed',
          height: '100vh',
          width: 270,
          backgroundColor: Colors.LIGHT_GRAY5,
          boxShadow: '1px 0 0 rgba(16, 22, 26, .15)',
          overflowY: 'auto',
        }}
      >
        {categories.map((category) => (
          <Authorize
            key={category.title}
            permissions={category.links.reduce(
              (carry, link) => [...carry, ...(link.permissions || [])],
              [],
            )}
          >
            <h6 style={{ paddingLeft: 15, marginTop: 30 }}>{category.title}</h6>

            <ul className={Classes.LIST_UNSTYLED}>
              {category.links.map((link) => (
                <Authorize key={link.to} permissions={link.permissions || []}>
                  <li>
                    {link.enabled ? (
                      <NavLink
                        to={link.to}
                        className={Classes.MENU_ITEM}
                        activeClassName={Classes.ACTIVE}
                        style={{ padding: '5px 15px' }}
                      >
                        <span>{link.title}</span>
                      </NavLink>
                    ) : (
                      <a
                        href=""
                        className={classNames(Classes.MENU_ITEM, Classes.DISABLED)}
                        style={{ padding: '5px 15px' }}
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
