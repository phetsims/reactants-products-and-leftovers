// Copyright 2014-2023, University of Colorado Boulder

/**
 * 'Sandwiches' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import sandwichesHomeScreenIcon_png from '../../images/sandwichesHomeScreenIcon_png.js';
import sandwichesNavbarIcon_png from '../../images/sandwichesNavbarIcon_png.js';
import RPALColors from '../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../ReactantsProductsAndLeftoversStrings.js';
import SandwichesModel from './model/SandwichesModel.js';
import SandwichesScreenView from './view/SandwichesScreenView.js';

export default class SandwichesScreen extends Screen {

  constructor() {

    const options = {
      name: ReactantsProductsAndLeftoversStrings.screen.sandwichesStringProperty,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new ScreenIcon( new Image( sandwichesHomeScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( sandwichesNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    };

    super(
      () => new SandwichesModel(),
      model => new SandwichesScreenView( model ),
      options
    );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesScreen', SandwichesScreen );