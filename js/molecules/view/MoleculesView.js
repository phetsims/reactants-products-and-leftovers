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
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesEquationNode' );
  var ReactionView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionView' );
  var BeforeAfterNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/BeforeAfterNode' );

  /**
   * @param {MoleculesModel} model
   * @constructor
   */
  function MoleculesView( model ) {

    var thisView = this;
    ReactionView.call( thisView, model,
      function( reaction ) { return new MoleculesEquationNode( reaction ); } );

    // When the reaction changes, create new Before/After boxes
    var beforeAfterNode;
    model.reactionProperty.link( function( reaction ) {

      // dispose of the previous boxes
      if ( beforeAfterNode ) {
        beforeAfterNode.dispose();
        thisView.removeChild( beforeAfterNode );
      }

      // create the new boxes
      beforeAfterNode = new BeforeAfterNode( reaction,
        thisView.viewProperties.beforeExpandedProperty,
        thisView.viewProperties.afterExpandedProperty,
        { left: 40, top: thisView.playAreaTop + 10 } );
      thisView.addChild( beforeAfterNode );
    } );
  }

  return inherit( ReactionView, MoleculesView );
} );
