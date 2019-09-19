// Copyright 2014-2018, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const RPALRewardNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/RPALRewardNode' );

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function ResultsNode( model, layoutBounds, audioPlayer ) {

    var self = this;
    Node.call( this );

    this.rewardNode = null; // @private

    /*
     * Displays the game results, possibly with a 'reward'.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( function( gamePhase ) {

      // show results when we enter this phase
      if ( gamePhase === GamePhase.RESULTS ) {

        // game reward
        if ( model.isPerfectScore() ) {
          self.rewardNode = new RPALRewardNode( model.levelProperty.get() );
          self.addChild( self.rewardNode );
        }

        // game results
        var level = model.levelProperty.get();
        self.addChild( new LevelCompletedNode(
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
        self.removeAllChildren();
        if ( self.rewardNode !== null ) {
          self.rewardNode.dispose();
        }
        self.rewardNode = null;
      }
    } );
  }

  reactantsProductsAndLeftovers.register( 'ResultsNode', ResultsNode );

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