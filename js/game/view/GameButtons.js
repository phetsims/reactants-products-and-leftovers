// Copyright 2002-2014, University of Colorado Boulder

/**
 * Group of mutually-exclusive buttons that are used to advance a challenge through its states.
 * The buttons are 'Check', 'Try Again', 'Show Answer' and 'Next'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

  // constants
  var BUTTON_OPTIONS = {
    font: new RPALFont( { size: 24, weight: 'bold' } ),
    baseColor: 'rgba( 255, 255, 0, 0.5)', // transparent yellow
    xMargin: 20,
    yMargin: 5,
    centerX: 0 // so that all buttons are center aligned
  };

  /**
   * @param {GameModel} model
   * @param {Challenge} challenge
   * @param {GameAudioPlayer} audioPlayer
   * @param {FaceWithPointsNode} faceNode
   * @param {Object} [options]
   * @constructor
   */
  function GameButtons( model, challenge, audioPlayer, faceNode, options ) {

    var checkButton = new TextPushButton( checkString, BUTTON_OPTIONS );
    var tryAgainButton = new TextPushButton( tryAgainString, BUTTON_OPTIONS );
    var showAnswerButton = new TextPushButton( showAnswerString, BUTTON_OPTIONS );
    var nextButton = new TextPushButton( nextString, BUTTON_OPTIONS );

    options.children = [ checkButton, tryAgainButton, showAnswerButton, nextButton ];
    Node.call( this, options );

    // 'Check' button
    checkButton.addListener( function() {
      if ( challenge.isCorrect() ) {
        audioPlayer.correctAnswer();
        faceNode.smile();
        var points = model.computePoints();
        faceNode.setPoints( points );
        model.score = model.score + points;
        model.playState = PlayState.NEXT;
      }
      else {
        audioPlayer.wrongAnswer();
        faceNode.frown();
        faceNode.setPoints( 0 );
        model.playState = ( model.playState === PlayState.FIRST_CHECK ) ? PlayState.TRY_AGAIN : PlayState.SHOW_ANSWER;
      }
    } );

    // Disable the Check button when guessed quantities are zero.
    var checkButtonUpdater = null;
    if ( challenge.challengeType === ChallengeType.BEFORE ) {
      checkButtonUpdater = function() {
        // enabled Check button if any reactant quantity is non-zero
        checkButton.enabled = _.any( challenge.guess.reactants, function( reactant ) { return reactant.quantity > 0; } );
      };
      challenge.guess.reactants.forEach( function( reactant ) {
        reactant.quantityProperty.link( checkButtonUpdater );
      } );
    }
    else {
      checkButtonUpdater = function() {
        // enabled Check button if any product or leftover quantity is non-zero
        checkButton.enabled = _.any( challenge.guess.products, function( product ) { return product.quantity > 0; } ) ||
                              _.any( challenge.guess.reactants, function( reactant ) { return reactant.leftovers > 0; } );
      };
      challenge.guess.products.forEach( function( product ) {
        product.quantityProperty.link( checkButtonUpdater );
      } );
      challenge.guess.reactants.forEach( function( reactant ) {
        reactant.leftoversProperty.link( checkButtonUpdater );
      } );
    }

    // 'Try Again' button
    tryAgainButton.addListener( function() {
      model.playState = PlayState.SECOND_CHECK;
    } );

    // 'Show Answer' button
    showAnswerButton.addListener( function() {
      model.playState = PlayState.NEXT;
    } );

    // 'Next' button
    nextButton.addListener( function() {
      model.playState = PlayState.FIRST_CHECK;
    } );

    // make the proper button visible for the {PlayState} state
    model.playStateProperty.link( function( state ) {
      checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK );
      tryAgainButton.visible = ( state === PlayState.TRY_AGAIN );
      showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER );
      nextButton.visible = ( state === PlayState.NEXT );
    } );
  }

  return inherit( Node, GameButtons );
} );
