// Copyright 2002-2014, University of Colorado Boulder

//TODO add cleanup, to unlink observer from value
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
    var thisNode = this;
    Text.call( thisNode, '', options );
    valueProperty.link( function( value ) {
      assert && assert( Util.isInteger( value ) );
      thisNode.text = '' + value;
    } );
  }

  return inherit( Text, IntegerNode );
} );
