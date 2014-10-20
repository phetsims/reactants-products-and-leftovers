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
  var Dimension2 = require( 'DOT/Dimension2' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );

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
      new Property( model.challengesPerGame ),
      model.levelProperty,
      model.scoreProperty,
      model.timer.elapsedTimeProperty,
      model.timerEnabledProperty,
      function() {
        model.gamePhaseProperty.set( GamePhase.SETTINGS );
      },
      {
        font: new RPALFont( 20 ),
        leftMargin: 40, // visually aligned with left edge of challenge boxes
        rightMargin: 50 // visually aligned with right edge of challenge graph
      } );
    scoreboardNode.centerX = layoutBounds.centerX;
    scoreboardNode.top = 0;
    thisNode.addChild( scoreboardNode );

    // compute the size of the area available for the challenges
    var challengeSize = new Dimension2( layoutBounds.width, layoutBounds.height - scoreboardNode.bottom );

    // challenge parent, to keep challenge below scoreboard
    var challengeParent = new Rectangle( 0, 0, 0, 1 );
    challengeParent.top = scoreboardNode.bottom;
    thisNode.addChild( challengeParent );

    // Set up a new challenge
    model.challengeProperty.link( function( challenge ) {
      challengeParent.removeAllChildren();
//TODO      challengeParent.addChild( challenge.createView( model, challengeSize, audioPlayer ) );
    } );
  }

  return inherit( Node, PlayNode );
} );