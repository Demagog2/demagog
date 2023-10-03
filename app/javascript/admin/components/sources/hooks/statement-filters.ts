import { useCallback, useEffect, useState } from 'react';
import * as queryString from 'query-string';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

export function useStatementFilters() {
  const [state, setState] = useState<any | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.search) {
      setState(null); return;
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
    navigate(`${location.pathname}?filter=${filter}`);
  }, []);

  const onRemoveStatementsFilters = useCallback(() => {
    setState(null);

    // Reset the search part of location
    navigate(location.pathname);
  }, []);

  return {
    state,
    onStatementsFilterUpdate,
    onRemoveStatementsFilters,
  };
}
