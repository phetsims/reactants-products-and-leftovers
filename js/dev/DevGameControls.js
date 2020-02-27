// Copyright 2014-2019, University of Colorado Boulder

/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // constants
  const BUTTON_OPTIONS = {
    font: new RPALFont( 10 ),
    baseColor: 'red',
    textFill: 'white'
  };

  class DevGameControls extends LayoutBox {

    /**
     * @param {GameModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = merge( {
        orientation: 'horizontal',
        spacing: 5
      }, options );

      // replays the current challenge
      const replayButton = new TextPushButton( '<', BUTTON_OPTIONS );
      replayButton.addListener( () => model.replayCurrentChallenge() );

      // skips the current challenge
      const skipButton = new TextPushButton( '>', BUTTON_OPTIONS );
      skipButton.addListener( () => model.skipCurrentChallenge() );

      options.children = [ replayButton, skipButton ];
      super( options );
    }
  }

  return reactantsProductsAndLeftovers.register( 'DevGameControls', DevGameControls );
} );
