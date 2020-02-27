// Copyright 2014-2019, University of Colorado Boulder

/**
 * Base type for the model in the 'Sandwiches' and 'Molecules' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );

  class RPALBaseModel {

    /**
     * @param {Reaction[]} reactions
     */
    constructor( reactions ) {

      this.reactions = reactions; // @public {Reaction[]} reaction choices
      this.reactionProperty = new Property( this.reactions[ 0 ] ); // @public {Reaction} the selected reaction
    }

    // @override @public
    reset() {
      this.reactionProperty.reset();
      this.reactions.forEach( reaction => reaction.reset() );
    }
  }

  return reactantsProductsAndLeftovers.register( 'RPALBaseModel', RPALBaseModel );
} );
