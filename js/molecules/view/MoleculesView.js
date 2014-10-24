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

      /*
       * Creates an equation for a specified reaction.
       * @param {Reaction} reaction
       * @returns {Node}
       */
      function( reaction ) { return new MoleculesEquationNode( reaction ); },

      /*
       * Creates the Before/After boxes for a specified reaction.
       * @param {Reaction} reaction the reaction displayed in the boxes
       * @param {Property.<boolean>} beforeExpandedProperty is the 'Before' box expanded?
       * @param {Property.<boolean>} afterExpandedProperty is the 'After' box expanded?
       * @param {Object} [options]
       * @returns {Node}
       */
      function( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {
        return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty, options );
      }
    );
  }

  return inherit( ReactionView, MoleculesView );
} );
