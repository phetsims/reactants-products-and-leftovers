// Copyright 2002-2014, University of Colorado Boulder

/**
 * Property that calls a function before its value is changed.
 * This is useful for doing things before observers are notified.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {*} value
   * @param {function(value)} beforeFunction called before setting the value
   * @constructor
   */
  function BeforeProperty( value, beforeFunction ) {
    this.beforeFunction = beforeFunction; // @private
    Property.call( this, value );
  }

  return inherit( Property, BeforeProperty, {

    // @override Call beforeFunction before setting the value.
    set: function( value ) {
      this.beforeFunction( value );
      Property.prototype.set.call( this, value );
    }
  } );
} );
