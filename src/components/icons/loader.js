import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      {/* Hexagon outline */}
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M 50,5
           L 11,27
           L 11,72
           L 50,95
           L 89,73
           L 89,28
           Z"
      />
      
      {/* Letter R */}
      <g id="R" transform="translate(39, 25) scale(1.1)">
        {/* Vertical line */}
        <path
          d="M 0 0 L 0 40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top rounded part */}
        <path
          d="M 0 0 Q 20 0 20 15 Q 20 30 0 30"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Leg kick */}
        <path
          d="M 0 30 L 20 40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </g>
  </svg>
);

export default IconLoader;
