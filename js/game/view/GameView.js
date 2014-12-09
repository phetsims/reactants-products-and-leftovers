// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/PlayNode' );
  var ResultsNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ResultsNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var SettingsNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/SettingsNode' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {GameModel} model
   * @constructor
   */
  function GameView( model ) {

    var thisView = this;
    ScreenView.call( thisView, RPALConstants.SCREEN_VIEW_OPTIONS );

    // audio
    var audioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    // one node for each 'phase' of the game, created on demand to improve startup time
    var settingsNode = null;
    var playNode = null;
    thisView.resultsNode = null; // @private

    // game 'phase' changes, nodes created on demand to reduce startup time
    model.gamePhaseProperty.link( function( gamePhase ) {

      // create when first needed
      if ( gamePhase === GamePhase.SETTINGS && settingsNode === null ) {
        settingsNode = new SettingsNode( model, thisView.layoutBounds );
        thisView.addChild( settingsNode );
      }

      // create when first needed
      if ( gamePhase === GamePhase.PLAY && playNode === null ) {
        playNode = new PlayNode( model, thisView.layoutBounds, audioPlayer );
        thisView.addChild( playNode );
      }

      // create when first needed
      if ( gamePhase === GamePhase.RESULTS && thisView.resultsNode === null ) {
        thisView.resultsNode = new ResultsNode( model, thisView.layoutBounds, audioPlayer );
        thisView.addChild( thisView.resultsNode );
      }

      // make the node visible that corresponds to the game phase
      settingsNode && ( settingsNode.visible = ( gamePhase === GamePhase.SETTINGS ) );
      playNode && ( playNode.visible = ( gamePhase === GamePhase.PLAY ) );
      thisView.resultsNode && ( thisView.resultsNode.visible = ( gamePhase === GamePhase.RESULTS ) );
    } );
  }

  return inherit( ScreenView, GameView, {

    // @param {number} elapsedTime time between step calls, in seconds
    step: function( elapsedTime ) {
      if ( this.resultsNode && this.resultsNode.visible ) {
        this.resultsNode.step( elapsedTime );
      }
    }
  } );
} );
