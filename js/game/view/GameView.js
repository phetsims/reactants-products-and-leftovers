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

    // one node for each 'phase' of the game, creation deferred to improve startup time
    thisView.settingsNode = null;
    thisView.playNode = null;
    thisView.resultsNode = null;

    // game 'phase' changes
    model.gamePhaseProperty.link( function( gamePhase ) {

      // create when first needed
      if ( gamePhase === GamePhase.SETTINGS && thisView.settingsNode === null ) {
        thisView.settingsNode = new SettingsNode( model, thisView.layoutBounds );
        thisView.addChild( thisView.settingsNode );
      }

      // create when first needed
      if ( gamePhase === GamePhase.PLAY && thisView.playNode === null ) {
        thisView.playNode = new PlayNode( model, thisView.layoutBounds, audioPlayer );
        thisView.addChild( thisView.playNode );
      }

      // create when first needed
      if ( gamePhase === GamePhase.RESULTS && thisView.resultsNode === null ) {
        thisView.resultsNode = new ResultsNode( model, thisView.layoutBounds, audioPlayer );
        thisView.addChild( thisView.resultsNode );
      }

      // make the node visible that corresponds to the state
      thisView.settingsNode && ( thisView.settingsNode.visible = ( gamePhase === GamePhase.SETTINGS ) );
      thisView.playNode && ( thisView.playNode.visible = ( gamePhase === GamePhase.PLAY ) );
      thisView.resultsNode && ( thisView.resultsNode.visible = ( gamePhase === GamePhase.RESULTS ) );
    } );
  }

  return inherit( ScreenView, GameView, {

    step: function( elapsedTime ) {
      if ( this.resultsNode && this.resultsNode.visible ) {
        this.resultsNode.step( elapsedTime );
      }
    }
  } );
} );
