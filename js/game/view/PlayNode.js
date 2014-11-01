// Copyright 2002-2014, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to the 'play' game phase. (See GamePhase.PLAY)
 * Displays the scoreboard and current challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ChallengeNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ChallengeNode' );
  var DevAnswerNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/DevAnswerNode' );
  var DevControls = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/DevControls' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function PlayNode( model, layoutBounds, audioPlayer ) {

    Node.call( this );

    // scoreboard, across the top of the screen
    var scoreboardNode = new ScoreboardBar(
      layoutBounds.width,
      model.challengeIndexProperty,
      model.numberOfChallengesProperty,
      model.levelProperty,
      model.scoreProperty,
      model.timer.elapsedTimeProperty,
      model.timerEnabledProperty,
      function() {
        model.gamePhaseProperty.set( GamePhase.SETTINGS );
      },
      {
        // ScoreboardBar options
        font: new RPALFont( 16 ),
        leftMargin: 40, //TODO
        rightMargin: 50, //TODO
        centerX: layoutBounds.centerX,
        top: 0
      } );
    this.addChild( scoreboardNode );

    // challenge can use the area below the scoreboard
    var challengeBounds = new Bounds2( layoutBounds.left, scoreboardNode.bottom, layoutBounds.right, layoutBounds.bottom );

    // ChallengeNode parent, to preserve rendering order
    var challengeParent = new Node();
    this.addChild( challengeParent );

    // Set up a new challenge
    model.challengeProperty.link( function( challenge ) {
      challengeParent.removeAllChildren();
      if ( challenge ) { // challenge will be null on startup and 'Reset All'
        challengeParent.addChild( new ChallengeNode( model, challenge, challengeBounds, audioPlayer ) );
      }
    } );

    if ( RPALQueryParameters.DEV ) {

      // Developer controls, below right end of scoreboard
      this.addChild( new DevControls( model, {
        right: layoutBounds.right - 5,
        top: scoreboardNode.bottom + 3
      } ) );

      // The answer to the current challenge, bottom center
      this.addChild( new DevAnswerNode( model.challengeProperty, {
        centerX: layoutBounds.centerX,
        bottom: layoutBounds.bottom - 5
      } ) );
    }
  }

  return inherit( Node, PlayNode );
} );