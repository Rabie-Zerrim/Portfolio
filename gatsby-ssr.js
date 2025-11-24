const React = require('react');

// Inject Plausible analytics snippet in production using the exact snippet provided
exports.onRenderBody = ({ setHeadComponents }) => {
  if (process.env.NODE_ENV !== 'production') {return;}

  setHeadComponents([
    React.createElement('script', {
      key: 'plausible-src',
      async: true,
      src: 'https://plausible.io/js/pa-8sbWsEH27Ha12M3FByMLT.js',
    }),
    React.createElement('script', {
      key: 'plausible-init',
      dangerouslySetInnerHTML: {
        __html:
          'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}}; plausible.init()',
      },
    }),
  ]);
};
