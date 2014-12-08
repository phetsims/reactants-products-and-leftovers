// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'quantities' interface includes everything that's displayed below the Before/After boxes.
 * It indicates the quantities of reactants, products and leftovers, and allows interaction
 * with either the Before or After quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBracketNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HBracketNode' );
  var HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HideBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var SubstanceIcon = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceIcon' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var leftoversString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/leftovers' );
  var productsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/products' );
  var reactantsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants' );

  // constants
  var QUANTITY_FONT = new RPALFont( 28 ); // font for the quantities that appear below the boxes
  var SYMBOL_FONT = new RPALFont( 16 ); // font for the symbols that appear below the boxes
  var QUANTITY_IMAGE_Y_SPACING = 4; // vertical space between quantity and image
  var IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
  var BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it
  var BRACKET_LABEL_OPTIONS = { font: new RPALFont( 12 ), fill: 'black' };
  var BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
  var MAX_BRACKET_LABEL_WIDTH = 140; // maximum width of bracket labels, determined by eye

  /**
   * @param {[Substance]} reactants
   * @param {[Substance]} products
   * @param {[Substance]} leftovers
   * @param {[number]} beforeXOffsets offsets of reactants relative to the left edge of the 'Before' box
   * @param {[number]} afterXOffsets offsets of products and leftovers relative to the left edge of the 'Before' box
   * @param {Object} [options]
   * @constructor
   */
  function QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, options ) {

    assert && assert( reactants.length === beforeXOffsets.length );
    assert && assert( products.length + leftovers.length === afterXOffsets.length );

    options = _.extend( {
      interactiveBox: BoxType.BEFORE, // {BoxType} interactiveBox which box is interactive
      boxWidth: 100, // {number} width of the Before and After boxes
      afterBoxXOffset: 200, // {number} x-offset of left of After box, relative to left of Before box
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of spinners
      hideNumbersBox: false,  // {boolean} should we include a 'hide box' to cover the static numbers?
      minIconSize: new Dimension2( 0, 0 ), // minimum amount of layout space reserved for Substance icons
      showSymbols: true // {boolean} whether to show symbols (eg, H2O) for the substances in the reactions
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    this.numberOfReactants = reactants.length; // @private
    this.interactiveBox = options.interactiveBox; // @private

    // explicitly hoist reused vars
    var i, reactant, product, leftover, centerX, numberNode, spinnerNode, iconNode, symbolNode;

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    thisNode.spinnerNodes = []; // @private {[NumberSpinner]} see dispose
    thisNode.numberNodes = []; // @private {[NumberNode]} see dispose
    thisNode.iconNodes = []; // @private {[SubstanceIcon]} see dispose
    var symbolNodes = [];

    // reactants, below the 'Before' box
    var reactantsParent = new Node();
    thisNode.addChild( reactantsParent );
    for ( i = 0; i < reactants.length; i++ ) {

      reactant = reactants[i];
      centerX = beforeXOffsets[i];

      // noneditable number
      numberNode = new NumberNode( reactant.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      if ( this.interactiveBox === BoxType.AFTER ) {
        reactantsParent.addChild( numberNode ); // defer adding unless there will be no spinner
      }
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( this.interactiveBox === BoxType.BEFORE ) {
        numberNode.visible = false;
        spinnerNode = new NumberSpinner( reactant.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        reactantsParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( reactant.iconProperty, { centerX: centerX } );
      reactantsParent.addChild( iconNode );
      thisNode.iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // products, below the 'After' box
    var productsParent = new Node();
    thisNode.addChild( productsParent );
    for ( i = 0; i < products.length; i++ ) {

      product = products[i];
      centerX = options.afterBoxXOffset + afterXOffsets[i];

      // noneditable number
      numberNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      if ( this.interactiveBox === BoxType.BEFORE ) {
        productsParent.addChild( numberNode ); // defer adding unless there will be no spinner
      }
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( this.interactiveBox === BoxType.AFTER ) {
        numberNode.visible = false;
        spinnerNode = new NumberSpinner( product.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        productsParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( product.iconProperty, { centerX: centerX } );
      productsParent.addChild( iconNode );
      thisNode.iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( product.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // leftovers, below the 'After' box, to the right of the products
    var leftoversParent = new Node();
    thisNode.addChild( leftoversParent );
    for ( i = 0; i < leftovers.length; i++ ) {

      leftover = leftovers[i];
      centerX = options.afterBoxXOffset + afterXOffsets[ i + products.length ]; // leftovers follow products in afterXOffsets

      // noneditable number
      numberNode = new NumberNode( leftover.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      if ( this.interactiveBox === BoxType.BEFORE ) {
        leftoversParent.addChild( numberNode ); // defer adding unless there will be no spinner
      }
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( this.interactiveBox === BoxType.AFTER ) {
        numberNode.visible = false;
        spinnerNode = new NumberSpinner( leftover.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        leftoversParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( leftover.iconProperty, { centerX: centerX } );
      leftoversParent.addChild( iconNode );
      thisNode.iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( leftover.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    /*
     * Vertical layout of components below the boxes.
     * Ensures that all similar components (spinners, numbers, icons, symbols) are vertically centered.
     */
    var spinnerHeight = thisNode.spinnerNodes[0].height;
    var maxIconHeight = Math.max(
      options.minIconSize.height,
      _.max( thisNode.iconNodes, function( node ) { return node.height; } ).height );
    var maxSymbolHeight = _.max( symbolNodes, function( node ) { return node.height; } ).height;

    thisNode.spinnerNodes.forEach( function( spinnerNode ) {
      spinnerNode.centerY = ( spinnerHeight / 2 );
    } );
    thisNode.numberNodes.forEach( function( numberNode ) {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    thisNode.iconNodes.forEach( function( iconNode ) {
      iconNode.centerY = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + ( maxIconHeight / 2 );
    } );
    if ( options.showSymbols ) {
      symbolNodes.forEach( function( symbolNode ) {
        symbolNode.top = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxIconHeight + IMAGE_SYMBOL_Y_SPACING;
      } );
    }

    // top of brackets is relative to the bottom of the stuff above
    var bracketsTop = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxIconHeight + BRACKET_Y_SPACING;
    if ( options.showSymbols ) {
      bracketsTop += ( maxSymbolHeight + IMAGE_SYMBOL_Y_SPACING );
    }

    // 'Reactants' bracket
    var reactantsLabel = new Text( reactantsString, BRACKET_LABEL_OPTIONS );
    reactantsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / reactantsLabel.width ) ); // i18n
    var reactantsBracket = new HBracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: reactantsLabel,
      bracketWidth: Math.max( options.minIconSize.width, reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: reactantsParent.centerX,
      top: bracketsTop
    } );
    thisNode.addChild( reactantsBracket );

    // 'Products' bracket
    var productsLabel = new Text( productsString, BRACKET_LABEL_OPTIONS );
    productsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / productsLabel.width ) ); // i18n
    var productsBracket = new HBracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: productsLabel,
      bracketWidth: Math.max( options.minIconSize.width, productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: productsParent.centerX,
      top: bracketsTop
    } );
    thisNode.addChild( productsBracket );

    // 'Leftovers' bracket
    var leftoversLabel = new Text( leftoversString, BRACKET_LABEL_OPTIONS );
    leftoversLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / leftoversLabel.width ) ); // i18n
    var leftoversBracket = new HBracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: leftoversLabel,
      bracketWidth: Math.max( options.minIconSize.width, leftoversParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: leftoversParent.centerX,
      top: bracketsTop
    } );
    thisNode.addChild( leftoversBracket );

    // Optional 'Hide numbers' box on top of the static quantities
    this.hideNumbersBox = null;  // @private
    if ( options.hideNumbersBox ) {
      this.hideNumbersBox = new HideBox( {
        boxSize: new Dimension2( options.boxWidth, spinnerHeight ),
        iconHeight: 0.65 * spinnerHeight,
        cornerRadius: 3,
        left: ( this.interactiveBox === BoxType.BEFORE ) ? options.afterBoxXOffset : 0,
        centerY: thisNode.spinnerNodes[0].centerY
      } );
      thisNode.addChild( this.hideNumbersBox );
    }

    thisNode.mutate( options );
  }

  return inherit( Node, QuantitiesNode, {

    /**
     * Determines whether this UI component is interactive.
     * When it's interactive, spinners are visible; when not, static numbers are visible.
     * When created, this node is interactive by default.
     * @param {boolean} interactive
     */
    setInteractive: function( interactive ) {

      // spinners
      this.spinnerNodes.forEach( function( spinnerNode ) { spinnerNode.visible = interactive; } );

      var i;
      if ( this.interactiveBox === BoxType.BEFORE ) {
        // static numbers for reactants
        for ( i = 0; i < this.numberOfReactants; i++ ) {
          // add to scenegraph when needed
          if ( !interactive && this.indexOfChild( this.numberNodes[i] ) === -1 ) {
            this.addChild( this.numberNodes[i] );
          }
          this.numberNodes[i].visible = !interactive;
        }
      }
      else {
        // static numbers for products and leftovers
        for ( i = this.numberOfReactants; i < this.numberNodes.length; i++ ) {
          // add to scenegraph when needed
          if ( !interactive && this.indexOfChild( this.numberNodes[i] ) === -1 ) {
            this.addChild( this.numberNodes[i] );
          }
          this.numberNodes[i].visible = !interactive;
        }
      }
    },

    /**
     * Changes visibility of the 'Hide numbers' box.
     * @param {boolean} visible
     */
    setHideNumbersBoxVisible: function( visible ) {
      if ( this.hideNumbersBox ) {
        this.hideNumbersBox.visible = visible;
      }
    },

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.spinnerNodes.forEach( function( node ) { node.dispose(); } );
      this.numberNodes.forEach( function( node ) { node.dispose(); } );
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
    }
  }, {

    /**
     * Creates x-offsets for substances, relative to the left edge of their 'Before' or 'After' box.
     * @param {number} numberOfSubstances
     * @param {number} boxWidth
     * @returns {[number]}
     * @static
     */
    createXOffsets: function( numberOfSubstances, boxWidth ) {
      var xOffsets = [];
      var xMargin = ( numberOfSubstances > 2 ) ? 0 : ( 0.15 * boxWidth ); // make 2-reactant case look nice
      var deltaX = ( boxWidth - ( 2 * xMargin ) ) / numberOfSubstances;
      var xOffset = xMargin + ( deltaX / 2 );
      for ( var i = 0; i < numberOfSubstances; i++ ) {
        xOffsets.push( xOffset );
        xOffset += deltaX;
      }
      return xOffsets;
    }
  } );
} );