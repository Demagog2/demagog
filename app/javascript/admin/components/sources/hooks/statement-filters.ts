import React, { useCallback, useEffect, useState } from 'react';
import * as queryString from 'query-string';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';

export function useStatementFilters() {
  const [state, setState] = useState<any | null>(null);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!location.search) {
      return setState(null);
    }

    const queryParams = queryString.parse(location.search);
    if (!queryParams.filter) {
      return;
    }

    let filter;
    try {
      filter = JSON.parse(queryParams.filter as string);
    } catch (e) {
      return;
    }

    if (filter.field !== undefined && filter.value !== undefined) {
      setState({ field: filter.field, value: filter.value });
    }
  }, [location]);

  const onStatementsFilterUpdate = useCallback(
    (field: string, value: any) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const statementsFilter = { field, value };

      setState({ statementsFilter });

      // Make sure we update the url after the state is changed
      // so the location change listener can detect that the state
      // is already set
      history.push(
        history.location.pathname +
          '?filter=' +
          encodeURIComponent(JSON.stringify(statementsFilter)),
      );

      event.preventDefault();
      return false;
    },
    [],
  );

  const onRemoveStatementsFilters = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    setState({ statementsFilter: null });

    // Reset the search part of location
    history.push(history.location.pathname);

    event.preventDefault();
    return false;
  }, []);

  return {
    state,
    onStatementsFilterUpdate,
    onRemoveStatementsFilters,
  };
}
