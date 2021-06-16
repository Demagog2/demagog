import { useCallback, useEffect, useState } from 'react';
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
    if (queryParams.filter) {
      setState(queryParams.filter);
    }
  }, [location]);

  const onStatementsFilterUpdate = useCallback((filter: string) => {
    setState(filter);

    // Make sure we update the url after the state is changed
    // so the location change listener can detect that the state
    // is already set
    history.push(`${history.location.pathname}?filter=${filter}`);
  }, []);

  const onRemoveStatementsFilters = useCallback(() => {
    setState(null);

    // Reset the search part of location
    history.push(history.location.pathname);
  }, []);

  return {
    state,
    onStatementsFilterUpdate,
    onRemoveStatementsFilters,
  };
}
