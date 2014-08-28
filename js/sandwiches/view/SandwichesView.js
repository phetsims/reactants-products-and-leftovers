// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {SandwichesModel} model
   * @constructor
   */
  function SandwichesView( model ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    //TODO remove this
    thisView.addChild( new Text( 'Sandwiches: under construction', { font: new RPALFont( 36 ), center: this.layoutBounds.center } ) );

    var resetAllButton = new ResetAllButton( {
      scale: RPALConstants.RESET_ALL_BUTTON_SCALE,
      listener: function() {
        model.reset();
      }
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      resetAllButton
    ] } );
    thisView.addChild( rootNode );

    // layout
    resetAllButton.left = this.layoutBounds.left + 10;
    resetAllButton.bottom = this.layoutBounds.bottom - 10;
  }

  return inherit( ScreenView, SandwichesView );
} );
