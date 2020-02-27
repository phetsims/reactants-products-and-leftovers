// Copyright 2020, University of Colorado Boulder

/**
 * Radio buttons for selecting a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButtonGroup = require( 'SUN/AquaRadioButtonGroup' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TEXT_OPTIONS = { font: new RPALFont( 16 ), fill: 'white' };

  class ReactionRadioButtonGroup extends AquaRadioButtonGroup {

    /**
     * @param {Property.<Reaction>} reactionProperty
     * @param {Reaction[]} choices
     * @param {Object} [options]
     */
    constructor( reactionProperty, choices, options ) {

      options = merge( {
        orientation: 'vertical',
        align: 'left',
        spacing: 10,
        touchAreaXDilation: 10,
        radioButtonOptions: { radius: 8 }
      }, options );

      // describe radio buttons, one for each reaction
      const items = [];
      choices.forEach( choice => {
        items.push( {
          node: new Text( choice.name, TEXT_OPTIONS ),
          value: choice
        } );
      } );

      super( reactionProperty, items, options );
    }
  }

  return reactantsProductsAndLeftovers.register( 'ReactionRadioButtonGroup', ReactionRadioButtonGroup );
} );
