import React from 'react';

const IconPyTorch = (props) => (
  <svg viewBox="0 0 64 64" width="24" height="24" {...props}>
    <defs>
      <linearGradient id="g1" x1="0" x2="1">
        <stop offset="0%" stopColor="#EE4C2C" />
        <stop offset="100%" stopColor="#F7B500" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#g1)" />
    <path d="M20 36c0-8 12-12 18-6 6 6 2 18-6 18-10 0-12-10-12-12z" fill="#fff" />
  </svg>
);

export default IconPyTorch;
