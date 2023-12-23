import { useEffect, useState } from 'react';

const useMediaQuery = (query: string) => {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    const handleChange = () => {
      setMatch(matchMedia.matches);
    };

    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return match;
};

export type UseMediaQueryReturn = ReturnType<typeof useMediaQuery>;

export { useMediaQuery };
