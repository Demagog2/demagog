import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { css, cx } from 'emotion';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { STATEMENT_TYPES } from '../../constants';
import Loading from '../Loading';
import { GetTags_tags } from '../../operation-result-types';

interface ITagsProps {
  loading: boolean;
  tags: GetTags_tags[];
}

export function Tags(props: ITagsProps) {
  if (props.loading) {
    return <Loading />;
  }

  return (
    <div
      className={css`
        padding: 15px 0 40px 0;
      `}
    >
      <div style={{ float: 'right' }}>
        <Link
          className={classNames(
            Classes.BUTTON,
            Classes.INTENT_PRIMARY,
            Classes.iconClass(IconNames.PLUS),
            css`
              margin-left: 7px;
            `,
          )}
          to="/admin/tags/new"
          role="button"
        >
          Přidat štítek
        </Link>
      </div>

      <h2 className={Classes.HEADING}>Štítky</h2>

      <table
        className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE_CONDENSED)}
        style={{ width: '100%' }}
      >
        <thead>
          <tr>
            <th scope="col">Název</th>
            <th scope="col">Pro výroky typu</th>
            <th scope="col">Výroků (jen zveřejněné/všechny)</th>
          </tr>
        </thead>
        <tbody>
          {props.tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              <td>{STATEMENT_TYPES[tag.forStatementType]}</td>
              <td>
                {tag.publishedStatementsCount} / {tag.allStatementsCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
