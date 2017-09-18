// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeforeAfterNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/BeforeAfterNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALScreenView' );

  /**
   * @param {MoleculesModel} model
   * @constructor
   */
  function MoleculesScreenView( model ) {

    RPALScreenView.call( this, model,

      /*
       * Creates an equation for a specified reaction.
       * @param {Reaction} reaction
       * @returns {Node}
       */
      function( reaction ) { return new MoleculesEquationNode( reaction ); },

      /*
       * Creates the Before/After interface for a specified reaction.
       * @param {Reaction} reaction the reaction displayed in the boxes
       * @param {Property.<boolean>} beforeExpandedProperty is the 'Before' box expanded?
       * @param {Property.<boolean>} afterExpandedProperty is the 'After' box expanded?
       * @param {Object} [options]
       * @returns {Node}
       */
      function( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {
        return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
          _.extend( {}, options, {
            contentSize: RPALConstants.MOLECULES_BEFORE_AFTER_BOX_SIZE,
            minIconSize: new Dimension2( 30, 25 ) // eyeballed
          } ) );
      }
    );
  }

  reactantsProductsAndLeftovers.register( 'MoleculesScreenView', MoleculesScreenView );

  return inherit( RPALScreenView, MoleculesScreenView );
} );