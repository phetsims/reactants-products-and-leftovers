// Copyright 2014-2022, University of Colorado Boulder

/**
 * The 'quantities' interface includes everything that's displayed below the Before/After boxes.
 * It indicates the quantities of reactants, products and leftovers, and allows interaction
 * with either the Before or After quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import BracketNode from '../../../../scenery-phet/js/BracketNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import BoxType from '../model/BoxType.js';
import RPALColors from '../RPALColors.js';
import RPALConstants from '../RPALConstants.js';
import HideBox from './HideBox.js';
import NumberNode from './NumberNode.js';
import SubstanceIcon from './SubstanceIcon.js';

// constants
const QUANTITY_FONT = new PhetFont( 28 ); // font for the quantities that appear below the boxes
const SYMBOL_FONT = new PhetFont( 16 ); // font for the symbols that appear below the boxes
const QUANTITY_IMAGE_Y_SPACING = 4; // vertical space between quantity and image
const IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
const BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it
const BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
const BRACKET_LABEL_OPTIONS = {
  font: new PhetFont( 12 ),
  fill: 'black',
  maxWidth: 140 // maximum width of bracket labels, determined empirically
};
const SPINNER_OPTIONS = RPALConstants.SPINNER_OPTIONS;

class QuantitiesNode extends Node {

  /**
   * @param {Substance[]} reactants
   * @param {Substance[]} products
   * @param {Substance[]} leftovers
   * @param {number[]} beforeXOffsets offsets of reactants relative to the left edge of the 'Before' box
   * @param {number[]} afterXOffsets offsets of products and leftovers relative to the left edge of the 'Before' box
   * @param {Object} [options]
   */
  constructor( reactants, products, leftovers, beforeXOffsets, afterXOffsets, options ) {

    assert && assert( reactants.length === beforeXOffsets.length );
    assert && assert( products.length + leftovers.length === afterXOffsets.length );

    options = merge( {
      interactiveBox: BoxType.BEFORE, // {BoxType} interactiveBox which box is interactive
      boxWidth: 100, // {number} width of the Before and After boxes
      afterBoxXOffset: 200, // {number} x-offset of left of After box, relative to left of Before box
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of spinners
      hideNumbersBox: false,  // {boolean} should we include a 'hide box' to cover the static numbers?
      minIconSize: new Dimension2( 0, 0 ), // minimum amount of layout space reserved for Substance icons
      showSymbols: true // {boolean} whether to show symbols (eg, H2O) for the substances in the reactions
    }, options );

    super();

    this.reactants = reactants; // @private
    this.products = products; // @private
    this.leftovers = leftovers; // @private
    this.interactiveBox = options.interactiveBox; // @private

    // explicitly hoist reused vars
    let i;
    let reactant;
    let product;
    let leftover;
    let centerX;
    let numberNode;
    let spinnerNode;
    let iconNode;
    let symbolNode;

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    this.spinnerNodes = []; // @private {NumberSpinner[]}
    this.beforeNumberNodes = []; // @private {NumberNode[]}
    this.afterNumberNodes = []; // @private {NumberNode[]}
    this.iconNodes = []; // @private {SubstanceIcon[]}
    const symbolNodes = [];

    // reactants, below the 'Before' box
    this.reactantsParent = new Node(); // @private
    this.addChild( this.reactantsParent );
    for ( i = 0; i < reactants.length; i++ ) {

      reactant = reactants[ i ];
      centerX = beforeXOffsets[ i ];

      if ( this.interactiveBox === BoxType.BEFORE ) {
        // spinner
        spinnerNode = new NumberSpinner( reactant.quantityProperty, new Property( options.quantityRange ),
          merge( {}, SPINNER_OPTIONS, { centerX: centerX } ) );
        this.reactantsParent.addChild( spinnerNode );
        this.spinnerNodes.push( spinnerNode );
      }
      else {
        // static number
        numberNode = new NumberNode( reactant.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
        this.reactantsParent.addChild( numberNode );
        this.beforeNumberNodes.push( numberNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( reactant.iconProperty, { centerX: centerX } );
      this.reactantsParent.addChild( iconNode );
      this.iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new RichText( reactant.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        this.reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // products, below the 'After' box
    this.productsParent = new Node(); // @private
    this.addChild( this.productsParent );
    for ( i = 0; i < products.length; i++ ) {

      product = products[ i ];
      centerX = options.afterBoxXOffset + afterXOffsets[ i ];

      if ( this.interactiveBox === BoxType.AFTER ) {
        // spinner
        spinnerNode = new NumberSpinner( product.quantityProperty, new Property( options.quantityRange ),
          merge( {}, SPINNER_OPTIONS, { centerX: centerX } ) );
        this.productsParent.addChild( spinnerNode );
        this.spinnerNodes.push( spinnerNode );
      }
      else {
        // static number
        numberNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
        this.productsParent.addChild( numberNode );
        this.afterNumberNodes.push( numberNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( product.iconProperty, { centerX: centerX } );
      this.productsParent.addChild( iconNode );
      this.iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new RichText( product.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        this.productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // leftovers, below the 'After' box, to the right of the products
    this.leftoversParent = new Node(); // @private
    this.addChild( this.leftoversParent );
    for ( i = 0; i < leftovers.length; i++ ) {

      leftover = leftovers[ i ];
      centerX = options.afterBoxXOffset + afterXOffsets[ i + products.length ]; // leftovers follow products in afterXOffsets

      if ( this.interactiveBox === BoxType.AFTER ) {
        // spinner
        spinnerNode = new NumberSpinner( leftover.quantityProperty, new Property( options.quantityRange ),
          merge( {}, SPINNER_OPTIONS, { centerX: centerX } ) );
        this.leftoversParent.addChild( spinnerNode );
        this.spinnerNodes.push( spinnerNode );
      }
      else {
        // static number
        numberNode = new NumberNode( leftover.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
        this.leftoversParent.addChild( numberNode );
        this.afterNumberNodes.push( numberNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( leftover.iconProperty, { centerX: centerX } );
      this.leftoversParent.addChild( iconNode );
      this.iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new RichText( leftover.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        this.leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    /*
     * Vertical layout of components below the boxes.
     * Ensures that all similar components (spinners, numbers, icons, symbols) are vertically centered.
     */
    const spinnerHeight = this.spinnerNodes[ 0 ].height;
    const maxIconHeight = Math.max(
      options.minIconSize.height,
      _.maxBy( this.iconNodes, node => node.height ).height );
    const maxSymbolHeight = symbolNodes.length ? _.maxBy( symbolNodes, node => node.height ).height : 0;

    this.spinnerNodes.forEach( spinnerNode => {
      spinnerNode.centerY = ( spinnerHeight / 2 );
    } );
    this.beforeNumberNodes.forEach( numberNode => {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    this.afterNumberNodes.forEach( numberNode => {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    this.iconNodes.forEach( iconNode => {
      iconNode.centerY = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + ( maxIconHeight / 2 );
    } );
    if ( options.showSymbols ) {
      symbolNodes.forEach( symbolNode => {
        symbolNode.top = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxIconHeight + IMAGE_SYMBOL_Y_SPACING;
      } );
    }

    // top of brackets is relative to the bottom of the stuff above
    let bracketsTop = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxIconHeight + BRACKET_Y_SPACING;
    if ( options.showSymbols ) {
      bracketsTop += ( maxSymbolHeight + IMAGE_SYMBOL_Y_SPACING );
    }

    // 'Reactants' bracket
    const reactantsLabel = new Text( ReactantsProductsAndLeftoversStrings.reactants, BRACKET_LABEL_OPTIONS );
    const reactantsBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: reactantsLabel,
      bracketLength: Math.max( options.minIconSize.width, this.reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: this.reactantsParent.centerX,
      top: bracketsTop
    } );
    this.addChild( reactantsBracket );

    // 'Products' bracket
    const productsLabel = new Text( ReactantsProductsAndLeftoversStrings.products, BRACKET_LABEL_OPTIONS );
    const productsBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: productsLabel,
      bracketLength: Math.max( options.minIconSize.width, this.productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: this.productsParent.centerX,
      top: bracketsTop
    } );
    this.addChild( productsBracket );

    // 'Leftovers' bracket
    const leftoversLabel = new Text( ReactantsProductsAndLeftoversStrings.leftovers, BRACKET_LABEL_OPTIONS );
    const leftoversBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: leftoversLabel,
      bracketLength: Math.max( options.minIconSize.width, this.leftoversParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: this.leftoversParent.centerX,
      top: bracketsTop
    } );
    this.addChild( leftoversBracket );

    // Optional 'Hide numbers' box on top of the static quantities
    this.hideNumbersBox = null;  // @private
    if ( options.hideNumbersBox ) {
      this.hideNumbersBox = new HideBox( {
        boxSize: new Dimension2( options.boxWidth, spinnerHeight ),
        iconHeight: 0.65 * spinnerHeight,
        cornerRadius: 3,
        left: ( this.interactiveBox === BoxType.BEFORE ) ? options.afterBoxXOffset : 0,
        centerY: this.spinnerNodes[ 0 ].centerY
      } );
      this.addChild( this.hideNumbersBox );
    }

    this.mutate( options );
  }

  /**
   * Determines whether this UI component is interactive (true on creation).
   * When it's interactive, spinners are visible; when not, static numbers are visible.
   * Static numbers are created on demand, so that we don't have unnecessary nodes for situations
   * that are always interactive, and to improve performance on creation.
   *
   * @param {boolean} interactive
   * @public
   */
  setInteractive( interactive ) {

    // spinners
    this.spinnerNodes.forEach( spinnerNode => { spinnerNode.visible = interactive; } );

    const centerY = this.spinnerNodes[ 0 ].height / 2;
    let i;
    let numberNode;
    let centerX; // explicitly hoist loop vars

    if ( this.interactiveBox === BoxType.BEFORE ) {

      // reactants, create static numbers on demand
      if ( !interactive && this.beforeNumberNodes.length === 0 ) {
        for ( i = 0; i < this.reactants.length; i++ ) {
          centerX = this.spinnerNodes[ i ].centerX;
          numberNode = new NumberNode( this.reactants[ i ].quantityProperty,
            { font: QUANTITY_FONT, centerX: centerX, centerY: centerY } );
          this.reactantsParent.addChild( numberNode );
          this.beforeNumberNodes.push( numberNode );
        }
      }

      // visibility
      if ( this.beforeNumberNodes.length > 0 ) {
        this.beforeNumberNodes.forEach( node => { node.visible = !interactive; } );
      }
    }
    else {

      // create static numbers on demand
      if ( !interactive && this.afterNumberNodes.length === 0 ) {

        // products
        for ( i = 0; i < this.products.length; i++ ) {
          centerX = this.spinnerNodes[ i ].centerX;
          numberNode = new NumberNode( this.products[ i ].quantityProperty,
            { font: QUANTITY_FONT, centerX: centerX, centerY: centerY } );
          this.productsParent.addChild( numberNode );
          this.afterNumberNodes.push( numberNode );
        }

        // leftovers
        for ( i = 0; i < this.leftovers.length; i++ ) {
          centerX = this.spinnerNodes[ i + this.products.length ].centerX; // leftover spinners follow product spinners
          numberNode = new NumberNode( this.leftovers[ i ].quantityProperty,
            { font: QUANTITY_FONT, centerX: centerX, centerY: centerY } );
          this.leftoversParent.addChild( numberNode );
          this.afterNumberNodes.push( numberNode );
        }
      }

      // visibility
      if ( this.afterNumberNodes.length > 0 ) {
        this.afterNumberNodes.forEach( node => { node.visible = !interactive; } );
      }
    }
  }

  /**
   * Changes visibility of the 'Hide numbers' box.
   * @param {boolean} visible
   * @public
   */
  setHideNumbersBoxVisible( visible ) {
    if ( this.hideNumbersBox ) {
      this.hideNumbersBox.visible = visible;
    }
  }

  // @public @overide
  dispose() {
    this.spinnerNodes.forEach( node => node.dispose() );
    this.spinnerNodes = null;
    this.beforeNumberNodes.forEach( node => node.dispose() );
    this.beforeNumberNodes = null;
    this.afterNumberNodes.forEach( node => node.dispose() );
    this.afterNumberNodes = null;
    this.iconNodes.forEach( node => node.dispose() );
    this.iconNodes = null;

    super.dispose();
  }

  /**
   * Creates x-offsets for substances, relative to the left edge of their 'Before' or 'After' box.
   * @param {number} numberOfSubstances
   * @param {number} boxWidth
   * @returns {number[]}
   * @static
   * @public
   */
  static createXOffsets( numberOfSubstances, boxWidth ) {
    const xOffsets = [];
    const xMargin = ( numberOfSubstances > 2 ) ? 0 : ( 0.15 * boxWidth ); // make 2-reactant case look nice
    const deltaX = ( boxWidth - ( 2 * xMargin ) ) / numberOfSubstances;
    let xOffset = xMargin + ( deltaX / 2 );
    for ( let i = 0; i < numberOfSubstances; i++ ) {
      xOffsets.push( xOffset );
      xOffset += deltaX;
    }
    return xOffsets;
  }
}

reactantsProductsAndLeftovers.register( 'QuantitiesNode', QuantitiesNode );
export default QuantitiesNode;