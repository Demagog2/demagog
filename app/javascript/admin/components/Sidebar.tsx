/* eslint jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';
import { NavLink } from 'react-router-dom';

import Authorize from './Authorize';

const categories = [
  {
    title: 'Výstupy',
    links: [
      { to: '/admin/articles', title: 'Články', permissions: ['articles:view'] },
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
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        {/* TODO: uncomment when we have something useful at home screen */}
        {/* <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink exact className="nav-link" to="/admin">
              Přehled
            </NavLink>
          </li>
        </ul> */}

        {categories.map((category) => (
          <Authorize
            key={category.title}
            permissions={category.links.reduce(
              (carry, link) => [...carry, ...(link.permissions || [])],
              [],
            )}
          >
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>{category.title}</span>
            </h6>

            <ul className="nav flex-column">
              {category.links.map((link) => (
                <Authorize key={link.to} permissions={link.permissions || []}>
                  <li className="nav-item">
                    {link.enabled ? (
                      <NavLink className="nav-link" to={link.to}>
                        {link.title}
                      </NavLink>
                    ) : (
                      <span
                        title="Coming soon"
                        style={{ cursor: 'pointer' }}
                        className="nav-link disabled"
                      >
                        {link.title}
                      </span>
                    )}
                  </li>
                </Authorize>
              ))}
            </ul>
          </Authorize>
        ))}
      </div>
    </nav>
  );
}
