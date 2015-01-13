// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeFactory = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeFactory' );
  var GamePhase = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/GamePhase' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );

  // constants
  var POINTS_FIRST_CHECK = 2;
  var POINTS_SECOND_CHECK = 1;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GameModel( options ) {

    options = _.extend( {
      level: 0, // the current level in the game, numbered starting with zero
      numberOfLevels: 3, // number of levels in the game
      maxQuantity: RPALConstants.QUANTITY_RANGE.max // maximum quantity of any substance in a reaction
    }, options );

    var thisModel = this;

    PropertySet.call( thisModel, {
      soundEnabled: true, // {boolean} is sound turned on?
      timerEnabled: false, // {boolean} is the timer turned on?
      moleculesVisible: true, // {boolean} are molecules shown in the challenge?
      numbersVisible: true, // {boolean} are quantities shown in the challenge?
      level: 0, // {number} read-only, the current level, starts at 0 in the model, presented as starting from 1 in the view
      score: 0, // {number} read-only, how many points the user has earned for the current game
      numberOfChallenges: 0, // {number} read-only, the number of challenges in the current game being played
      challenge: null, // {Challenge} read-only, the current challenge being played
      challengeIndex: -1, // {number} read-only, the index of the current challenge, -1 indicates no challenge
      gamePhase: GamePhase.SETTINGS, // {GamePhase} read-only, the current 'phase' of the game
      playState: PlayState.NONE  // {PlayState} read-only, the current 'play state' of the game
    } );

    // These fields are read-only, they should not be changed once the model is instantiated.
    thisModel.numberOfLevels = options.numberOfLevels;
    thisModel.maxQuantity = options.maxQuantity;

    // These fields are read-only, they change as game-play progresses.
    thisModel.challenges = []; // {Challenge[]} the set of challenges for the current game being played
    thisModel.bestScoreProperties = []; // {Property.<number>[]} best scores for each level
    thisModel.bestTimeProperties = []; // {Property.<number>[]} best times for each level, in ms
    thisModel.isNewBestTime = false; // {boolean} is the time for the most-recently-completed game a new best time?
    for ( var level = 0; level < thisModel.numberOfLevels; level++ ) {
      thisModel.bestScoreProperties.push( new Property( 0 ) );
      thisModel.bestTimeProperties.push( new Property( null ) ); // null if a level has no best time yet
    }

    thisModel.timer = new GameTimer();
  }

  return inherit( PropertySet, GameModel, {

    // Resets the model to its initial state.
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.bestScoreProperties.forEach( function( property ) { property.set( 0 ); } );
      this.bestTimeProperties.forEach( function( property ) { property.set( null ); } );
    },

    // @private Advances to GamePhase.SETTINGS, shows the user-interface for selecting game settings
    settings: function() {
      this.timer.stop();
      this.playState = PlayState.NONE;
      this.gamePhase = GamePhase.SETTINGS; // do this last, so that other stuff is set up before observers are notified
    },

    // @private Advances to GamePhase.PLAY, plays a game for the specified {number} level
    play: function( level ) {
      assert && assert( this.gamePhase === GamePhase.SETTINGS );
      this.level = level;
      this.score = 0;
      this.initChallenges();
      this.timer.start();
      this.playState = PlayState.FIRST_CHECK;
      this.gamePhase = GamePhase.PLAY; // do this last, so that other stuff is set up before observers are notified
    },

    // @private Advances to GamePhase.RESULTS, ends the current game and displays results
    results: function() {
      assert && assert( this.gamePhase === GamePhase.PLAY );
      this.timer.stop();
      this.updateBestScore();
      this.updateBestTime();
      this.playState = PlayState.NONE;
      this.gamePhase = GamePhase.RESULTS; // do this last, so that other stuff is set up before observers are notified
    },

    // Checks the current guess
    check: function() {
      assert && assert( this.playState === PlayState.FIRST_CHECK || this.playState === PlayState.SECOND_CHECK );
      if ( this.challenge.isCorrect() ) {
        // stop the timer as soon as we successfully complete the last challenge
        if ( this.challengeIndex === this.challenges.length - 1 ) {
          this.timer.stop();
        }
        this.challenge.points = ( this.playState === PlayState.FIRST_CHECK ) ? POINTS_FIRST_CHECK : POINTS_SECOND_CHECK;
        this.score = this.score + this.challenge.points;
        this.playState = PlayState.NEXT;
      }
      else {
        this.playState = ( this.playState === PlayState.FIRST_CHECK ) ? PlayState.TRY_AGAIN : PlayState.SHOW_ANSWER;
      }
    },

    // Makes another attempt at solving the challenge
    tryAgain: function() {
      assert && assert( this.playState === PlayState.TRY_AGAIN );
      this.playState = PlayState.SECOND_CHECK;
    },

    // Shows the correct answer
    showAnswer: function() {
      assert && assert( this.playState === PlayState.SHOW_ANSWER );
      this.challenge.showAnswer();
      this.playState = PlayState.NEXT;
    },

    // Advances to the next challenge
    next: function() {
      if ( this.challengeIndex === this.challenges.length - 1 ) {
        // game has been completed, advance to GamePhase.RESULTS
        this.results();
      }
      else {
        // advance to next challenge
        this.challengeIndex = this.challengeIndex + 1;
        this.challenge = this.challenges[ this.challengeIndex ];
        this.playState = PlayState.FIRST_CHECK;
      }
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
      return ChallengeFactory.getNumberOfChallenges( level ) * POINTS_FIRST_CHECK;
    },

    /**
     * Is the current score perfect?
     * @returns {boolean}
     */
    isPerfectScore: function() {
      return this.score === this.getPerfectScore( this.level );
    },

    // @private Updates the best score for the current level.
    updateBestScore: function() {
      if ( this.score > this.bestScoreProperties[ this.level ].get() ) {
        this.bestScoreProperties[ this.level ].set( this.score );
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
      this.challenges = ChallengeFactory.createChallenges( this.level, this.maxQuantity, {
        moleculesVisible: this.moleculesVisible,
        numbersVisible: this.numbersVisible
      } );
      this.numberOfChallenges = this.challenges.length;
      this.challengeIndex = 0;
      this.challenge = this.challenges[ this.challengeIndex ];
    },

    /**
     * DEBUG
     * Skips the current challenge.
     * Score and best times are meaningless after using this.
     * This is a developer feature.
     */
    skipCurrentChallenge: function() {
      this.next();
    },

    /**
     * DEBUG
     * Replays the current challenge.
     * Score and best times are meaningless after using this.
     * This is a developer feature.
     */
    replayCurrentChallenge: function() {
      this.challenge.reset();
      this.playState = PlayState.FIRST_CHECK;
    }
  } );
} );
