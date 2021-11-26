// Copyright 2014-2020, University of Colorado Boulder

/**
 * 'Molecules' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import H2ONode from '../../../nitroglycerin/js/nodes/H2ONode.js';
import merge from '../../../phet-core/js/merge.js';
import { Node } from '../../../scenery/js/imports.js';
import { Rectangle } from '../../../scenery/js/imports.js';
import RPALColors from '../common/RPALColors.js';
import reactantsProductsAndLeftovers from '../reactantsProductsAndLeftovers.js';
import reactantsProductsAndLeftoversStrings from '../reactantsProductsAndLeftoversStrings.js';
import MoleculesModel from './model/MoleculesModel.js';
import MoleculesScreenView from './view/MoleculesScreenView.js';

class MoleculesScreen extends Screen {

  constructor() {

    const options = {
      name: reactantsProductsAndLeftoversStrings.screen.molecules,
      backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
      homeScreenIcon: createIcon( { moleculeLineWidth: 0.1 } ),
      navigationBarIcon: createIcon( { moleculeLineWidth: 0.5 } )
    };

    super(
      () => new MoleculesModel(),
      model => new MoleculesScreenView( model ),
      options
    );
  }
}

/**
 * Creates the icon for this screen, an H2O molecule.
 * @param {Object} [options]
 * @returns {ScreenIcon}
 */
function createIcon( options ) {

  options = merge( {
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

  const iconNode = new Node( { children: [ background, moleculeNode ] } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

reactantsProductsAndLeftovers.register( 'MoleculesScreen', MoleculesScreen );
export default MoleculesScreen;