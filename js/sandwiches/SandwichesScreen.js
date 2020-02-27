// Copyright 2014-2019, University of Colorado Boulder

/**
 * 'Sandwiches' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const SandwichesModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichesModel' );
  const SandwichesScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenSandwichesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.sandwiches' );

  // a11y strings
  const screenSandwichesDescription = 'Interact with sandwiches';

  // images
  const homeImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/Sandwiches-home.png' );
  const navbarImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/Sandwiches-navbar.png' );

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

  return reactantsProductsAndLeftovers.register( 'SandwichesScreen', SandwichesScreen );
} );