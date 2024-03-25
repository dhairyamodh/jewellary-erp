import { useEffect, useState } from 'react';

function useQuery() {
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const query = window.location.search.substring(1);
    const params = {};
    query.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value);
    });
    setQueryParams(params);
  }, []);

  return queryParams;
}

export default useQuery;
