// Copyright 2002-2014, University of Colorado Boulder

/**
 * 'Sandwiches' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var SandwichesModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichesModel' );
  var SandwichesView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/view/SandwichesView' );
  var Screen = require( 'JOIST/SCREEN' );

  // strings
  var screenTitle = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.sandwiches' );

  // images
  var homeImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/Sandwiches-home.png' );
  var navbarImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/Sandwiches-navbar.png' );

  function SandwichesScreen() {
    Screen.call( this, screenTitle,
      new Image( homeImage ),
      function() { return new SandwichesModel(); },
      function( model ) { return new SandwichesView( model ); },
      {
        backgroundColor: RPALColors.SCREEN_BACKGROUND,
        navigationBarIcon: new Image( navbarImage )
      }
    );
  }

  return inherit( Screen, SandwichesScreen );
} );