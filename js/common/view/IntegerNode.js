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
   * @param {Object} [options]
   * @constructor
   */
  function IntegerNode( valueProperty, options ) {

    var thisNode = this;
    Text.call( thisNode, '', options );

    // When the value changes ...
    var valuePropertyObserver = function( value ) {
      assert && assert( Util.isInteger( value ) );
      thisNode.text = '' + value;
    };
    valueProperty.link( valuePropertyObserver );

    // @public Unlinks from the value property. The node is no longer functional after calling this function.
    thisNode.unlink = function() {
      valueProperty.unlink( valuePropertyObserver );
    };
  }

  return inherit( Text, IntegerNode );
} );
