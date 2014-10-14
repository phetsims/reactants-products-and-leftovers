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
   * @param {Property.<number>} valueProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberNode( valueProperty, options ) {

    options = _.extend( {
      decimalPlaces: 0
    }, options );

    var thisNode = this;
    Text.call( thisNode, '' );

    thisNode.valueProperty = valueProperty; // @private

    // @private When the value changes ...
    thisNode.valuePropertyObserver = function( value ) {
      thisNode.text = Util.toFixed( value, options.decimalPlaces );
    };
    valueProperty.link( thisNode.valuePropertyObserver );

    thisNode.mutate( options );
  }

  return inherit( Text, NumberNode, {

    // @public Unlinks from the value property. The node is no longer functional after calling this function.
    dispose: function() {
      this.valueProperty.unlink( this.valuePropertyObserver );
    }
  } );
} );
