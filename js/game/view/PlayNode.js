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
  var DevControls = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/DevControls' );
  var DevAnswerNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/DevAnswerNode' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
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

    if ( RPALQueryParameters.DEV ) {

      // Developer controls, below right end of scoreboard
      thisNode.addChild( new DevControls( model, {
        right: layoutBounds.right - 5,
        top: scoreboardNode.bottom + 3
      } ) );

      // Quantities required to answer the current challenge correctly, bottom center
      thisNode.addChild( new DevAnswerNode( model.challengeProperty, {
        centerX: layoutBounds.centerX,
        bottom: layoutBounds.bottom - 5
      } ) );
    }

    // compute the bounds available for the challenges
    var challengeBounds = new Bounds2( layoutBounds.left, scoreboardNode.bottom, layoutBounds.right, layoutBounds.bottom );

    // challenge parent, to keep challenge below scoreboard
    var challengeParent = new Rectangle( 0, 0, 0, 1 );
    challengeParent.top = scoreboardNode.bottom;
    thisNode.addChild( challengeParent );

    // Set up a new challenge
    model.challengeProperty.link( function( challenge ) {
      challengeParent.removeAllChildren();
      challengeParent.addChild( createChallengeView( model, challengeBounds, audioPlayer ) );
    } );
  }

  /**
   * @param {GameModel} model
   * @param {Bounds2} challengeBounds
   * @param {GameAudioPlayer} audioPlayer
   */
  var createChallengeView = function( model, challengeBounds, audioPlayer ) {
    //TODO
    return new Node();
  };

  return inherit( Node, PlayNode );
} );