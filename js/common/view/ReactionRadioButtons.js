// Copyright 2014-2015, University of Colorado Boulder

/**
 * Radio buttons for selecting a reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var RADIO_BUTTON_OPTIONS = { radius: 8 };
  var TEXT_OPTIONS = { font: new RPALFont( 16 ), fill: 'white' };

  /**
   * @param {Property.<Reaction>} reactionProperty
   * @param {Reaction[]} choices
   * @param {Object} [options]
   * @constructor
   */
  function ReactionRadioButtons( reactionProperty, choices, options ) {

    options = _.extend( {
      spacing: 10,
      orientation: 'vertical',
      align: 'left'
    }, options );

    // radio buttons, one for each reaction
    options.children = [];
    choices.forEach( function( choice ) {
      // no need to unlink reactionProperty from buttons, they exist for the lifetime of the sim
      var radioButton = new AquaRadioButton( reactionProperty, choice, new Text( choice.name, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
      radioButton.touchArea = radioButton.localBounds.dilatedXY( 10, options.spacing / 2 );
      options.children.push( radioButton );
    } );

    LayoutBox.call( this, options );
  }

  return inherit( LayoutBox, ReactionRadioButtons );
} );
