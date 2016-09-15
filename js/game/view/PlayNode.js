// Copyright 2014-2015, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.PLAY.
 * Displays the scoreboard and current challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ChallengeNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ChallengeNode' );
  var DevGameControls = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevGameControls' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );

  // constants
  var SCOREBOARD_X_MARGIN = 50;

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function PlayNode( model, layoutBounds, audioPlayer ) {

    var self = this;
    Node.call( this );

    // @private
    this.model = model;
    this.layoutBounds = layoutBounds;
    this.audioPlayer = audioPlayer;

    // scoreboard, across the top of the screen
    var scoreboardNode = new ScoreboardBar(
      layoutBounds.width,
      model.challengeIndexProperty,
      model.numberOfChallengesProperty,
      model.levelProperty,
      model.scoreProperty,
      model.timer.elapsedTimeProperty,
      model.timerEnabledProperty,
      // callback for the 'New Game' button
      function() {
        model.settings();
      },
      // ScoreboardBar options
      {
        font: new RPALFont( 16 ),
        leftMargin: SCOREBOARD_X_MARGIN,
        rightMargin: SCOREBOARD_X_MARGIN,
        centerX: layoutBounds.centerX,
        top: 0
      } );
    this.addChild( scoreboardNode );

    // Developer controls at top-right, below scoreboard
    if ( RPALQueryParameters.DEV ) {
      this.addChild( new DevGameControls( model, {
        right: layoutBounds.right - 5,
        top:   scoreboardNode.bottom + 5
      } ) );
    }

    // @private challenge will be displayed in the area below the scoreboard
    this.challengeBounds = new Bounds2( layoutBounds.left, scoreboardNode.bottom, layoutBounds.right, layoutBounds.bottom );

    var currentChallengeNode = null; // {ChallengeNode} the challenge that is displayed
    this.disposeNodes = [];  // @private {ChallengeNode[]} nodes in this array are scheduled for disposal
    this.nextChallengeNode = null; // @private {ChallengeNode} the next challenge, preloaded to improve responsiveness
    this.stepsSinceDisposal = 0;  // @private number of times that step() has been called since a node was schedule for disposal
    this.stepsSinceUpdate = 0; // @private number of times that step() has been called since the challenge changed

    /*
     * Displays the current challenge.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.challengeProperty.link( function( challenge ) {

      // schedule previous challenge for deletion
      if ( currentChallengeNode ) {
        self.disposeNodes.push( currentChallengeNode );
        currentChallengeNode.visible = false;
        currentChallengeNode = null;
        self.stepsSinceDisposal = 0;
      }

      // activate current challenge
      if ( challenge ) { // challenge will be null on startup and 'Reset All'
        if ( self.nextChallengeNode ) {
          // use preloaded node
          currentChallengeNode = self.nextChallengeNode;
          self.nextChallengeNode = null;
        }
        else {
          // if a node hasn't been preloaded, create one
          currentChallengeNode = new ChallengeNode( model, challenge, self.challengeBounds, audioPlayer );
          self.addChild( currentChallengeNode );
        }
        currentChallengeNode.activate( model.playStateProperty );
        currentChallengeNode.visible = true;
        self.stepsSinceUpdate = 0;
      }
    } );

    /*
     * When we transition away from 'play' phase, schedule the current and preloaded nodes for disposal.
     * Unlink is unnecessary because this node exists for the lifetime of the simulation.
     */
    model.gamePhaseProperty.link( function( gamePhase ) {
      if ( gamePhase !== GamePhase.PLAY ) {
        if ( currentChallengeNode ) {
          self.disposeNodes.push( currentChallengeNode );
          currentChallengeNode = null;
        }
        if ( self.nextChallengeNode ) {
          self.disposeNodes.push( self.nextChallengeNode );
          self.nextChallengeNode = null;
        }
        self.stepsSinceDisposal = 0;
      }
    } );
  }

  reactantsProductsAndLeftovers.register( 'PlayNode', PlayNode );

  return inherit( Node, PlayNode, {

    // @public
    step: function( elapsedTime ) {

      /**
       * See issue #17
       * To defer the cost of removing a ChallengeNode, handle the removal of the previous ChallengeNode after the current one
       * is made visible (2 steps). The user will presumably be distracted processing what they see on the screen, so won't notice
       * the brief interruption. this.disposeNodes is an array so that we can remove both the current and next (preloaded)
       * ChallengeNodes when we leave the 'play' phase of the game.
       */
      this.stepsSinceDisposal++;
      if ( this.stepsSinceDisposal >= 2 && this.disposeNodes.length > 0 ) {
        for ( var i = 0; i < this.disposeNodes.length; i++ ) {
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
      if ( this.stepsSinceUpdate >= 2 && this.visible && !this.nextChallengeNode && this.model.challengeIndex < this.model.challenges.length - 1 ) {
        this.nextChallengeNode = new ChallengeNode( this.model, this.model.challenges[ this.model.challengeIndex + 1 ], this.challengeBounds, this.audioPlayer );
        this.nextChallengeNode.visible = false;
        this.addChild( this.nextChallengeNode );
      }
    }
  } );
} );