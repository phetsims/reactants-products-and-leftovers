// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays a dynamic integer value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {*} options
   * @constructor
   */
  function IntegerNode( valueProperty, options ) {

    var thisNode = this;
    Text.call( thisNode, '', options );

    // @private When the value changes ...
    thisNode.observer = function( value ) {
      assert && assert( Util.isInteger( value ) );
      thisNode.text = '' + value;
    };
    valueProperty.link( this.observer );
    thisNode.valueProperty = valueProperty; // @private
  }

  return inherit( Text, IntegerNode, {

    // Unlinks from the value property. This node should not be used after calling this function.
    unlink: function() {
      this.valueProperty.unlink( this.observer );
    }
  } );
} );
