import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import qs from "qs";

// Adapted from https://stackoverflow.com/a/73648393/7337283
function usePersistantState(key, initialValue) {
  const [state, setInternalState] = useState(initialValue);

  useEffect(() => {
    const value = localStorage.getItem(key);
    if (!value) return;
    setInternalState(JSON.parse(value));
  }, [key]);

  const setState = (value) => {
    localStorage.setItem(key, JSON.stringify(value));
    setInternalState(value);
  };

  return [state, setState];
}

// Adapted from https://www.inkoop.io/blog/syncing-query-parameters-with-react-state/
function useQueryState(query) {
  const location = useLocation();
  const navigate = useNavigate();

  const setQuery = useCallback(
    (value) => {
      const existingQueries = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      const queryString = qs.stringify({ ...existingQueries, [query]: value }, { skipNulls: true });
      navigate(`${location.pathname}?${queryString}`);
    },
    [navigate, location, query],
  );
  return [qs.parse(location.search, { ignoreQueryPrefix: true })[query], setQuery];
}

export { usePersistantState, useQueryState };
