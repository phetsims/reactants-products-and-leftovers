// Copyright 2002-2014, University of Colorado Boulder

/**
 * Developer controls for the 'Game' screen. i18n not required.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings (i18n not required)
  var skipString = 'Skip';
  var skipAllString = 'Skip All';
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

    var skipButton = new TextPushButton( skipString, BUTTON_OPTIONS );
    skipButton.addListener( function() { model.skipCurrentChallenge(); } );

    var skipAllButton = new TextPushButton( skipAllString, BUTTON_OPTIONS );
    skipAllButton.addListener( function() { model.skipAllChallenges(); } );

    var replayButton = new TextPushButton( replayString, BUTTON_OPTIONS );
    replayButton.addListener( function() { model.replayCurrentChallenge(); } );

    options.children = [ skipButton, skipAllButton, replayButton ];
    LayoutBox.call( this, options );
  }

  return inherit( LayoutBox, DevControls );
} );
