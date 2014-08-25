// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ReactionBarNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBarNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var IntegerSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/IntegerSpinner' );//XXX

  /**
   * @param {MoleculesModel} model
   * @constructor
   */
  function MoleculesView( model ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    var reactionBarNode = new ReactionBarNode( model.reactionProperty, model.reactions, this.layoutBounds.width );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      }
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      reactionBarNode,
      resetAllButton
    ] } );
    thisView.addChild( rootNode );

    // layout of the reaction bar is determined by a query parameter
    var playAreaTop, playAreaBottom;
    if ( RPALQueryParameters.EQUATION === 'bottom' ) {
      reactionBarNode.bottom = this.layoutBounds.bottom;
      playAreaTop = this.layoutBounds.top;
      playAreaBottom = reactionBarNode.top;
    }
    else {
      reactionBarNode.top = this.layoutBounds.top;
      playAreaTop = reactionBarNode.bottom;
      playAreaBottom = this.layoutBounds.bottom;
    }

    // remainder of layout
    resetAllButton.right = this.layoutBounds.right - 10;
    resetAllButton.bottom = playAreaBottom - 10;

    var Property = require( 'AXON/Property' );
    var Range = require( 'DOT/Range' );
    var integerSpinner = new IntegerSpinner( new Property( 5 ), new Range( 0, 8 ), { left: 100, top: 100 } );
    rootNode.addChild( integerSpinner );
  }

  return inherit( ScreenView, MoleculesView );
} );
