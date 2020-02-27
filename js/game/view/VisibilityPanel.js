// Copyright 2014-2020, University of Colorado Boulder

/**
 * Panel that contains radio buttons for selecting what's visible/hidden in Game challenges.
 * Provides the ability to hide either molecules or numbers (but not both).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import merge from '../../../../phet-core/js/merge.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import Panel from '../../../../sun/js/Panel.js';
import RPALConstants from '../../common/RPALConstants.js';
import RPALFont from '../../common/view/RPALFont.js';
import reactantsProductsAndLeftoversStrings from '../../reactants-products-and-leftovers-strings.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const hideMoleculesString = reactantsProductsAndLeftoversStrings.hideMolecules;
const hideNumbersString = reactantsProductsAndLeftoversStrings.hideNumbers;
const showAllString = reactantsProductsAndLeftoversStrings.showAll;

// constants
const TEXT_OPTIONS = { font: new RPALFont( 14 ) };
const RADIO_BUTTON_OPTIONS = { radius: 8, xSpacing: 10 };
const FONT_AWESOME_OPTIONS = { scale: 0.5 };
const X_DILATION = 10; // dilate touchArea for radio buttons
const Y_DILATION = 6; // dilate touchArea for radio buttons

class VisibilityPanel extends Panel {
  /**
   * @param {Property.<boolean>} moleculesVisibleProperty are molecules visible in challenges?
   * @param {Property.<boolean>} numbersVisibleProperty are quantities visible in challenges?
   * @param {Object} [options]
   */
  constructor( moleculesVisibleProperty, numbersVisibleProperty, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 235, 245, 255 )',
      stroke: 'rgb( 180, 180, 180 )',
      lineWidth: 0.5
    }, options );

    /**
     * This bit of code is a little complicated because of a mismatch between model and view.
     * The model has independent properties for the visibility of molecules and numbers.
     * But the view makes them dependent on each other, and this control mixes 'show' and 'hide'.
     * This could be fixed by modeling this dependency, but I prefer to keep the model clean.
     */
      // unlink is unnecessary because this property is owned by this node
    const showAllProperty = new BooleanProperty( moleculesVisibleProperty.get() && numbersVisibleProperty.get() );
    showAllProperty.link( value => {
      if ( value ) {
        moleculesVisibleProperty.set( true );
        numbersVisibleProperty.set( true );
      }
    } );

    // unlink is unnecessary because this node exists for the lifetime of the simulation
    moleculesVisibleProperty.link( visible => {
      if ( !visible ) {
        numbersVisibleProperty.set( true ); // if molecules are hidden, then numbers must be shown
        showAllProperty.set( false );
      }
      else {
        showAllProperty.set( visible && numbersVisibleProperty.get() );
      }
    } );

    // unlink is unnecessary because this node exists for the lifetime of the simulation
    numbersVisibleProperty.link( visible => {
      if ( !visible ) {
        moleculesVisibleProperty.set( true ); // if numbers are hidden, then molecules must be shown
        showAllProperty.set( false );
      }
      else {
        showAllProperty.set( visible && moleculesVisibleProperty.get() );
      }
    } );

    // radio buttons
    const showAllRadioButton = new AquaRadioButton( showAllProperty, true, createShowAllNode(), RADIO_BUTTON_OPTIONS );
    const hideMoleculesButton = new AquaRadioButton( moleculesVisibleProperty, false, createHideMoleculesNode(), RADIO_BUTTON_OPTIONS );
    const hideNumbersButton = new AquaRadioButton( numbersVisibleProperty, false, createHideNumbersNode(), RADIO_BUTTON_OPTIONS );

    // expand touchArea
    showAllRadioButton.touchArea = showAllRadioButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    hideMoleculesButton.touchArea = hideMoleculesButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    hideNumbersButton.touchArea = hideNumbersButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );

    // vertical layout
    const content = new LayoutBox( {
      children: [ showAllRadioButton, hideMoleculesButton, hideNumbersButton ],
      orientation: 'vertical',
      align: 'left',
      spacing: 15
    } );

    super( content, options );
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