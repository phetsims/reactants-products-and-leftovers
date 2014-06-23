// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Molecules' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var MoleculesModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/model/MoleculesModel' );
  var MoleculesView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesView' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var Screen = require( 'JOIST/SCREEN' );

  // strings
  var screenTitle = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.molecules' );

  // images
  //TODO create this programmatically
  var screenImage = require( 'image!REACTANTS_PRODUCTS_AND_LEFTOVERS/Molecules-screen.png' );
  
  function MoleculesScreen() {
    Screen.call( this, screenTitle, 
      new Image( screenImage ),
      function() { return new MoleculesModel(); },
      function( model ) { return new MoleculesView( model ); },
      { backgroundColor: RPALColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, MoleculesScreen );
} );