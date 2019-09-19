// Copyright 2014-2017, University of Colorado Boulder

/**
 * Displays a dynamic numeric value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} numberProperty
   * @param {Object} [options]
   * @constructor
   */
  function NumberNode( numberProperty, options ) {

    options = _.extend( {
      decimalPlaces: 0  // number of decimal places to be displayed
    }, options );

    var self = this;

    Text.call( this, '' );

    // @private update the displayed number
    this.numberPropertyObserver = function( value ) {
      self.text = Util.toFixed( value, options.decimalPlaces );
    };
    this.numberProperty = numberProperty; // @private
    this.numberProperty.link( this.numberPropertyObserver ); // must be unlinked in dispose

    this.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'NumberNode', NumberNode );

  return inherit( Text, NumberNode, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.numberProperty.unlink( this.numberPropertyObserver );
      Text.prototype.dispose.call( this );
    }
  } );
} );
