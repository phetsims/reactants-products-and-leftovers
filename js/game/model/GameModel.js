// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/Challenge' );
  var ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var GamePhaseProperty = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhaseProperty' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ReactionFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/ReactionFactory' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );

  // constants
  var DUMMY_CHALLENGE = new Challenge( ReactionFactory.makeWater(), ChallengeType.BEFORE );

  function GameModel( options ) {

    options = _.extend( {
      level: 0,
      numberOfLevels: 3,
      challengesPerGame: 5,
      maxQuantity: RPALConstants.QUANTITY_RANGE.max
    }, options );

    var thisModel = this;

    PropertySet.call( this, {
      soundEnabled: true,
      timerEnabled: false,
      moleculesVisible: true,
      numbersVisible: true,
      level: 0,
      challenge: DUMMY_CHALLENGE,
      score: 0, // how many points the user has earned for the current game
      challengeIndex: 0,
      playState: PlayState.NONE
    } );

    thisModel.challenges = []; // {[Challenge]}
    thisModel.timer = new GameTimer();
    thisModel.numberOfLevels = options.numberOfLevels;
    thisModel.challengesPerGame = options.challengesPerGame;
    thisModel.maxPointsPerChallenge = 2;
    thisModel.bestScoreProperties = []; // best scores for each level, array of Property.<number>
    thisModel.bestTimeProperties = []; // best times for each level, in ms, array of Property.<number>
    thisModel.isNewBestTime = false; // is the time for the most-recently-completed game a new best time?
    for ( var level = 0; level < thisModel.numberOfLevels; level++ ) {
      thisModel.bestScoreProperties.push( new Property( 0 ) );
      thisModel.bestTimeProperties.push( new Property( null ) ); // null if a level has no best time yet
    }

    thisModel.gamePhaseProperty = new GamePhaseProperty( GamePhase.SETTINGS,
      /*
       * This function will be called prior to setting the property value.
       * Updates fields so that they are accurate before property listeners are notified.
       */
      function( gamePhase ) {
        if ( gamePhase === GamePhase.SETTINGS ) {
          thisModel.playState = PlayState.NONE;
          thisModel.timer.stop();
        }
        else if ( gamePhase === GamePhase.PLAY ) {
          thisModel.initChallenges();
          thisModel.playState = PlayState.FIRST_CHECK;
          thisModel.score = 0;
          thisModel.timer.start();
        }
        else if ( gamePhase === GamePhase.RESULTS ) {
          thisModel.playState = PlayState.NONE;
          thisModel.timer.stop();
          thisModel.updateBestTime();
        }
        else {
          throw new Error( 'unsupported game phase: ' + gamePhase );
        }
      } );


    //TODO
  }

  return inherit( PropertySet, GameModel, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      //TODO reset other things?
    },

    getPerfectScore: function() {
      return this.challengesPerGame * this.maxPointsPerChallenge;
    }
  } );
} );
