/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
