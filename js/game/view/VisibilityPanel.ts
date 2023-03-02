// Copyright 2014-2023, University of Colorado Boulder

/**
 * Panel that contains radio buttons for selecting what's visible/hidden in Game challenges.
 * Provides the ability to hide either molecules or numbers (but not both).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Path, Text } from '../../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import GameVisibility from '../model/GameVisibility.js';

const TEXT_OPTIONS = { font: new PhetFont( 14 ) };
const FONT_AWESOME_OPTIONS = {
  scale: 0.04,
  fill: 'black'
};

type SelfOptions = EmptySelfOptions;

type VisibilityPanelOptions = SelfOptions & PickOptional<PanelOptions, 'maxWidth'>;

export default class VisibilityPanel extends Panel {

  public constructor( gameVisibilityProperty: EnumerationProperty<GameVisibility>, providedOptions?: VisibilityPanelOptions ) {

    const options = optionize<VisibilityPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 235, 245, 255 )',
      stroke: 'rgb( 180, 180, 180 )',
      lineWidth: 0.5
    }, providedOptions );

    const radioButtonItems = [
      { value: GameVisibility.SHOW_ALL, createNode: () => createShowAllNode() },
      { value: GameVisibility.HIDE_MOLECULES, createNode: () => createHideMoleculesNode() },
      { value: GameVisibility.HIDE_NUMBERS, createNode: () => createHideNumbersNode() }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( gameVisibilityProperty, radioButtonItems, {
      spacing: 15,
      align: 'left',
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
 */
function createShowAllNode(): Node {
  const eyeNode = new Path( eyeSolidShape, FONT_AWESOME_OPTIONS );
  const textNode = new Text( ReactantsProductsAndLeftoversStrings.showAllStringProperty, TEXT_OPTIONS );
  return new HBox( {
    children: [ eyeNode, textNode ],
    spacing: 12
  } );
}

/**
 * Creates the content for the 'Hide Molecules' radio button,
 * a closed eye with '123' at lower right, and text to the right.
 */
function createHideMoleculesNode(): Node {
  const eyeNode = new Path( eyeSlashSolidShape, FONT_AWESOME_OPTIONS );
  const moleculeNode = new Node( {
    // wrap in a Node because H2ONode doesn't work with standard options
    children: [ new H2ONode( RPALConstants.MOLECULE_NODE_OPTIONS ) ],
    scale: 0.4,
    left: eyeNode.right + 2,
    centerY: eyeNode.bottom
  } );
  const textNode = new Text( ReactantsProductsAndLeftoversStrings.hideMoleculesStringProperty, TEXT_OPTIONS );
  return new HBox( {
    children: [ new Node( { children: [ eyeNode, moleculeNode ] } ), textNode ],
    spacing: 7
  } );
}

/**
 * Creates the content for the 'Hide Numbers' radio button,
 * a closed eye with H2O molecule at lower right, and text to the right.
 */
function createHideNumbersNode(): Node {
  const eyeNode = new Path( eyeSlashSolidShape, FONT_AWESOME_OPTIONS );
  const numbersNode = new Text( '123', {
    font: new PhetFont( 8 ),
    left: eyeNode.right + 2,
    centerY: eyeNode.bottom
  } );
  const textNode = new Text( ReactantsProductsAndLeftoversStrings.hideNumbersStringProperty, TEXT_OPTIONS );
  return new HBox( {
    children: [ new Node( { children: [ eyeNode, numbersNode ] } ), textNode ],
    spacing: 5
  } );
}

reactantsProductsAndLeftovers.register( 'VisibilityPanel', VisibilityPanel );