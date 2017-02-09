// Copyright 2014-2015, University of Colorado Boulder

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
  var BracketNode = require( 'SCENERY_PHET/BracketNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HideBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
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
  var BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
  var BRACKET_LABEL_OPTIONS = {
    font: new RPALFont( 12 ),
    fill: 'black',
    maxWidth: 140 // maximum width of bracket labels, determined empirically
  };
  var SPINNER_OPTIONS = {
    font: QUANTITY_FONT,
    touchAreaXDilation: 20,
    touchAreaYDilation: 10,
    backgroundLineWidth: 0.5
  };

  /**
   * @param {Substance[]} reactants
   * @param {Substance[]} products
   * @param {Substance[]} leftovers
   * @param {number[]} beforeXOffsets offsets of reactants relative to the left edge of the 'Before' box
   * @param {number[]} afterXOffsets offsets of products and leftovers relative to the left edge of the 'Before' box
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

    Node.call( this );

    this.reactants = reactants; // @private
    this.products = products; // @private
    this.leftovers = leftovers; // @private
    this.interactiveBox = options.interactiveBox; // @private

    // explicitly hoist reused vars
    var i;
    var reactant;
    var product;
    var leftover;
    var centerX;
    var numberNode;
    var spinnerNode;
    var iconNode;
    var symbolNode;

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    this.spinnerNodes = []; // @private {NumberSpinner[]}
    this.beforeNumberNodes = []; // @private {NumberNode[]}
    this.afterNumberNodes = []; // @private {NumberNode[]}
    this.iconNodes = []; // @private {SubstanceIcon[]}
    var symbolNodes = [];

    // reactants, below the 'Before' box
    this.reactantsParent = new Node(); // @private
    this.addChild( this.reactantsParent );
    for ( i = 0; i < reactants.length; i++ ) {

      reactant = reactants[ i ];
      centerX = beforeXOffsets[ i ];

      if ( this.interactiveBox === BoxType.BEFORE ) {
        // spinner
        spinnerNode = new NumberSpinner( reactant.quantityProperty, options.quantityRange,
          _.extend( {}, SPINNER_OPTIONS, { centerX: centerX } ) );
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
        symbolNode = new SubSupText( reactant.symbol, { font: SYMBOL_FONT, centerX: centerX } );
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
        spinnerNode = new NumberSpinner( product.quantityProperty, options.quantityRange,
          _.extend( {}, SPINNER_OPTIONS, { centerX: centerX } ) );
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
        symbolNode = new SubSupText( product.symbol, { font: SYMBOL_FONT, centerX: centerX } );
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
        spinnerNode = new NumberSpinner( leftover.quantityProperty, options.quantityRange,
          _.extend( {}, SPINNER_OPTIONS, { centerX: centerX } ) );
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
        symbolNode = new SubSupText( leftover.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        this.leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    /*
     * Vertical layout of components below the boxes.
     * Ensures that all similar components (spinners, numbers, icons, symbols) are vertically centered.
     */
    var spinnerHeight = this.spinnerNodes[ 0 ].height;
    var maxIconHeight = Math.max(
      options.minIconSize.height,
      _.maxBy( this.iconNodes, function( node ) { return node.height; } ).height );
    var maxSymbolHeight = symbolNodes.length ? _.maxBy( symbolNodes, function( node ) { return node.height; } ).height: 0;

    this.spinnerNodes.forEach( function( spinnerNode ) {
      spinnerNode.centerY = ( spinnerHeight / 2 );
    } );
    this.beforeNumberNodes.forEach( function( numberNode ) {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    this.afterNumberNodes.forEach( function( numberNode ) {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    this.iconNodes.forEach( function( iconNode ) {
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
    var reactantsBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: reactantsLabel,
      bracketLength: Math.max( options.minIconSize.width, this.reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: this.reactantsParent.centerX,
      top: bracketsTop
    } );
    this.addChild( reactantsBracket );

    // 'Products' bracket
    var productsLabel = new Text( productsString, BRACKET_LABEL_OPTIONS );
    var productsBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: productsLabel,
      bracketLength: Math.max( options.minIconSize.width, this.productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: this.productsParent.centerX,
      top: bracketsTop
    } );
    this.addChild( productsBracket );

    // 'Leftovers' bracket
    var leftoversLabel = new Text( leftoversString, BRACKET_LABEL_OPTIONS );
    var leftoversBracket = new BracketNode( {
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

  reactantsProductsAndLeftovers.register( 'QuantitiesNode', QuantitiesNode );

  return inherit( Node, QuantitiesNode, {

    /**
     * Determines whether this UI component is interactive (true on creation).
     * When it's interactive, spinners are visible; when not, static numbers are visible.
     * Static numbers are created on demand, so that we don't have unnecessary nodes for situations
     * that are always interactive, and to improve performance on creation.
     *
     * @param {boolean} interactive
     * @public
     */
    setInteractive: function( interactive ) {

      // spinners
      this.spinnerNodes.forEach( function( spinnerNode ) { spinnerNode.visible = interactive; } );

      var centerY = this.spinnerNodes[ 0 ].height / 2;
      var i;
      var numberNode;
      var centerX; // explicitly hoist loop vars

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
          this.beforeNumberNodes.forEach( function( node ) { node.visible = !interactive; } );
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
          this.afterNumberNodes.forEach( function( node ) { node.visible = !interactive; } );
        }
      }
    },

    /**
     * Changes visibility of the 'Hide numbers' box.
     * @param {boolean} visible
     * @public
     */
    setHideNumbersBoxVisible: function( visible ) {
      if ( this.hideNumbersBox ) {
        this.hideNumbersBox.visible = visible;
      }
    },

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.spinnerNodes.forEach( function( node ) { node.dispose(); } );
      this.spinnerNodes = null;
      this.beforeNumberNodes.forEach( function( node ) { node.dispose(); } );
      this.beforeNumberNodes = null;
      this.afterNumberNodes.forEach( function( node ) { node.dispose(); } );
      this.afterNumberNodes = null;
      this.iconNodes.forEach( function( node ) { node.dispose(); } );
      this.iconNodes = null;

      Node.prototype.dispose.call( this );
    }
  }, {

    /**
     * Creates x-offsets for substances, relative to the left edge of their 'Before' or 'After' box.
     * @param {number} numberOfSubstances
     * @param {number} boxWidth
     * @returns {number[]}
     * @static
     * @public
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