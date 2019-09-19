// Copyright 2014-2018, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Range = require( 'DOT/Range' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  const RPALConstants = {

    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 835, 504 ) },
    MOLECULE_OPTIONS: { atomOptions: { stroke: 'black', lineWidth: 0.5, scale: 1 } },
    QUANTITY_RANGE: new Range( 0, 8 ),
    SANDWICH_COEFFICIENT_RANGE: new Range( 0, 3 ),
    RESET_ALL_BUTTON_SCALE: 0.75,

    // box size requested to be configurable per screen
    SANDWICHES_BEFORE_AFTER_BOX_SIZE: new Dimension2( 310, 240 ),
    MOLECULES_BEFORE_AFTER_BOX_SIZE: new Dimension2( 310, 240 ),
    GAME_BEFORE_AFTER_BOX_SIZE: new Dimension2( 330, 240 )
  };

  reactantsProductsAndLeftovers.register( 'RPALConstants', RPALConstants );

  return RPALConstants;
} );
