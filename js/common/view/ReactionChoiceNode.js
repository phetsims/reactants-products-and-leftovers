// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control for selecting a reaction.
 * A vertical stack of left-aligned radio buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var RADIO_BUTTON_OPTIONS = { radius: 8 };
  var TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };

  /**
   * @param {Property<Reaction>} reactionProperty
   * @param {[Reaction]} choices
   * @param {Object} options
   * @constructor
   */
  function ReactionChoiceNode( reactionProperty, choices, options ) {

    options = _.extend( {
      spacing: 10,
      align: 'left'
    }, options );

    // radio buttons, one for each reaction, arranged horizontally
    var radioButtons = [];
    choices.forEach( function( choice ) {
      var radioButton = new AquaRadioButton( reactionProperty, choice, new Text( choice.name, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
      radioButton.touchArea = radioButton.localBounds.dilatedXY( 10, options.spacing / 2 );
      radioButtons.push( radioButton );
    } );

    options.children = radioButtons;
    VBox.call( this, options );
  }

  return inherit( VBox, ReactionChoiceNode );
} );
