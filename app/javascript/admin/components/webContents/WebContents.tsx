import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { cx } from 'emotion';
import * as React from 'react';
import { useQuery } from 'react-apollo';
import { Link } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import type * as ResultTypes from '../../operation-result-types';
import { GetWebContents } from '../../queries/queries';

const WebContents = () => {
  const { data: dataGetWebContents } = useQuery<ResultTypes.GetWebContents>(GetWebContents, {
    fetchPolicy: 'cache-and-network',
  });

  const breadcrumbs = [{ text: 'Webový obsah' }];

  if (!dataGetWebContents) {
    return null;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div style={{ padding: '15px 0 40px 0' }}>
        <table
          className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
          style={{ width: '100%' }}
        >
          <thead>
            <tr>
              <th scope="col">Název části webu nebo stránky</th>
              <th scope="col">URL</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {dataGetWebContents.webContents.map((webContent) => (
              <tr key={webContent.id}>
                <td>{webContent.name}</td>
                <td>
                  {webContent.urlPath && (
                    <a href={`https://demagog.cz${webContent.urlPath}`} target="_blank" rel="noreferrer">
                      https://demagog.cz{webContent.urlPath}
                    </a>
                  )}
                </td>
                <td>
                  <Link
                    to={`/admin/web-contents/edit/${webContent.id}`}
                    className={cx(Classes.BUTTON, Classes.iconClass(IconNames.EDIT))}
                  >
                    Upravit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WebContents;
