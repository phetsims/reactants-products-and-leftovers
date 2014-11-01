// Copyright 2002-2014, University of Colorado Boulder

/**
 * Property that calls a 'pre' function before its value is changed.
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
   * @param {function} pre called before setting the value, single @param is the new value
   * @constructor
   */
  function PreProperty( value, pre ) {
    this.pre = pre; // @private
    Property.call( this, value );
  }

  return inherit( Property, PreProperty, {

    // @override Call the pre function before setting the {*} value.
    set: function( value ) {
      this.pre( value );
      Property.prototype.set.call( this, value );
    }
  } );
} );
