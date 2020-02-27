// Copyright 2014-2019, University of Colorado Boulder

/**
 * Displays a dynamic numeric value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  class NumberNode extends Text {

    /**
     * @param {Property.<number>} numberProperty
     * @param {Object} [options]
     */
    constructor( numberProperty, options ) {

      options = merge( {
        decimalPlaces: 0  // number of decimal places to be displayed
      }, options );

      super( '' );

      // @private update the displayed number
      this.numberPropertyObserver = value => {
        this.text = Utils.toFixed( value, options.decimalPlaces );
      };
      this.numberProperty = numberProperty; // @private
      this.numberProperty.link( this.numberPropertyObserver ); // must be unlinked in dispose

      this.mutate( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      this.numberProperty.unlink( this.numberPropertyObserver );
      super.dispose();
    }
  }

  return reactantsProductsAndLeftovers.register( 'NumberNode', NumberNode );
} );
