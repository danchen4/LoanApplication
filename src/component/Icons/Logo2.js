import React, { useState } from 'react';
import { COLOR } from '../../theme';

export const Logo2 = ({
  fillColor = '#000',
  defaultColor = COLOR.main.secondary,
  width = '3rem',
  height = '3rem',
}) => {
  const [toggleFillColor, setToggleFillColor] = useState(false);

  return (
    <div
      onMouseEnter={() => setToggleFillColor(true)}
      onMouseLeave={() => setToggleFillColor(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <svg
        data-name="Logo"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 100 100"
        aria-labelledby="logo"
        width={width}
        height={height}
      >
        <g id="card">
          <path
            fill={toggleFillColor ? fillColor : defaultColor}
            font-weight="bold"
            d="M72.4,69.4c3,0,5.5-2.5,5.5-5.5V50V38.9V36c0-3-2.5-5.5-5.5-5.5H27.6c-3,0-5.5,2.5-5.5,5.5v2.9V50v14c0,3,2.5,5.5,5.5,5.5  H72.4z M23.7,39.7h52.7v9.5H23.7V39.7z M27.6,32.1h44.9c2.2,0,3.9,1.8,3.9,3.9v2.1H23.7V36C23.7,33.9,25.4,32.1,27.6,32.1z M23.7,64  V50.8h52.7V64c0,2.2-1.8,3.9-3.9,3.9H27.6C25.4,67.9,23.7,66.1,23.7,64z"
          />
        </g>
      </svg>
    </div>
  );
};
