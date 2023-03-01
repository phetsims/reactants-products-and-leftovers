// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * Displays a dynamic numeric value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class NumberNode extends Text {

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

reactantsProductsAndLeftovers.register( 'NumberNode', NumberNode );