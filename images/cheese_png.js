/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;