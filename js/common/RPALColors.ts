// Copyright 2014-2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

const DARK_BLUE = new Color( 51, 118, 196 );

const RPALColors = {

  screenBackgroundColorProperty: new ProfileColorProperty( reactantsProductsAndLeftovers, 'screenBackgroundColor', {
    default: 'rgb( 218, 236, 255 )'
  } ),

  statusBarFillProperty: new ProfileColorProperty( reactantsProductsAndLeftovers, 'statusBarFill', {
    default: DARK_BLUE
  } ),

  bracketStrokeProperty: new ProfileColorProperty( reactantsProductsAndLeftovers, 'bracketStroke', {
    default: DARK_BLUE
  } ),

  boxFillProperty: new ProfileColorProperty( reactantsProductsAndLeftovers, 'boxFill', {
    default: 'white'
  } ),

  boxStrokeProperty: new ProfileColorProperty( reactantsProductsAndLeftovers, 'boxStroke', {
    default: DARK_BLUE.withAlpha( 0.3 )
  } )
};

reactantsProductsAndLeftovers.register( 'RPALColors', RPALColors );
export default RPALColors;