// Copyright 2014-2022, University of Colorado Boulder

/**
 * Panel that contains radio buttons for selecting what's visible/hidden in Game challenges.
 * Provides the ability to hide either molecules or numbers (but not both).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Path, Text } from '../../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import GameVisibility from '../model/GameVisibility.js';

// constants
const TEXT_OPTIONS = { font: new PhetFont( 14 ) };
const FONT_AWESOME_OPTIONS = {
  scale: 0.04,
  fill: 'black'
};

class VisibilityPanel extends Panel {

  /**
   * @param {EnumerationDeprecatedProperty.<GameVisibility>} gameVisibilityProperty
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
      { value: GameVisibility.SHOW_ALL, createNode: tandem => createShowAllNode() },
      { value: GameVisibility.HIDE_MOLECULES, createNode: tandem => createHideMoleculesNode() },
      { value: GameVisibility.HIDE_NUMBERS, createNode: tandem => createHideNumbersNode() }
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
  const eyeNode = new Path( eyeSolidShape, FONT_AWESOME_OPTIONS );
  const textNode = new Text( ReactantsProductsAndLeftoversStrings.showAll, TEXT_OPTIONS );
  return new HBox( {
    children: [ eyeNode, textNode ],
    spacing: 12
  } );
}

/**
 * Creates the content for the 'Hide Molecules' radio button,
 * a closed eye with '123' at lower right, and text to the right.
 * @returns {Node}
 */
function createHideMoleculesNode() {
  const eyeNode = new Path( eyeSlashSolidShape, FONT_AWESOME_OPTIONS );
  const moleculeNode = new Node( {
    // wrap in a Node because H2ONode doesn't work with standard options
    children: [ new H2ONode( RPALConstants.MOLECULE_NODE_OPTIONS ) ],
    scale: 0.4,
    left: eyeNode.right + 2,
    centerY: eyeNode.bottom
  } );
  const textNode = new Text( ReactantsProductsAndLeftoversStrings.hideMolecules, TEXT_OPTIONS );
  return new HBox( {
    children: [ new Node( { children: [ eyeNode, moleculeNode ] } ), textNode ],
    spacing: 7
  } );
}

/**
 * Creates the content for the 'Hide Numbers' radio button,
 * a closed eye with H2O molecule at lower right, and text to the right.
 * @returns {Node}
 */
function createHideNumbersNode() {
  const eyeNode = new Path( eyeSlashSolidShape, FONT_AWESOME_OPTIONS );
  const numbersNode = new Text( '123', {
    font: new PhetFont( 8 ),
    left: eyeNode.right + 2,
    centerY: eyeNode.bottom
  } );
  const textNode = new Text( ReactantsProductsAndLeftoversStrings.hideNumbers, TEXT_OPTIONS );
  return new HBox( {
    children: [ new Node( { children: [ eyeNode, numbersNode ] } ), textNode ],
    spacing: 5
  } );
}

reactantsProductsAndLeftovers.register( 'VisibilityPanel', VisibilityPanel );
export default VisibilityPanel;