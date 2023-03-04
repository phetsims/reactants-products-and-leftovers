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
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignBoxOptions, AlignGroup, HBox, Node, Path, PathOptions, Text, TextOptions } from '../../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import RPALConstants from '../../common/RPALConstants.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import GameVisibility from '../model/GameVisibility.js';

const ICON_TEXT_SPACING = 7;
const TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( 14 ),
  maxWidth: 350
};
const FONT_AWESOME_OPTIONS: PathOptions = {
  scale: 0.04,
  fill: 'black'
};

type SelfOptions = EmptySelfOptions;

type VisibilityPanelOptions = SelfOptions;

export default class GameVisibilityPanel extends Panel {

  public constructor( gameVisibilityProperty: EnumerationProperty<GameVisibility>, providedOptions?: VisibilityPanelOptions ) {

    const options = optionize<VisibilityPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 235, 245, 255 )',
      stroke: 'rgb( 180, 180, 180 )',
      lineWidth: 0.5
    }, providedOptions );

    // To make all icons have the same effective size
    const iconAlignBoxOptions: AlignBoxOptions = {
      group: new AlignGroup(),
      xAlign: 'left'
    };

    const radioButtonItems = [
      { value: GameVisibility.SHOW_ALL, createNode: () => new ShowAllNode( iconAlignBoxOptions ) },
      { value: GameVisibility.HIDE_MOLECULES, createNode: () => new HideMoleculesNode( iconAlignBoxOptions ) },
      { value: GameVisibility.HIDE_NUMBERS, createNode: () => new HideNumbersNode( iconAlignBoxOptions ) }
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
 * ShowAllNode is the content for the 'Show All' radio button, an open eye with text to the right of it.
 */
class ShowAllNode extends HBox {
  public constructor( iconAlignBoxOptions: AlignBoxOptions ) {
    const iconNode = new AlignBox( new Path( eyeSolidShape, FONT_AWESOME_OPTIONS ), iconAlignBoxOptions );
    const textNode = new Text( ReactantsProductsAndLeftoversStrings.showAllStringProperty, TEXT_OPTIONS );
    super( {
      children: [ iconNode, textNode ],
      spacing: ICON_TEXT_SPACING
    } );
  }
}

/**
 * HideMoleculesNode is the content for the 'Hide Molecules' radio button,
 * a closed eye with '123' at lower right, and text to the right.
 */
class HideMoleculesNode extends HBox {
  public constructor( iconAlignBoxOptions: AlignBoxOptions ) {

    const eyeNode = new Path( eyeSlashSolidShape, FONT_AWESOME_OPTIONS );
    const moleculeNode = new Node( {
      // wrap in a Node because H2ONode doesn't work with standard options
      children: [ new H2ONode( RPALConstants.MOLECULE_NODE_OPTIONS ) ],
      scale: 0.4,
      left: eyeNode.right + 2,
      centerY: eyeNode.bottom
    } );
    const iconNode = new AlignBox( new Node( { children: [ eyeNode, moleculeNode ] } ), iconAlignBoxOptions );
    const textNode = new Text( ReactantsProductsAndLeftoversStrings.hideMoleculesStringProperty, TEXT_OPTIONS );

    super( {
      children: [ iconNode, textNode ],
      spacing: ICON_TEXT_SPACING
    } );
  }
}

/**
 * HideNumbersNode is the content for the 'Hide Numbers' radio button,
 * a closed eye with H2O molecule at lower right, and text to the right.
 */
class HideNumbersNode extends HBox {
  public constructor( iconAlignBoxOptions: AlignBoxOptions ) {

    const eyeNode = new Path( eyeSlashSolidShape, FONT_AWESOME_OPTIONS );
    const numbersNode = new Text( '123', {
      font: new PhetFont( 8 ),
      left: eyeNode.right + 2,
      centerY: eyeNode.bottom
    } );
    const iconNode = new AlignBox( new Node( { children: [ eyeNode, numbersNode ] } ), iconAlignBoxOptions );
    const textNode = new Text( ReactantsProductsAndLeftoversStrings.hideNumbersStringProperty, TEXT_OPTIONS );

    super( {
      children: [ iconNode, textNode ],
      spacing: ICON_TEXT_SPACING
    } );
  }
}

reactantsProductsAndLeftovers.register( 'GameVisibilityPanel', GameVisibilityPanel );