// Copyright 2014-2015, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.RESULTS.
 * Displays a panel with the game results (score, optional time, reward, ...)
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
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
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

    thisNode.rewardNode = null; // @private

    /*
     * Displays the game results, possibly with a 'reward'.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( function( gamePhase ) {

      // show results when we enter this phase
      if ( gamePhase === GamePhase.RESULTS ) {

        // game reward, shown for perfect score (or with 'reward' query parameter)
        if ( model.isPerfectScore() || RPALQueryParameters.SHOW_REWARD ) {

          audioPlayer.gameOverPerfectScore();

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
          model.getPerfectScore( model.level ),
          model.numberOfChallenges, // number of stars in the progress indicator
          model.timerEnabled,
          model.timer.elapsedTime,
          model.bestTimeProperties[ model.level ].get(),
          model.isNewBestTime,
          function() {
            model.settings();
          }, {
            starDiameter: 45,
            buttonFill: RPALColors.GAME_BUTTON,
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

    /**
     * Animates the game reward.
     * @param {number} elapsedTime time between step calls, in seconds
     * @public
     */
    step: function( elapsedTime ) {
      if ( this.rewardNode ) {
        this.rewardNode.step( elapsedTime );
      }
    }
  } );
} );