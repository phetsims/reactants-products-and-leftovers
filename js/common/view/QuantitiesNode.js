// Copyright 2002-2014, University of Colorado Boulder

/**
 * The quantities interface includes everything that's displayed below the Before/After boxes.
 * It indicates the quantities of reactants, products and leftovers, and allows interactive
 * with either the Before or After quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/HideBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var RPALBrackets = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALBrackets' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var SubstanceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceNode' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // constants
  var QUANTITY_FONT = new RPALFont( 28 ); // font for the quantities that appear below the boxes
  var SYMBOL_FONT = new RPALFont( 16 ); // font for the symbols that appear below the boxes
  var IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
  var QUANTITY_IMAGE_Y_SPACING = 6; // vertical space between quantity and image
  var BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it

  function QuantitiesNode( reactants, products, leftovers, beforeItems, afterItems, challengeType, options ) {

    options = _.extend( {
      boxWidth: 100,
      beforeBoxLeft: 0,
      afterBoxLeft: 200,
      quantityRange: RPALConstants.QUANTITY_RANGE,
      hideNumbersBox: false,
      maxImageSize: new Dimension2( 0, 0 )
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    this.numberOfReactants = reactants.length; // @private
    this.challengeType = challengeType; // @private

    // explicitly hoist reused vars
    var i, reactant, product, leftover, centerX, numberNode, spinnerNode, substanceNode, symbolNode;

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    thisNode.spinnerNodes = []; // @private {[NumberSpinner]} see dispose
    thisNode.numberNodes = []; // @private {[NumberNode]} see dispose
    thisNode.substanceNodes = []; // @private {[SubstanceNode]} see dispose
    var symbolNodes = [];

    // reactants, below the 'Before' box
    var reactantsParent = new Node();
    thisNode.addChild( reactantsParent );
    for ( i = 0; i < reactants.length; i++ ) {

      reactant = reactants[i];
      centerX = options.beforeBoxLeft + beforeItems[i].centerX;

      // noneditable number
      numberNode = new NumberNode( reactant.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      reactantsParent.addChild( numberNode );
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( challengeType === ChallengeType.BEFORE ) {
        numberNode.visible = false;
        spinnerNode = new NumberSpinner( reactant.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        reactantsParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // substance icon
      substanceNode = new SubstanceNode( reactant.nodeProperty, { centerX: centerX } );
      reactantsParent.addChild( substanceNode );
      thisNode.substanceNodes.push( substanceNode );

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
      centerX = options.afterBoxLeft + afterItems[i].centerX;

      // noneditable number
      numberNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      productsParent.addChild( numberNode );
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( challengeType === ChallengeType.AFTER ) {
        numberNode.visible = false;
        spinnerNode = new NumberSpinner( product.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        productsParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // substance icon
      substanceNode = new SubstanceNode( product.nodeProperty, { centerX: centerX } );
      productsParent.addChild( substanceNode );
      thisNode.substanceNodes.push( substanceNode );

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
      centerX = options.afterBoxLeft + afterItems[ i + products.length ].centerX;

      // noneditable number
      numberNode = new NumberNode( leftover.leftoversProperty, { font: QUANTITY_FONT, centerX: centerX } );
      leftoversParent.addChild( numberNode );
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( challengeType === ChallengeType.AFTER ) {
        numberNode.visible = false;
        spinnerNode = new NumberSpinner( leftover.leftoversProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        leftoversParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // substance icon
      substanceNode = new SubstanceNode( leftover.nodeProperty, { centerX: centerX } );
      leftoversParent.addChild( substanceNode );
      thisNode.substanceNodes.push( substanceNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( leftover.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // vertical layout of components below the boxes
    var spinnerHeight = thisNode.spinnerNodes[0].height;
    var maxImageHeight = Math.max(
      options.maxImageSize.height,
      _.max( thisNode.substanceNodes, function( node ) { return node.height; } ).height );
    var maxSymbolHeight = _.max( symbolNodes, function( node ) { return node.height; } ).height;

    thisNode.spinnerNodes.forEach( function( spinnerNode ) {
      spinnerNode.centerY = ( spinnerHeight / 2 );
    } );
    thisNode.numberNodes.forEach( function( numberNode ) {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    thisNode.substanceNodes.forEach( function( substanceNode ) {
      substanceNode.centerY = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + ( maxImageHeight / 2 );
    } );
    if ( options.showSymbols ) {
      symbolNodes.forEach( function( symbolNode ) {
        symbolNode.top = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxImageHeight + IMAGE_SYMBOL_Y_SPACING;
      } );
    }

    // compute the bottom of all of the above stuff
    var componentsBottom = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxImageHeight;
    if ( options.showSymbols ) {
      componentsBottom += ( maxSymbolHeight + IMAGE_SYMBOL_Y_SPACING );
    }

    // Brackets
    thisNode.addChild( new RPALBrackets(
      reactantsParent.width, reactantsParent.centerX,
      productsParent.width, productsParent.centerX,
      leftoversParent.width, leftoversParent.centerX,
      options.maxImageSize.width,
      { top: componentsBottom + BRACKET_Y_SPACING }
    ) );

    // Optional 'Hide numbers' box on top of the static quantities
    this.hideNumbersBox = null;  // @private
    if ( options.hideNumbersBox ) {
      this.hideNumbersBox = new HideBox( {
        boxSize: new Dimension2( options.boxWidth, spinnerHeight ),
        iconHeight: 0.65 * spinnerHeight,
        cornerRadius: 3,
        left: ( challengeType === ChallengeType.BEFORE ) ? options.afterBoxLeft : options.beforeBoxLeft,
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
     * @param {boolean} interactive
     */
    setInteractive: function( interactive ) {

      // spinners
      this.spinnerNodes.forEach( function( spinnerNode ) { spinnerNode.visible = interactive; } );

      // static numbers
      var i;
      if ( this.challengeType === ChallengeType.BEFORE ) {
        for ( i = 0; i < this.numberOfReactants; i++ ) {
          this.numberNodes[i].visible = !interactive;
        }
      }
      else {
        for ( i = this.numberOfReactants; i < this.numberNodes.length; i++ ) {
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
        this.hideNumbersBox.visible = !visible;
      }
    },

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.spinnerNodes.forEach( function( node ) { node.dispose(); } );
      this.numberNodes.forEach( function( node ) { node.dispose(); } );
      this.substanceNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );