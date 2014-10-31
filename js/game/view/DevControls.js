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

  // strings (i18n not required)
  var testString = 'Test';
  var skipString = 'Skip';
  var replayString = 'Replay';

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
  function DevControls( model, options ) {

    options = _.extend( {
      orientation: 'horizontal',
      spacing: 5
    }, options );

    // replays the current challenge
    var replayButton = new TextPushButton( replayString, BUTTON_OPTIONS );
    replayButton.addListener( function() { model.replayCurrentChallenge(); } );

    // skips the current challenge
    var skipButton = new TextPushButton( skipString, BUTTON_OPTIONS );
    skipButton.addListener( function() { model.skipCurrentChallenge(); } );

    // runs a sanity test on the challenge generator
    var testButton = new TextPushButton( testString, BUTTON_OPTIONS );
    testButton.addListener( function() { ChallengeFactory.test(); } );

    options.children = [ replayButton, skipButton, testButton ];
    LayoutBox.call( this, options );
  }

  return inherit( LayoutBox, DevControls );
} );
