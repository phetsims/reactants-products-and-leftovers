// Copyright 2014-2020, University of Colorado Boulder

/**
 * View for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BeforeAfterNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/BeforeAfterNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALScreenView' );

  class MoleculesScreenView extends RPALScreenView {

    /**
     * @param {MoleculesModel} model
     */
    constructor( model ) {

      super( model,

        /*
         * Creates an equation for a specified reaction.
         * @param {Reaction} reaction
         * @returns {Node}
         */
        reaction => new MoleculesEquationNode( reaction ),

        /*
         * Creates the Before/After interface for a specified reaction.
         * @param {Reaction} reaction the reaction displayed in the boxes
         * @param {Property.<boolean>} beforeExpandedProperty is the 'Before' box expanded?
         * @param {Property.<boolean>} afterExpandedProperty is the 'After' box expanded?
         * @param {Object} [options]
         * @returns {Node}
         */
        ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) => {
          return new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
            merge( {}, options, {
              contentSize: RPALConstants.MOLECULES_BEFORE_AFTER_BOX_SIZE,
              minIconSize: new Dimension2( 30, 25 ) // eyeballed
            } ) );
        }
      );
    }
  }

  return reactantsProductsAndLeftovers.register( 'MoleculesScreenView', MoleculesScreenView );
} );
