// Copyright 2014-2015, University of Colorado Boulder

/**
 * Enum for the 2 boxes that represent the 2 states of a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  const BoxType = {
    BEFORE: 'BEFORE', // before the reaction started
    AFTER: 'AFTER' // after the reaction completes
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BoxType ); }

  reactantsProductsAndLeftovers.register( 'BoxType', BoxType );

  return BoxType;
} );