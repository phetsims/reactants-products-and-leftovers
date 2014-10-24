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
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );

  // constants
  var DUMMY_CHALLENGE = new Challenge( ReactionFactory.makeWater(), ChallengeType.BEFORE );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GameModel( options ) {

    // Run a sanity test on ChallengeFactory.
    if ( RPALQueryParameters.TEST_GAME ) {
      ChallengeFactory.test();
    }

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

    // These things are read-only, they should not be changed once the model is instantiated.
    thisModel.numberOfLevels = options.numberOfLevels;
    thisModel.challengesPerGame = options.challengesPerGame;
    thisModel.maxPointsPerChallenge = 2;
    thisModel.maxQuantity = options.maxQuantity;

    // These things change as game-play progresses.
    thisModel.challenges = []; // {[Challenge]}
    thisModel.bestScoreProperties = []; // best scores for each level, array of Property.<number>
    thisModel.bestTimeProperties = []; // best times for each level, in ms, array of Property.<number>
    thisModel.isNewBestTime = false; // is the time for the most-recently-completed game a new best time?
    for ( var level = 0; level < thisModel.numberOfLevels; level++ ) {
      thisModel.bestScoreProperties.push( new Property( 0 ) );
      thisModel.bestTimeProperties.push( new Property( null ) ); // null if a level has no best time yet
    }

    thisModel.timer = new GameTimer();

    thisModel.gamePhaseProperty = new GamePhaseProperty( GamePhase.SETTINGS,
      /*
       * This function will be called prior to setting the gamePhaseProperty value.
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

    thisModel.initChallenges();

    // Do this after initChallenges, because this will fire immediately and needs to have an initial set of challenges.
    thisModel.playStateProperty.link( function( playState ) {
      if ( playState === PlayState.FIRST_CHECK ) {
        if ( thisModel.challengeIndex === thisModel.challenges.length - 1 ) {
          // game has been completed
          thisModel.gamePhaseProperty.set( GamePhase.RESULTS );
          if ( thisModel.score > thisModel.bestScoreProperties[ thisModel.level ].get() ) {
            thisModel.bestScoreProperties[ thisModel.level ].set( thisModel.score );
          }
        }
        else {
          // next challenge
          thisModel.challengeIndex = thisModel.challengeIndex + 1;
          thisModel.challenge = thisModel.challenges[thisModel.challengeIndex];
        }
      }
      else if ( playState === PlayState.NEXT ) {
        //TODO
//        thisModel.challenge.setAnswerVisible( true );
      }
    } );
  }

  return inherit( PropertySet, GameModel, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.gamePhaseProperty.reset();
      this.bestScoreProperties.forEach( function( property ) {
        property.set( 0 );
      } );
    },

    getPerfectScore: function() {
      return this.challengesPerGame * this.maxPointsPerChallenge;
    },

    isPerfectScore: function() {
      return this.score === this.getPerfectScore();
    },

    // Compute points to be awarded for a correct answer.
    computePoints: function( attempts ) {
      return Math.max( 0, this.maxPointsPerChallenge - attempts + 1 );
    },

    /**
     * Skips the current challenge.
     * This is a developer feature.
     * Score and best times are meaningless after using this.
     */
    skipCurrentChallenge: function() {
      this.playState = PlayState.NEXT;
      this.playState = PlayState.FIRST_CHECK;
    },

    /**
     * Skips all challenges, advances immediately to the game results.
     */
    skipAllChallenges: function() {
      this.gamePhaseProperty.set( GamePhase.RESULTS );
    },

    /**
     * Replays the current challenge.
     * This is a developer feature.
     * Score and best times are meaningless after using this.
     */
    replayCurrentChallenge: function() {
      this.challenge.reset();
      this.playState = PlayState.FIRST_CHECK;
    },

    // Updates the best time for the current level, at the end of a timed game with a perfect score.
    updateBestTime: function() {
      assert && assert( !this.timer.isRunning );
      if ( this.timerEnabled && this.isPerfectScore() ) {
        var level = this.level;
        var time = this.timer.elapsedTime;
        this.isNewBestTime = false;
        if ( !this.bestTimeProperties[ level ].get() ) {
          // there was no previous time for this level
          this.bestTimeProperties[ level ].set( time );
        }
        else if ( time < this.bestTimeProperties[ level ].get() ) {
          // we have a new best time for this level
          this.bestTimeProperties[ level ].set( time );
          this.isNewBestTime = true;
        }
      }
    },

    // initializes a new set of challenges for the current level
    initChallenges: function() {
      this.challengeIndex = -1;
      this.challenges = ChallengeFactory.createChallenges( this.challengesPerGame, this.level, this.maxQuantity, {
        moleculesVisible: this.moleculesVisible,
        numbersVisible: this.numbersVisible
      } );
    }
  } );
} );
