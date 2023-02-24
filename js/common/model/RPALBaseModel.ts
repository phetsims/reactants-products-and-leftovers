// Copyright 2014-2023, University of Colorado Boulder

/**
 * Base type for the model in the 'Sandwiches' and 'Molecules' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import Reaction from './Reaction.js';

export default class RPALBaseModel implements TModel {

  // reaction choices
  public readonly reactions: Reaction[];

  // the selected reaction
  public readonly reactionProperty: Property<Reaction>;

  public constructor( reactions: Reaction[] ) {
    this.reactions = reactions;
    this.reactionProperty = new Property( this.reactions[ 0 ], {
      validValues: reactions
    } );
  }

  public reset(): void {
    this.reactionProperty.reset();
    this.reactions.forEach( reaction => reaction.reset() );
  }
}

reactantsProductsAndLeftovers.register( 'RPALBaseModel', RPALBaseModel );