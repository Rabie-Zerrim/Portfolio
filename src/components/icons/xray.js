import React from 'react';

const IconXRay = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
    <rect width="24" height="24" fill="#6B7280" rx="4" />
    <g fill="none" fillRule="evenodd">
      <rect width="24" height="24" fill="transparent" />
      <circle cx="12" cy="12" r="9" fill="#2D2D2D" />
      <path d="M6 12h12M12 6v12" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="12" y="16" fontSize="7" textAnchor="middle" fill="#FFF">XR</text>
    </g>
  </svg>
);

export default IconXRay;
