// Copyright 2002-2014, University of Colorado Boulder

/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // constants
  var BUTTON_OPTIONS = {
    font: new RPALFont( 10 ),
    baseColor: 'red',
    textFill: 'white'
  };

  /**
   * @param {GameModel} model
   * @param {Object} [options]
   * @constructor
   */
  function DevGameControls( model, options ) {

    options = _.extend( {
      orientation: 'vertical',
      align: 'right',
      spacing: 5
    }, options );

    // replays the current challenge
    var replayButton = new TextPushButton( 'Replay', BUTTON_OPTIONS );
    replayButton.addListener( function() { model.replayCurrentChallenge(); } );

    // skips the current challenge
    var skipButton = new TextPushButton( 'Skip', BUTTON_OPTIONS );
    skipButton.addListener( function() { model.skipCurrentChallenge(); } );

    options.children = [ replayButton, skipButton ];
    LayoutBox.call( this, options );
  }

  return inherit( LayoutBox, DevGameControls );
} );
