import React from 'react';

const ImageControl = ({control }) => {
  if (!control.image) return null;
  return <img src={`data:image/jpeg;base64,${control.image}`} />
}
export default ImageControl;