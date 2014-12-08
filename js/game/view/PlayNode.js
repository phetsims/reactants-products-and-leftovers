// Copyright 2002-2014, University of Colorado Boulder

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
  var DevAnswerNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevAnswerNode' );
  var DevGameControls = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevGameControls' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
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

    var thisNode = this;
    Node.call( thisNode );

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
    thisNode.addChild( scoreboardNode );

    // challenge will be displayed in the area below the scoreboard
    var challengeBounds = new Bounds2( layoutBounds.left, scoreboardNode.bottom, layoutBounds.right, layoutBounds.bottom );

    // display the current challenge
    var challengeNode = null;
    model.challengeProperty.link( function( challenge ) {

      var t = new Date().getTime();

      // clean up previous challenge
      if ( challengeNode ) {
        thisNode.removeChild( challengeNode );
        challengeNode.dispose();
        challengeNode = null;
      }

      // set up new challenge
      if ( challenge ) { // challenge will be null on startup and 'Reset All'
        challengeNode = new ChallengeNode( model, challengeBounds, audioPlayer );
        thisNode.addChild( challengeNode );
      }

      console.log( 'load time = ' + ( new Date().getTime() - t ) + ' ms'  );
    } );

    // developer mode
    if ( RPALQueryParameters.DEV ) {

      // Developer controls at right, below scoreboard
      thisNode.addChild( new DevGameControls( model, {
        right: layoutBounds.right - 5,
        top: scoreboardNode.bottom + 5
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