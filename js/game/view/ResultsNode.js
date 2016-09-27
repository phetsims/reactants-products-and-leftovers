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
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
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

        // game reward, shown for perfect score (or with 'reward' query parameter)
        if ( model.isPerfectScore() || RPALQueryParameters.SHOW_REWARD ) {

          audioPlayer.gameOverPerfectScore();

          self.rewardNode = new RPALRewardNode( model.levelProperty.get() );
          self.addChild( self.rewardNode );
        }
        else {
          audioPlayer.gameOverImperfectScore();
        }

        // game results
        var level = model.levelProperty.get();
        self.addChild( new LevelCompletedNode(
          level,
          model.scoreProperty.get(),
          model.getPerfectScore( level ),
          model.numberOfChallengesProperty.get(), // number of stars in the progress indicator
          model.timerEnabledProperty.get(),
          model.timer.elapsedTime,
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