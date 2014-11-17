// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is the primary UI component for the 'Sandwiches' and 'Molecules' screens.
 * It displays a reaction as 2 boxes, representing the 'Before' and 'After' states of the reaction.
 * The 'Before' box is on the left, and shows the initial reactants.
 * The 'After' box is on the right, and shows the products and leftovers when the reaction has completed.
 * Below the 'Before' box are a set of spinners for changing the reactant quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBracketNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HBracketNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var StacksAccordionBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StacksAccordionBox' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var afterReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterReaction' );
  var beforeReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeReaction' );
  var leftoversString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/leftovers' );
  var productsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/products' );
  var reactantsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants' );

  // constants
  var TITLE_FONT = new RPALFont( 14 ); // font for the titles that appear in the collapsed boxes
  var QUANTITY_FONT = new RPALFont( 28 ); // font for the quantities that appear below the boxes
  var SYMBOL_FONT = new RPALFont( 16 ); // font for the symbols that appear below the boxes
  var BOX_QUANTITY_Y_SPACING = 6; // vertical space between box and quantity
  var QUANTITY_IMAGE_Y_SPACING = 6; // vertical space between quantity and image
  var IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
  var BRACKET_FONT = new RPALFont( 12 ); // font for the bracket labels
  var BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
  var BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it
  var MAX_BRACKET_LABEL_WIDTH = 140; // maximum width of bracket labels, determined by eye

  /**
   * @param {Reaction} reaction the reaction to be displayed
   * @param {Property.<boolean>} beforeExpandedProperty whether the 'Before' box is expanded
   * @param {Property.<boolean>} afterExpandedProperty whether the 'After' box is expanded
   * @param {Object} [options]
   * @constructor
   */
  function BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {

    options = _.extend( {
      contentSize: new Dimension2( 310, 240 ), // size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // range of the quantity values
      showSymbols: true, // whether to show the symbols
      beforeTitle: beforeReactionString,
      afterTitle: afterReactionString,
      boxYMargin: 6, // vertical margin between the inner edge of box and the tallest node
      maxImageSize: new Dimension2( 0, 0 ) // our best guess at the maximum image size
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    thisNode.reaction = reaction; // @private

    var titleOptions = { font: TITLE_FONT, fill: 'white' };

    // explicitly hoist vars that are reused
    var numberOfItems, reactant, product, i, xMargin, centerX, deltaX, quantityNode, imageNode, symbolNode;

    // items in the 'Before Reaction' box, including their horizontal alignment
    var beforeItems = [];
    numberOfItems = reaction.reactants.length;
    xMargin = ( numberOfItems > 2 ) ? 0 : ( 0.15 * options.contentSize.width ); // make 2-items case look nice
    deltaX = ( options.contentSize.width - ( 2 * xMargin ) ) / numberOfItems;
    centerX = xMargin + ( deltaX / 2 );
    reaction.reactants.forEach( function( reactant ) {
      beforeItems.push( { nodeProperty: reactant.nodeProperty, quantityProperty: reactant.quantityProperty, centerX: centerX } );
      centerX += deltaX;
    } );

    // items in the 'After Reaction' box, including their horizontal alignment
    var afterItems = [];
    numberOfItems = reaction.products.length + reaction.reactants.length;
    xMargin = ( numberOfItems > 2 ) ? 0 : ( 0.15 * options.contentSize.width ); // make 2-items case look nice
    deltaX = ( options.contentSize.width - ( 2 * xMargin ) ) / numberOfItems;
    centerX = xMargin + ( deltaX / 2 );
    reaction.products.forEach( function( product ) {
      afterItems.push( { nodeProperty: product.nodeProperty, quantityProperty: product.quantityProperty, centerX: centerX } );
      centerX += deltaX;
    } );
    reaction.reactants.forEach( function( reactant ) {
      afterItems.push( { nodeProperty: reactant.nodeProperty, quantityProperty: reactant.leftoversProperty, centerX: centerX } );
      centerX += deltaX;
    } );

    // 'Before Reaction' accordion box, with stacks of reactants
    var beforeTitleNode = new Text( options.beforeTitle, titleOptions );
    thisNode.beforeBox = new StacksAccordionBox( beforeItems, _.extend( {
      expandedProperty: beforeExpandedProperty,
      titleNode: beforeTitleNode
    }, options ) );

    // 'After Reaction' accordion box, with stacks of products and leftovers
    var afterTitleNode = new Text( options.afterTitle, titleOptions );
    thisNode.afterBox = new StacksAccordionBox( afterItems, _.extend( {
      expandedProperty: afterExpandedProperty,
      titleNode: afterTitleNode
    }, options ) );

    // Arrow between boxes
    var arrowNode = new RightArrowNode( { fill: RPALColors.REACTION_BAR_COLOR, stroke: null, scale: 0.75 } );

    // layout of boxes and arrow
    var hBox = new LayoutBox( {
        children: [ thisNode.beforeBox, arrowNode, thisNode.afterBox ],
        orientation: 'horizontal',
        spacing: 10 }
    );
    thisNode.addChild( hBox );

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    thisNode.quantityNodes = []; // @private
    thisNode.imageNodes = []; // @protected
    thisNode.productImageNode = []; // @private needed for 'custom sandwich' scenario
    var symbolNodes = [];

    // reactants: stuff below the 'Before' box
    var reactantsParent = new Node();
    thisNode.addChild( reactantsParent );
    var numberOfReactants = reaction.reactants.length;
    xMargin = ( numberOfReactants > 2 ) ? 0 : ( 0.15 * options.contentSize.width ); // make 2 reactants case look nice
    deltaX = ( options.contentSize.width - ( 2 * xMargin ) ) / numberOfReactants;
    centerX = thisNode.beforeBox.left + xMargin + (deltaX / 2 );
    for ( i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // quantity is editable via a spinner
      quantityNode = new NumberSpinner( reactant.quantityProperty, options.quantityRange,
        { font: QUANTITY_FONT, centerX: centerX } );
      reactantsParent.addChild( quantityNode );
      thisNode.quantityNodes.push( quantityNode );

      // image
      imageNode = reactant.getWrappedNode( { centerX: quantityNode.centerX } );
      reactantsParent.addChild( imageNode );
      thisNode.imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.symbol, { font: SYMBOL_FONT, centerX: quantityNode.centerX } );
        reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // products: stuff below the 'After' box
    var productsParent = new Node();
    thisNode.addChild( productsParent );
    var numberOfProducts = reaction.products.length;
    // make 2-reactants case look nice
    xMargin = ( numberOfProducts + numberOfReactants > 2 ) ? 0 : ( 0.15 * options.contentSize.width );
    deltaX = ( options.contentSize.width - ( 2 * xMargin ) ) / ( numberOfProducts + numberOfReactants );
    centerX = thisNode.afterBox.left + xMargin + (deltaX / 2 );
    for ( i = 0; i < numberOfProducts; i++ ) {

      product = reaction.products[i];

      // quantity is not editable
      quantityNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      productsParent.addChild( quantityNode );
      thisNode.quantityNodes.push( quantityNode );

      // image
      imageNode = product.getWrappedNode( { centerX: quantityNode.centerX } );
      productsParent.addChild( imageNode );
      thisNode.imageNodes.push( imageNode );
      thisNode.productImageNode.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( product.symbol, { font: SYMBOL_FONT, centerX: quantityNode.centerX } );
        productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // leftovers: stuff below the 'After' box, to the right of the products
    var leftoversParent = new Node();
    thisNode.addChild( leftoversParent );
    for ( i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // quantity is not editable
      quantityNode = new NumberNode( reactant.leftoversProperty, { font: QUANTITY_FONT, centerX: centerX } );
      leftoversParent.addChild( quantityNode );
      thisNode.quantityNodes.push( quantityNode );

      // image
      imageNode = reactant.getWrappedNode( { centerX: quantityNode.centerX } );
      leftoversParent.addChild( imageNode );
      thisNode.imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.symbol, { font: SYMBOL_FONT, centerX: quantityNode.centerX } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // vertical layout of components below the boxes
    var maxQuantityHeight = _.max( thisNode.quantityNodes, function( node ) { return node.height; } ).height;
    var maxImageHeight = Math.max(
      options.maxImageSize.height,
      _.max( thisNode.imageNodes, function( node ) { return node.height; } ).height );
    var maxSymbolHeight = _.max( symbolNodes, function( node ) { return node.height; } ).height;
    var numberOfColumns = thisNode.quantityNodes.length;
    var componentsTop = thisNode.beforeBox.bottom + BOX_QUANTITY_Y_SPACING;
    for ( i = 0; i < numberOfColumns; i++ ) {
      thisNode.quantityNodes[i].centerY = componentsTop + ( maxQuantityHeight / 2 );
      thisNode.imageNodes[i].centerY = componentsTop + maxQuantityHeight + QUANTITY_IMAGE_Y_SPACING + ( maxImageHeight / 2 );
      if ( options.showSymbols ) {
        symbolNodes[i].top = componentsTop + maxQuantityHeight + QUANTITY_IMAGE_Y_SPACING + maxImageHeight + IMAGE_SYMBOL_Y_SPACING;
      }
    }
    var componentsBottom = componentsTop + maxQuantityHeight + QUANTITY_IMAGE_Y_SPACING + maxImageHeight;
    if ( options.showSymbols ) {
      componentsBottom += ( maxSymbolHeight + IMAGE_SYMBOL_Y_SPACING );
    }

    // brackets to denote 'reactants', 'products' and 'leftovers'
    var bracketLabelOptions = {
      font: BRACKET_FONT,
      fill: 'black'
    };
    var bracketOptions = {
      bracketColor: RPALColors.REACTION_BAR_COLOR,
      top: componentsBottom + BRACKET_Y_SPACING
    };

    var reactantsLabel = new Text( reactantsString, bracketLabelOptions );
    reactantsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / reactantsLabel.width ) ); // i18n
    var reactantsBracket = new HBracketNode( _.extend( {
      labelNode: reactantsLabel,
      bracketWidth: Math.max( options.maxImageSize.width, reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: reactantsParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( reactantsBracket );

    var productsLabel = new Text( productsString, bracketLabelOptions );
    productsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / productsLabel.width ) ); // i18n
    var productsBracket = new HBracketNode( _.extend( {
      labelNode: productsLabel,
      bracketWidth: Math.max( options.maxImageSize.width, productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: productsParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( productsBracket );

    var leftoversLabel = new Text( leftoversString, bracketLabelOptions );
    leftoversLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / leftoversLabel.width ) ); // i18n
    var leftoversBracket = new HBracketNode( _.extend( {
      labelNode: leftoversLabel,
      bracketWidth: Math.max( options.maxImageSize.width, leftoversParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: leftoversParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( leftoversBracket );

    // pass options to supertype
    thisNode.mutate( options );
  }

  return inherit( Node, BeforeAfterNode, {

    // Unlinks all property observers. The node is no longer functional after calling this function.
    dispose: function() {

      // accordion boxes
      this.beforeBox.dispose();
      this.afterBox.dispose();

      // quantity spinners and displays
      this.quantityNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
