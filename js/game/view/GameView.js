// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {GameModel} model
   * @constructor
   */
  function GameView( model ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    //TODO remove this
    thisView.addChild( new Text( 'Game: under construction', { font: new RPALFont( 36 ), center: this.layoutBounds.center } ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
      }
    } );
    thisView.addChild( resetAllButton );
    resetAllButton.right = thisView.layoutBounds.right - 10;
    resetAllButton.bottom = thisView.layoutBounds.bottom - 10;
  }

  return inherit( ScreenView, GameView );
} );
