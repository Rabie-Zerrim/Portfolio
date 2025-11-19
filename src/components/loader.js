import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';

const Loader = ({ finishLoading }) => {
  return (
    <>
      <Helmet bodyAttributes={{ class: `hidden` }} />
      <LoadingScreen isLoading={true} onLoadComplete={finishLoading} />
    </>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
