// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReactionFactory from '../../common/model/ReactionFactory.js';
import RPALBaseModel from '../../common/model/RPALBaseModel.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

class MoleculesModel extends RPALBaseModel {

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
export default MoleculesModel;