import {
  Breadcrumbs as BlueprintBreadcrumbs,
  Classes,
  Colors,
  IBreadcrumbProps,
} from '@blueprintjs/core';
import { css, cx } from 'emotion';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }: { items: IBreadcrumbProps[] }) {
  return (
    <div
      className={css`
        background-color: ${Colors.LIGHT_GRAY5};
        margin: 0 -30px;
        padding: 6px 30px;
      `}
    >
      <BlueprintBreadcrumbs items={items} breadcrumbRenderer={renderBreadcrumb} />
    </div>
  );
}

const renderBreadcrumb = (breadcrumbProps: IBreadcrumbProps) => {
  return breadcrumbProps.href ? (
    <Link to={breadcrumbProps.href as string} className={Classes.BREADCRUMB}>
      {breadcrumbProps.text}
    </Link>
  ) : (
    <span className={cx(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)}>
      {breadcrumbProps.text}
    </span>
  );
};
