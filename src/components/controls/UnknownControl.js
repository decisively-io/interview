import React from 'react';

const UnknownControl = ({control}) => {
  console.log('control', control);
  return (
    <p>Unknown Control: {control.type}</p>
  )
}

export default UnknownControl;