// Copyright 2014-2015, University of Colorado Boulder

/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // constants
  const BUTTON_OPTIONS = {
    font: new RPALFont( 10 ),
    baseColor: 'red',
    textFill: 'white'
  };

  /**
   * @param {GameModel} model
   * @param {Object} [options]
   * @constructor
   */
  function DevGameControls( model, options ) {

    options = _.extend( {
      orientation: 'horizontal',
      spacing: 5
    }, options );

    // replays the current challenge
    const replayButton = new TextPushButton( '<', BUTTON_OPTIONS );
    replayButton.addListener( function() { model.replayCurrentChallenge(); } );

    // skips the current challenge
    const skipButton = new TextPushButton( '>', BUTTON_OPTIONS );
    skipButton.addListener( function() { model.skipCurrentChallenge(); } );

    options.children = [ replayButton, skipButton ];
    LayoutBox.call( this, options );
  }

  reactantsProductsAndLeftovers.register( 'DevGameControls', DevGameControls );

  return inherit( LayoutBox, DevGameControls );
} );
