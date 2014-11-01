// Copyright 2002-2014, University of Colorado Boulder

/**
 * 'Molecules' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/model/MoleculesModel' );
  var MoleculesView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesView' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var Screen = require( 'JOIST/SCREEN' );

  // strings
  var screenTitle = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.molecules' );

  function MoleculesScreen() {
    Screen.call( this, screenTitle,
      createIcon(),
      function() { return new MoleculesModel(); },
      function( model ) { return new MoleculesView( model ); },
      { backgroundColor: RPALColors.SCREEN_BACKGROUND }
    );
  }

  // creates the {Node} icon for this screen
  var createIcon = function() {

    // background rectangle
    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    // H2O molecules, scaled to fit and centered on background
    var moleculeNode = new H2ONode( { stroke: 'gray', lineWidth: 0.1 } );
    moleculeNode.setScaleMagnitude( Math.min( 0.82 * background.width / moleculeNode.width, 0.82 * background.height / moleculeNode.height ) );
    moleculeNode.center = background.center;

    return new Node( { children: [ background, moleculeNode ] } );
  };

  return inherit( Screen, MoleculesScreen );
} );