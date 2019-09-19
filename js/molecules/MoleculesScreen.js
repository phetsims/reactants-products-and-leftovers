// Copyright 2014-2018, University of Colorado Boulder

/**
 * 'Molecules' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MoleculesModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/model/MoleculesModel' );
  const MoleculesScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesScreenView' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenMoleculesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.molecules' );

  // a11y strings
  const screenMoleculesDescriptionString = 'Investigate molecules';

  /**
   * @constructor
   */
  function MoleculesScreen() {

    const options = {
      name: screenMoleculesString,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: createIcon( { moleculeLineWidth: 0.1 } ),
      navigationBarIcon: createIcon( { moleculeLineWidth: 0.5 } ),
      descriptionContent: screenMoleculesDescriptionString
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
    const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
    const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
    const background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    // H2O molecule, scaled to fit and centered on background
    const moleculeNode = new H2ONode( { atomOptions: { stroke: 'black', lineWidth: options.moleculeLineWidth } } );
    moleculeNode.setScaleMagnitude(
      Math.min( 0.82 * background.width / moleculeNode.width, 0.82 * background.height / moleculeNode.height ) );
    moleculeNode.center = background.center;

    return new Node( { children: [ background, moleculeNode ] } );
  };

  return inherit( Screen, MoleculesScreen );
} );