import React from 'react';

const ImageControl = ({control }) => {
  
  return <img src={`data:image/jpeg;base64,${control.image}`} />
}
export default ImageControl;