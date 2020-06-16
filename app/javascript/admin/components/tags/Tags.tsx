import { Classes } from '@blueprintjs/core';
import * as React from 'react';
import { css, cx } from 'emotion';

import { STATEMENT_TYPES } from '../../constants';
import { useTags } from '../../queriesHooks';
import Loading from '../Loading';

const Tags = () => {
  const { tags } = useTags();

  if (!tags) {
    return <Loading />;
  }

  return (
    <div
      className={css`
        padding: 15px 0 40px 0;
      `}
    >
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
            {/* <th scope="col" /> */}
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              <td>{STATEMENT_TYPES[tag.forStatementType]}</td>
              <td>
                {tag.publishedStatementsCount} / {tag.allStatementsCount}
              </td>
              {/* <td
                className={css`
                  display: flex;
                  justify-content: flex-end;
                `}
              >
                <Link
                  to={`/admin/tags/edit/${tag.id}`}
                  className={cx(Classes.BUTTON, Classes.iconClass(IconNames.EDIT))}
                >
                  Upravit
                </Link>
                <Button
                  icon={IconNames.TRASH}
                  onClick={this.showConfirmDeleteModal(tag.id)}
                  title="Smazat"
                  style={{ marginLeft: 7 }}
                />
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tags;
