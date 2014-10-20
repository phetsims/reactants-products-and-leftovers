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

    // one parent node for each 'phase' of the game
    thisView.settingsNode = new SettingsNode( model, thisView.layoutBounds );
    thisView.playNode = new PlayNode( model, thisView.layoutBounds, audioPlayer );
    thisView.resultsNode = new ResultsNode( model, thisView.layoutBounds, audioPlayer );

    // rendering order
    thisView.addChild( thisView.resultsNode );
    thisView.addChild( thisView.playNode );
    thisView.addChild( thisView.settingsNode );

    // game 'phase' changes
    model.gamePhaseProperty.link( function( gamePhase ) {
      thisView.settingsNode.visible = ( gamePhase === GamePhase.SETTINGS );
      thisView.playNode.visible = ( gamePhase === GamePhase.PLAY );
      thisView.resultsNode.visible = ( gamePhase === GamePhase.RESULTS );
    } );
  }

  return inherit( ScreenView, GameView, {

    step: function( elapsedTime ) {
      if ( this.resultsNode.visible ) {
        this.resultsNode.step( elapsedTime );
      }
    }
  } );
} );
