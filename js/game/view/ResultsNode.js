// Copyright 2014-2020, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.RESULTS.
 * Displays a panel with the game results (score, optional time, reward, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import LevelCompletedNode from '../../../../vegas/js/LevelCompletedNode.js';
import RPALColors from '../../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GamePhase from '../model/GamePhase.js';
import RPALRewardNode from './RPALRewardNode.js';

class ResultsNode extends Node {
  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   */
  constructor( model, layoutBounds, audioPlayer ) {

    super();

    this.rewardNode = null; // @private

    /*
     * Displays the game results, possibly with a 'reward'.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( gamePhase => {

      // show results when we enter this phase
      if ( gamePhase === GamePhase.RESULTS ) {

        // game reward
        if ( model.isPerfectScore() ) {
          this.rewardNode = new RPALRewardNode( model.levelProperty.get() );
          this.addChild( this.rewardNode );
        }

        // game results
        const level = model.levelProperty.get();
        this.addChild( new LevelCompletedNode(
          level + 1,
          model.scoreProperty.get(),
          model.getPerfectScore( level ),
          model.numberOfChallengesProperty.get(), // number of stars in the progress indicator
          model.timerEnabledProperty.get(),
          model.timer.elapsedTimeProperty.value,
          model.bestTimeProperties[ level ].get(),
          model.isNewBestTime,
          () => model.settings(),
          {
            starDiameter: 45,
            buttonFill: RPALColors.GAME_BUTTON,
            centerX: layoutBounds.centerX,
            centerY: layoutBounds.centerY
          } ) );

        // Play the appropriate audio feedback.
        if ( model.isPerfectScore() ) {
          audioPlayer.gameOverPerfectScore();
        }
        else {
          audioPlayer.gameOverImperfectScore();
        }
      }
      else {
        this.removeAllChildren();
        if ( this.rewardNode !== null ) {
          this.rewardNode.dispose();
        }
        this.rewardNode = null;
      }
    } );
  }

  /**
   * Animates the game reward.
   * @param {number} elapsedTime time between step calls, in seconds
   * @public
   */
  step( elapsedTime ) {
    if ( this.rewardNode ) {
      this.rewardNode.step( elapsedTime );
    }
  }
}

reactantsProductsAndLeftovers.register( 'ResultsNode', ResultsNode );
export default ResultsNode;