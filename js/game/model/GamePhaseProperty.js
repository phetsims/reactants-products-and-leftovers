// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * Property used for the game phase.
   * It has a 'hook' function that is called before the value is changed.
   * This is useful for setting the various state parameters of the game before
   * notifying observes that the game phase has changed.
   * @param {GamePhase} value
   * @param {function} hook function with one parameter of type {GamePhase}
   * @constructor
   */
  function GamePhaseProperty( value, hook ) {
    this.hook = hook;
    Property.call( this, value );
  }

  return inherit( Property, GamePhaseProperty, {

    // @override Call the hook before setting the value.
    set: function( value ) {
      this.hook( value );
      Property.prototype.set.call( this, value );
    }
  } );
} );
