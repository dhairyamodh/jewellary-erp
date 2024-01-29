import { useState, useEffect } from 'react';

const useSearchParams = () => {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    // Listen for changes in the browser's history
    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  return searchParams;
};

export default useSearchParams;
