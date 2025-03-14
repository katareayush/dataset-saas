import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-screen-xl mx-auto px-5 ${className}`}>
      {children}
    </div>
  );
};

export default Container;