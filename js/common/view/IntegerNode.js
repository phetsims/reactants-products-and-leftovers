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

  function IntegerNode( valueProperty, options ) {
    Text.call( this, options );
    valueProperty.link( function( value ) {
      assert && assert( Util.isInteger( value ) );
      value.text = '' + value;
    } );
  }

  return inherit( Text, IntegerNode );
} );
