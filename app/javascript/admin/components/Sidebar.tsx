/* eslint jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';
import { NavLink } from 'react-router-dom';

const categories = [
  {
    title: 'Výstupy',
    links: [
      { to: '/admin/articles', title: 'Články' },
      { to: '/admin/tags', title: 'Štítky' },
      { to: '/admin/statements', title: 'Výroky', enabled: true },
      { to: '/admin/visualizations', title: 'Vizualizace' },
      { to: '/admin/images', title: 'Obrázky' },
    ],
  },
  {
    title: 'Kontext',
    links: [
      { to: '/admin/speakers', title: 'Lidé', enabled: true },
      { to: '/admin/bodies', title: 'Strany a skupiny', enabled: true },
      { to: '/admin/media', title: 'Pořady' },
    ],
  },
  {
    title: 'O nás',
    links: [
      { to: '/admin/users', title: 'Tým', enabled: true },
      { to: '/admin/availability', title: 'Dostupnost' },
      { to: '/admin/pages', title: 'Stránky' },
      { to: '/admin/navigation', title: 'Menu' },
    ],
  },
];

export default function Sidebar() {
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink exact className="nav-link" to="/admin">
              Přehled
            </NavLink>
          </li>
        </ul>

        {categories.map((category) => (
          <React.Fragment key={category.title}>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>{category.title}</span>
            </h6>

            <ul className="nav flex-column">
              {category.links.map((link) => (
                <li key={link.to} className="nav-item">
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
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
