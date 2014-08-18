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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReactionBarNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBarNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {MoleculesModel} model
   * @constructor
   */
  function MoleculesView( model ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    var reactionChoiceNode = new ReactionBarNode( model.reactionProperty, model.reactions, this.layoutBounds.width,
      { bottom: this.layoutBounds.bottom } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      }
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      reactionChoiceNode,
      resetAllButton
    ] } );
    thisView.addChild( rootNode );

    // layout
    resetAllButton.right = this.layoutBounds.right - 20;
    resetAllButton.bottom = reactionChoiceNode.top - 20;
  }

  return inherit( ScreenView, MoleculesView, { layoutBounds: RPALConstants.LAYOUT_BOUNDS } );
} );
