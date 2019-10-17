// Copyright 2014-2019, University of Colorado Boulder

/**
 * Radio buttons for selecting a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const RADIO_BUTTON_OPTIONS = { radius: 8 };
  const TEXT_OPTIONS = { font: new RPALFont( 16 ), fill: 'white' };

  /**
   * @param {Property.<Reaction>} reactionProperty
   * @param {Reaction[]} choices
   * @param {Object} [options]
   * @constructor
   */
  function ReactionRadioButtons( reactionProperty, choices, options ) {

    options = merge( {
      spacing: 10,
      orientation: 'vertical',
      align: 'left'
    }, options );

    // radio buttons, one for each reaction
    options.children = [];
    choices.forEach( function( choice ) {
      // no need to unlink reactionProperty from buttons, they exist for the lifetime of the sim
      const radioButton = new AquaRadioButton( reactionProperty, choice, new Text( choice.name, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
      radioButton.touchArea = radioButton.localBounds.dilatedXY( 10, options.spacing / 2 );
      options.children.push( radioButton );
    } );

    LayoutBox.call( this, options );
  }

  reactantsProductsAndLeftovers.register( 'ReactionRadioButtons', ReactionRadioButtons );

  return inherit( LayoutBox, ReactionRadioButtons );
} );
