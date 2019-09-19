// Copyright 2014-2018, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  var RPALQueryParameters = QueryStringMachine.getAll( {

    // plays all reactions for each level of the game
    playAll: { type: 'flag' }
  } );

  reactantsProductsAndLeftovers.register( 'RPALQueryParameters', RPALQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( RPALQueryParameters, null, 2 ) );

  return RPALQueryParameters;
} );
