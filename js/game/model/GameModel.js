// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BeforeProperty = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/BeforeProperty' );
  var ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GameModel( options ) {

    options = _.extend( {
      level: 0,
      numberOfLevels: 3,
      maxQuantity: RPALConstants.QUANTITY_RANGE.max
    }, options );

    var thisModel = this;

    PropertySet.call( thisModel, {
      soundEnabled: true, // {boolean} is sound turned on?
      timerEnabled: false, // {boolean} is the timer turned on?
      moleculesVisible: true, // {boolean} are molecules shown in the challenge?
      numbersVisible: true, // {boolean} are quantities shown in the challenge?
      level: 0, // {number} the current level
      challenge: null, // {Challenge} the current challenge being played
      numberOfChallenges: 0, // {number} the number of challenges in the current game being played
      score: 0, // {number} how many points the user has earned for the current game
      challengeIndex: -1, // {number} the index of the current challenge, -1 indicates no challenge
      playState: PlayState.NONE  // {PlayState} the current 'play state' of the game (see PlayState)
    } );

    // These things are read-only, they should not be changed once the model is instantiated.
    thisModel.numberOfLevels = options.numberOfLevels;
    thisModel.maxPointsPerChallenge = 2;
    thisModel.maxQuantity = options.maxQuantity;

    // These things are read-only, they change as game-play progresses.
    thisModel.challenges = []; // {[Challenge]} the set of challenges for the current game being played
    thisModel.bestScoreProperties = []; // [Property.<number>] best scores for each level
    thisModel.bestTimeProperties = []; // [Property.<number>] best times for each level, in ms
    thisModel.isNewBestTime = false; // {boolean} is the time for the most-recently-completed game a new best time?
    for ( var level = 0; level < thisModel.numberOfLevels; level++ ) {
      thisModel.bestScoreProperties.push( new Property( 0 ) );
      thisModel.bestTimeProperties.push( new Property( null ) ); // null if a level has no best time yet
    }

    thisModel.timer = new GameTimer();

    // the phase that the game is in, see GamePhase
    thisModel.gamePhaseProperty = new BeforeProperty( GamePhase.SETTINGS,
      /*
       * This function will be called prior to setting the gamePhaseProperty value.
       * Updates fields so that they are accurate before property observers are notified.
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

    // Defer until the user starts playing a game.
    thisModel.playStateProperty.lazyLink( function( playState ) {
      if ( playState === PlayState.FIRST_CHECK ) {
        if ( thisModel.challengeIndex === thisModel.challenges.length - 1 ) {
          // game has been completed
          thisModel.gamePhaseProperty.set( GamePhase.RESULTS );
          if ( thisModel.score > thisModel.bestScoreProperties[ thisModel.level ].get() ) {
            thisModel.bestScoreProperties[ thisModel.level ].set( thisModel.score );
          }
        }
        else {
          // advance to next challenge
          thisModel.challengeIndex = thisModel.challengeIndex + 1;
          thisModel.challenge = thisModel.challenges[thisModel.challengeIndex];
        }
      }
    } );
  }

  return inherit( PropertySet, GameModel, {

    // Resets the model to its initial state.
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.gamePhaseProperty.reset();
      this.bestScoreProperties.forEach( function( property ) { property.set( 0 ); } );
    },

    /**
     * Gets the number of challenges for the specified level.
     * @param {number} level
     * @returns {number}
     */
    getNumberOfChallenges: function( level ) {
      return ChallengeFactory.getNumberOfChallenges( level );
    },

    /**
     * Gets the perfect score for the specified level.
     * @param {number} level
     * @returns {number}
     */
    getPerfectScore: function( level ) {
      return ChallengeFactory.getNumberOfChallenges( level ) * this.maxPointsPerChallenge;
    },

    /**
     * Is the current score perfect?
     * @returns {boolean}
     */
    isPerfectScore: function() {
      return this.score === this.getPerfectScore( this.level );
    },

    /**
     * Computes points that would be awarded if the current guess were correct.
     * @returns {number}
     */
    computePoints: function() {
      assert && assert( this.playState === PlayState.FIRST_CHECK || this.playState === PlayState.SECOND_CHECK );
      var attempts = ( this.playState === PlayState.FIRST_CHECK ) ? 1 : 2;
      return Math.max( 0, this.maxPointsPerChallenge - attempts + 1 );
    },

    /**
     * DEBUG
     * Skips the current challenge.
     * Score and best times are meaningless after using this.
     * This is a developer feature.
     */
    skipCurrentChallenge: function() {
      this.playState = PlayState.NEXT;
      this.playState = PlayState.FIRST_CHECK;
    },

    /**
     * DEBUG
     * Skips all challenges, advances immediately to the game results.
     * This is a developer feature.
     */
    skipAllChallenges: function() {
      this.gamePhaseProperty.set( GamePhase.RESULTS );
    },

    /**
     * DEBUG
     * Replays the current challenge.
     * Score and best times are meaningless after using this.
     * This is a developer feature.
     */
    replayCurrentChallenge: function() {
      this.challenge.reset();
      if ( this.playState !== PlayState.FIRST_CHECK ) {
        this.challengeIndex = this.challengeIndex - 1;
        this.playState = PlayState.FIRST_CHECK;
      }
    },

    // @private Updates the best time for the current level, at the end of a timed game with a perfect score.
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

    // @private initializes a new set of challenges for the current level
    initChallenges: function() {
      this.challengeIndex = -1;
      this.challenges = ChallengeFactory.createChallenges( this.level, this.maxQuantity, {
        moleculesVisible: this.moleculesVisible,
        numbersVisible: this.numbersVisible
      } );
      this.numberOfChallenges = this.challenges.length;
    }
  } );
} );
