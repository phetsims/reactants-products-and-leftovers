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
  var ChallengeView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ChallengeView' );
  var DevControls = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/DevControls' );
  var DevAnswerNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/DevAnswerNode' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function PlayNode( model, layoutBounds, audioPlayer ) {

    var thisNode = this;
    Node.call( thisNode );

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
    thisNode.addChild( scoreboardNode );

    // compute the bounds available for the challenges
    var challengeBounds = new Bounds2( layoutBounds.left, scoreboardNode.bottom, layoutBounds.right, layoutBounds.bottom );

    // ChallengeView parent, to preserve rendering order
    var challengeParent = new Node();
    thisNode.addChild( challengeParent );

    // Set up a new challenge
    model.challengeProperty.link( function( challenge ) {
      challengeParent.removeAllChildren();
      challengeParent.addChild( new ChallengeView( model, challenge, challengeBounds, audioPlayer ) );
    } );

    if ( RPALQueryParameters.DEV ) {

      // Developer controls, below right end of scoreboard
      thisNode.addChild( new DevControls( model, {
        right: layoutBounds.right - 5,
        top: scoreboardNode.bottom + 3
      } ) );

      // The answer to the current challenge, bottom center
      thisNode.addChild( new DevAnswerNode( model.challengeProperty, {
        centerX: layoutBounds.centerX,
        bottom: layoutBounds.bottom - 5
      } ) );
    }
  }

  return inherit( Node, PlayNode );
} );