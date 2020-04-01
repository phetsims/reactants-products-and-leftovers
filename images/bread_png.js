/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
