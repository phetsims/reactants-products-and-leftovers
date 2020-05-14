// Copyright 2014-2020, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';

const RPALQueryParameters = QueryStringMachine.getAll( {

  // Plays all reactions for each level of the game.
  // For internal use only.
  playAll: { type: 'flag' }
} );

reactantsProductsAndLeftovers.register( 'RPALQueryParameters', RPALQueryParameters );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( RPALQueryParameters, null, 2 ) );

export default RPALQueryParameters;