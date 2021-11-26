// Copyright 2014-2021, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.PLAY.
 * Displays the status bar and current challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import FiniteStatusBar from '../../../../vegas/js/FiniteStatusBar.js';
import ScoreDisplayLabeledNumber from '../../../../vegas/js/ScoreDisplayLabeledNumber.js';
import DevGameControls from '../../dev/DevGameControls.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GamePhase from '../model/GamePhase.js';
import ChallengeNode from './ChallengeNode.js';

class PlayNode extends Node {

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {GameAudioPlayer} audioPlayer
   */
  constructor( model, layoutBounds, visibleBoundsProperty, audioPlayer ) {

    super();

    // @private
    this.model = model;
    this.layoutBounds = layoutBounds;
    this.audioPlayer = audioPlayer;

    // status bar, across the top of the screen
    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, model.scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayLabeledNumber,

      // FiniteStatusBar uses 1-based level numbering, model is 0-based, see #57.
      levelProperty: new DerivedProperty( [ model.levelProperty ], level => level + 1 ),
      challengeIndexProperty: model.challengeIndexProperty,
      numberOfChallengesProperty: model.numberOfChallengesProperty,
      elapsedTimeProperty: model.timer.elapsedTimeProperty,
      timerEnabledProperty: model.timerEnabledProperty,
      font: new PhetFont( 16 ),
      textFill: 'white',
      barFill: 'rgb( 49, 117, 202 )',
      xMargin: 50,
      startOverButtonOptions: {
        baseColor: 'rgb( 229, 243, 255 )',
        textFill: 'black',
        xMargin: 10,
        yMargin: 5,
        listener: () => model.settings()
      }
    } );
    this.addChild( statusBar );

    // Developer controls at top-right, below status bar
    if ( phet.chipper.queryParameters.showAnswers ) {
      this.addChild( new DevGameControls( model, {
        right: layoutBounds.right - 5,
        top: statusBar.bottom + 5
      } ) );
    }

    // @private challenge will be displayed in the area below the status bar
    this.challengeBounds = new Bounds2( layoutBounds.left, statusBar.bottom, layoutBounds.right, layoutBounds.bottom );

    let currentChallengeNode = null; // {ChallengeNode} the challenge that is displayed
    this.disposeNodes = [];  // @private {ChallengeNode[]} nodes in this array are scheduled for disposal
    this.nextChallengeNode = null; // @private {ChallengeNode} the next challenge, preloaded to improve responsiveness
    this.stepsSinceDisposal = 0;  // @private number of times that step() has been called since a node was schedule for disposal
    this.stepsSinceUpdate = 0; // @private number of times that step() has been called since the challenge changed

    /*
     * Displays the current challenge.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.challengeProperty.link( challenge => {

      // schedule previous challenge for deletion
      if ( currentChallengeNode ) {
        this.disposeNodes.push( currentChallengeNode );
        currentChallengeNode.visible = false;
        currentChallengeNode = null;
        this.stepsSinceDisposal = 0;
      }

      // activate current challenge
      if ( challenge ) { // challenge will be null on startup and 'Reset All'
        if ( this.nextChallengeNode ) {
          // use preloaded node
          currentChallengeNode = this.nextChallengeNode;
          this.nextChallengeNode = null;
        }
        else {
          // if a node hasn't been preloaded, create one
          currentChallengeNode = new ChallengeNode( model, challenge, this.challengeBounds, audioPlayer );
          this.addChild( currentChallengeNode );

          // pdom keyboard nav order, challenges should go before the "start over" button
          this.pdomOrder = [ currentChallengeNode ].concat( this.pdomOrder );
        }
        currentChallengeNode.activate( model.playStateProperty );
        currentChallengeNode.visible = true;
        this.stepsSinceUpdate = 0;
      }
    } );

    /*
     * When we transition away from 'play' phase, schedule the current and preloaded nodes for disposal.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( gamePhase => {
      if ( gamePhase !== GamePhase.PLAY ) {
        if ( currentChallengeNode ) {
          this.disposeNodes.push( currentChallengeNode );
          currentChallengeNode = null;
        }
        if ( this.nextChallengeNode ) {
          this.disposeNodes.push( this.nextChallengeNode );
          this.nextChallengeNode = null;
        }
        this.stepsSinceDisposal = 0;
      }
    } );
  }

  // @public
  step( elapsedTime ) {

    /**
     * See issue #17
     * To defer the cost of removing a ChallengeNode, handle the removal of the previous ChallengeNode after the current one
     * is made visible (2 steps). The user will presumably be distracted processing what they see on the screen, so won't notice
     * the brief interruption. this.disposeNodes is an array so that we can remove both the current and next (preloaded)
     * ChallengeNodes when we leave the 'play' phase of the game.
     */
    this.stepsSinceDisposal++;
    if ( this.stepsSinceDisposal >= 2 && this.disposeNodes.length > 0 ) {
      for ( let i = 0; i < this.disposeNodes.length; i++ ) {
        this.removeChild( this.disposeNodes[ i ] );
        this.disposeNodes[ i ].dispose();
      }
      this.disposeNodes = [];
    }

    /**
     * See issue #17
     * To defer the cost of adding a ChallengeNode, preload the new one after the current one is made visible (2 steps).
     * The user will presumably be distracted processing what they see on the screen, so won't notice the brief interruption.
     */
    this.stepsSinceUpdate++;
    const challengeIndex = this.model.challengeIndexProperty.get();
    if ( this.stepsSinceUpdate >= 2 && this.visible && !this.nextChallengeNode && challengeIndex < this.model.challenges.length - 1 ) {
      this.nextChallengeNode = new ChallengeNode( this.model, this.model.challenges[ challengeIndex + 1 ], this.challengeBounds, this.audioPlayer );
      this.nextChallengeNode.visible = false;
      this.addChild( this.nextChallengeNode );
    }
  }
}

reactantsProductsAndLeftovers.register( 'PlayNode', PlayNode );
export default PlayNode;