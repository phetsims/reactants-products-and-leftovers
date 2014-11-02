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
      decimalPlaces: 0
    }, options );

    var thisNode = this;
    Text.call( thisNode, '' );

    thisNode.numberProperty = numberProperty; // @private

    // @private update the displayed number
    thisNode.numberPropertyObserver = function( value ) {
      thisNode.text = Util.toFixed( value, options.decimalPlaces );
    };
    numberProperty.link( thisNode.numberPropertyObserver );

    thisNode.mutate( options );
  }

  return inherit( Text, NumberNode, {

    // Unlinks from the property. The node is no longer functional after calling this function.
    dispose: function() {
      this.numberProperty.unlink( this.numberPropertyObserver );
    }
  } );
} );
