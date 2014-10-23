// Copyright 2002-2014, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to the 'results' game phase. (See GamePhase.RESULTS)
 * Displays a panel with the game results.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var RPALRewardNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/RPALRewardNode' );

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function ResultsNode( model, layoutBounds, audioPlayer ) {

    var thisNode = this;
    Node.call( thisNode );

    thisNode.rewardNode = null;

    // show results when we enter this phase
    model.gamePhaseProperty.link( function( gamePhase ) {
      if ( gamePhase === GamePhase.RESULTS ) {

        // game reward, shown for perfect score (or with 'reward' query parameter)
        if ( model.isPerfectScore() || RPALQueryParameters.REWARD ) {

          audioPlayer.gameOverPerfectScore();

          //TODO
          thisNode.rewardNode = new RPALRewardNode( model.level );
          thisNode.addChild( thisNode.rewardNode );
        }
        else {
          audioPlayer.gameOverImperfectScore();
        }

        // game results
        thisNode.addChild( new LevelCompletedNode(
          model.level,
          model.score,
          model.getPerfectScore(),
          model.challengesPerGame, // number of stars in the progress indicator
          model.timerEnabled,
          model.timer.elapsedTime,
          model.bestTimeProperties[ model.level ].get(),
          model.isNewBestTime,
          function() {
            model.gamePhaseProperty.set( GamePhase.SETTINGS );
          }, {
            starDiameter: 45,
            buttonFill: RPALConstants.GAME_BUTTON_COLOR,
            centerX: layoutBounds.centerX,
            centerY: layoutBounds.centerY
          } ) );
      }
      else {
        thisNode.removeAllChildren();
        thisNode.rewardNode = null;
      }
    } );
  }

  return inherit( Node, ResultsNode, {
    step: function( elapsedTime ) {
      if ( this.rewardNode ) {
        this.rewardNode.step( elapsedTime );
      }
    }
  } );
} );