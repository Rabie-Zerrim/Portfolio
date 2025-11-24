import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';

const Loader = ({ finishLoading }) => {
  // Toggle `body.hidden` while the loader is mounted. Avoid writing
  // this class into the static HTML (was previously done via Helmet)
  // so that if hydration fails the page isn't permanently hidden.
  useEffect(() => {
    document.body.classList.add('hidden');
    return () => {
      document.body.classList.remove('hidden');
    };
  }, []);

  return <LoadingScreen isLoading={true} onLoadComplete={finishLoading} />;
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
