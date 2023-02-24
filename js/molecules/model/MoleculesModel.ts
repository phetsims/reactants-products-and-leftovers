// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * Model for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReactionFactory from '../../common/model/ReactionFactory.js';
import RPALBaseModel from '../../common/model/RPALBaseModel.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class MoleculesModel extends RPALBaseModel {

  constructor() {
    super( [
      // reaction choices
      ReactionFactory.makeWater(),
      ReactionFactory.makeAmmonia(),
      ReactionFactory.combustMethane()
    ] );
  }
}

reactantsProductsAndLeftovers.register( 'MoleculesModel', MoleculesModel );