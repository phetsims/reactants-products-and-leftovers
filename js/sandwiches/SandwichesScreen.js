// Copyright 2014-2020, University of Colorado Boulder

/**
 * 'Sandwiches' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import homeImage from '../../images/Sandwiches-home_png.js';
import navbarImage from '../../images/Sandwiches-navbar_png.js';
import RPALColors from '../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';
import reactantsProductsAndLeftoversStrings from '../reactantsProductsAndLeftoversStrings.js';
import SandwichesModel from './model/SandwichesModel.js';
import SandwichesScreenView from './view/SandwichesScreenView.js';

//TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/71, relocate this a11y string
const screenSandwichesDescription = 'Interact with sandwiches';

class SandwichesScreen extends Screen {

  constructor() {

    const options = {
      name: reactantsProductsAndLeftoversStrings.screen.sandwiches,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new ScreenIcon( new Image( homeImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( navbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      descriptionContent: screenSandwichesDescription
    };

    super(
      () => new SandwichesModel(),
      model => new SandwichesScreenView( model ),
      options
    );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesScreen', SandwichesScreen );
export default SandwichesScreen;