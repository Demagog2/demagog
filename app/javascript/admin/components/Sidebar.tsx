/* eslint jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Classes, Colors } from '@blueprintjs/core';
import { css, cx } from 'emotion';
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
      { to: '/admin/images', title: 'Obrázky', enabled: true, permissions: ['images:view'] },
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
      { to: '/admin/media', title: 'Pořady', enabled: true, permissions: ['media:view'] },
    ],
  },
  {
    title: 'O nás',
    links: [
      { to: '/admin/users', title: 'Tým', enabled: true, permissions: ['users:view'] },
      { to: '/admin/availability', title: 'Dostupnost', permissions: ['availability:view'] },
      { to: '/admin/pages', title: 'Stránky', enabled: true, permissions: ['pages:view'] },
      { to: '/admin/navigation', title: 'Menu', permissions: ['menu:view'] },
    ],
  },
];

export default function Sidebar() {
  return (
    <div style={{ flexBasis: 230, flexGrow: 0, flexShrink: 0 }}>
      <div
        className={css`
          position: fixed;
          height: 100vh;
          width: 230px;
          background-color: ${Colors.LIGHT_GRAY5};
          box-shadow: 1px 0 0 rgba(16, 22, 26, 0.15);
          overflow-y: auto;
          padding: 0 15px;
        `}
      >
        {categories.map((category) => (
          <Authorize
            key={category.title}
            permissions={category.links.reduce(
              (carry, link) => [...carry, ...(link.permissions || [])],
              [],
            )}
          >
            <h6
              className={cx(
                Classes.HEADING,
                css`
                  padding-left: 15px;
                  margin-top: 30px;
                  text-transform: uppercase;
                  color: ${Colors.GRAY2};
                  font-size: 11px !important;
                  font-weight: bold;
                `,
              )}
            >
              {category.title}
            </h6>

            <ul
              className={cx(
                Classes.LIST_UNSTYLED,
                css`
                  .${Classes.MENU_ITEM} {
                    padding: 5px 15px;
                  }

                  .${Classes.MENU_ITEM}.${Classes.ACTIVE} {
                    background-color: transparent;
                    color: ${Colors.BLUE3};
                    font-weight: bold;
                  }

                  .${Classes.MENU_ITEM + ':hover'} {
                    background-color: transparent;
                    font-weight: bold;
                  }

                  .${Classes.MENU_ITEM}.${Classes.DISABLED} {
                    background-color: transparent;
                    font-weight: normal;
                  }
                `,
              )}
            >
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
                        className={cx(Classes.MENU_ITEM, Classes.DISABLED)}
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
