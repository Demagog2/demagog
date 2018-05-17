import * as React from 'react';

export default function Header() {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/admin">
        Demagog.cz
      </a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <a className="nav-link" data-method="delete" href="/sign_out">
            Odhlásit se
          </a>
        </li>
      </ul>
    </nav>
  );
}
