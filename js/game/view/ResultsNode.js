// Copyright 2014-2019, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.RESULTS.
 * Displays a panel with the game results (score, optional time, reward, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  const LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const RPALRewardNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/RPALRewardNode' );

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
            function() {
              model.settings();
            }, {
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

  return reactantsProductsAndLeftovers.register( 'ResultsNode', ResultsNode );
} );