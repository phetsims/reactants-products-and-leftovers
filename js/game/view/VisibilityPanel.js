// Copyright 2014-2020, University of Colorado Boulder

/**
 * Panel that contains radio buttons for selecting what's visible/hidden in Game challenges.
 * Provides the ability to hide either molecules or numbers (but not both).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import merge from '../../../../phet-core/js/merge.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import Panel from '../../../../sun/js/Panel.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALFont from '../../common/view/RPALFont.js';
import reactantsProductsAndLeftoversStrings from '../../reactantsProductsAndLeftoversStrings.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import GameVisibility from '../model/GameVisibility.js';

// strings
const hideMoleculesString = reactantsProductsAndLeftoversStrings.hideMolecules;
const hideNumbersString = reactantsProductsAndLeftoversStrings.hideNumbers;
const showAllString = reactantsProductsAndLeftoversStrings.showAll;

// constants
const TEXT_OPTIONS = { font: new RPALFont( 14 ) };
const FONT_AWESOME_OPTIONS = { scale: 0.5 };

class VisibilityPanel extends Panel {

  /**
   * @param {EnumerationProperty.<GameVisibility>} gameVisibilityProperty
   * @param {Object} [options]
   */
  constructor( gameVisibilityProperty, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 235, 245, 255 )',
      stroke: 'rgb( 180, 180, 180 )',
      lineWidth: 0.5
    }, options );

    const radioButtonItems = [
      { value: GameVisibility.SHOW_ALL, node: createShowAllNode() },
      { value: GameVisibility.HIDE_MOLECULES, node: createHideMoleculesNode() },
      { value: GameVisibility.HIDE_NUMBERS, node: createHideNumbersNode() }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( gameVisibilityProperty, radioButtonItems, {
      spacing: 15,
      touchAreaXDilation: 10,
      touchAreaYDilation: 6,
      radioButtonOptions: {
        radius: 8,
        xSpacing: 10
      }
    } );

    super( radioButtonGroup, options );
  }
}

/**
 * Creates the content for the 'Show All' radio button, an open eye with text to the right of it.
 * @returns {Node}
 */
function createShowAllNode() {
  const eyeNode = new FontAwesomeNode( 'eye_open', FONT_AWESOME_OPTIONS );
  const textNode = new Text( showAllString, TEXT_OPTIONS );
  return new LayoutBox( {
    children: [ eyeNode, textNode ],
    orientation: 'horizontal',
    spacing: 12
  } );
}

/**
 * Creates the content for the 'Hide Molecules' radio button,
 * a closed eye with '123' at lower right, and text to the right.
 * @returns {Node}
 */
function createHideMoleculesNode() {
  const eyeNode = new FontAwesomeNode( 'eye_close', FONT_AWESOME_OPTIONS );
  const moleculeNode = new Node( {
    // wrap in a Node because H2ONode doesn't work with standard options
    children: [ new H2ONode( RPALConstants.MOLECULE_OPTIONS ) ],
    scale: 0.4,
    centerX: eyeNode.right,
    centerY: eyeNode.bottom
  } );
  const textNode = new Text( hideMoleculesString, TEXT_OPTIONS );
  return new LayoutBox( {
    children: [ new Node( { children: [ eyeNode, moleculeNode ] } ), textNode ],
    orientation: 'horizontal',
    spacing: 7
  } );
}

/**
 * Creates the content for the 'Hide Numbers' radio button,
 * a closed eye with H2O molecule at lower right, and text to the right.
 * @returns {Node}
 */
function createHideNumbersNode() {
  const eyeNode = new FontAwesomeNode( 'eye_close', FONT_AWESOME_OPTIONS );
  const numbersNode = new Text( '123', {
    font: new RPALFont( 8 ),
    centerX: eyeNode.right + 2,
    centerY: eyeNode.bottom
  } );
  const textNode = new Text( hideNumbersString, TEXT_OPTIONS );
  return new LayoutBox( {
    children: [ new Node( { children: [ eyeNode, numbersNode ] } ), textNode ],
    orientation: 'horizontal',
    spacing: 5
  } );
}

reactantsProductsAndLeftovers.register( 'VisibilityPanel', VisibilityPanel );
export default VisibilityPanel;