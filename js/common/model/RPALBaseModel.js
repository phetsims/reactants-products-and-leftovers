// Copyright 2014-2023, University of Colorado Boulder

/**
 * Base type for the model in the 'Sandwiches' and 'Molecules' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class RPALBaseModel {

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

reactantsProductsAndLeftovers.register( 'RPALBaseModel', RPALBaseModel );