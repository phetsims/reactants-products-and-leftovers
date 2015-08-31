// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays a dynamic numeric value.
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
   * @param {Property.<number>} numberProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberNode( numberProperty, options ) {

    options = _.extend( {
      decimalPlaces: 0  // number of decimal places to be displayed
    }, options );

    var thisNode = this;
    Text.call( thisNode, '' );

    // @private update the displayed number
    thisNode.numberPropertyObserver = function( value ) {
      thisNode.text = Util.toFixed( value, options.decimalPlaces );
    };
    thisNode.numberProperty = numberProperty; // @private
    thisNode.numberProperty.link( thisNode.numberPropertyObserver ); // must be unlinked in dispose

    thisNode.mutate( options );
  }

  return inherit( Text, NumberNode, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.numberProperty.unlink( this.numberPropertyObserver );
    }
  } );
} );
