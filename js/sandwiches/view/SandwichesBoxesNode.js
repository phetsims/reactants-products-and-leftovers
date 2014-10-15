// Copyright 2002-2014, University of Colorado Boulder

/**
 * Before/After boxes for the 'Sandwiches' screen.
 * This is a specialization of ReactionBoxesNode that handles sandwiches with mutable coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ReactionBoxesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionBoxesNode' );
  var SandwichRecipe = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichRecipe' );

  /**
   * @param {SandwichRecipe} reaction the sandwich recipe (reaction) to be displayed
   * @param {Property.<boolean>} beforeExpandedProperty whether the 'before' box is expanded
   * @param {Property.<boolean>} afterExpandedProperty whether the 'after' box is expanded
   * @param {Object} [options]
   * @constructor
   */
  function SandwichesBoxesNode( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {

    assert && assert( reaction instanceof SandwichRecipe );

    var thisNode = this;
    ReactionBoxesNode.call( thisNode, reaction, beforeExpandedProperty, afterExpandedProperty, options );

    // Update the sandwich image when it changes
    if ( thisNode.reaction.coefficientsMutable ) {
      thisNode.nodePropertyObserver = function( node ) {
        thisNode.setNodeForProduct( node, 0 /* productIndex */ );
      };
      thisNode.reaction.sandwich.nodeProperty.link( thisNode.nodePropertyObserver );
    }
  }

  return inherit( ReactionBoxesNode, SandwichesBoxesNode, {

    // @public Unlinks from properties. This object is no longer functional after calling this function.
    dispose: function() {
      ReactionBoxesNode.prototype.dispose.call( this );
      if ( this.reaction.coefficientsMutable ) {
        this.reaction.sandwich.nodeProperty.unlink( this.nodePropertyObserver );
      }
    }
  } );
} );