// Copyright 2014-2015, University of Colorado Boulder

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
  var MoleculesScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesScreenView' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenMoleculesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.molecules' );

  /**
   * @constructor
   */
  function MoleculesScreen() {

    var options = {
      name: screenMoleculesString,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: createIcon( { moleculeLineWidth: 0.1 } ),
      navigationBarIcon: createIcon( { moleculeLineWidth: 0.5 } )
    };

    Screen.call( this,
      function() { return new MoleculesModel(); },
      function( model ) { return new MoleculesScreenView( model ); },
      options
    );
  }

  reactantsProductsAndLeftovers.register( 'MoleculesScreen', MoleculesScreen );

  /**
   * Creates the icon for this screen, an H2O molecule.
   * @param {Object} [options]
   * @returns {Node}
   */
  var createIcon = function( options ) {

    options = _.extend( {
      moleculeLineWidth: 1 // lineWidth used to stroke the molecule icon
    }, options );

    // background rectangle
    var width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    // H2O molecule, scaled to fit and centered on background
    var moleculeNode = new H2ONode( { atomOptions: { stroke: 'black', lineWidth: options.moleculeLineWidth } } );
    moleculeNode.setScaleMagnitude(
      Math.min( 0.82 * background.width / moleculeNode.width, 0.82 * background.height / moleculeNode.height ) );
    moleculeNode.center = background.center;

    return new Node( { children: [ background, moleculeNode ] } );
  };

  return inherit( Screen, MoleculesScreen );
} );