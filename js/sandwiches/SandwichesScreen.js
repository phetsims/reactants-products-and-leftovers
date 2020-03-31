// Copyright 2014-2020, University of Colorado Boulder

/**
 * 'Sandwiches' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import homeImage from '../../images/Sandwiches-home_png.js';
import navbarImage from '../../images/Sandwiches-navbar_png.js';
import RPALColors from '../common/RPALColors.js';
import reactantsProductsAndLeftoversStrings from '../reactantsProductsAndLeftoversStrings.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';
import SandwichesModel from './model/SandwichesModel.js';
import SandwichesScreenView from './view/SandwichesScreenView.js';

const screenSandwichesString = reactantsProductsAndLeftoversStrings.screen.sandwiches;

// a11y strings
const screenSandwichesDescription = 'Interact with sandwiches';


class SandwichesScreen extends Screen {

  constructor() {

    const options = {
      name: screenSandwichesString,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new Image( homeImage ),
      navigationBarIcon: new Image( navbarImage ),
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