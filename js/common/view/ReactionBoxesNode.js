// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays a reaction as 2 boxes, representing the 'before' and 'after' states of the reaction.
 * The 'before' box is on the left, and shows the initial reactants.
 * The 'after' box is on the right, and shows the products and leftovers when the reaction has completed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBracketNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HBracketNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var MoleculeStackNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculeStackNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var beforeReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeReaction' );
  var afterReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterReaction' );
  var reactantsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants' );
  var productsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/products' );
  var leftoversString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/leftovers' );

  // constants
  var TITLE_FONT = new RPALFont( 14 ); // font for the titles that appear in the collapsed boxes
  var QUANTITY_FONT = new RPALFont( 28 ); // font for the molecule quantities that appear below the boxes
  var SYMBOL_FONT = new RPALFont( 16 ); // font for the molecule symbols that appear below the boxes
  var BOX_QUANTITY_Y_SPACING = 6; // vertical space between box and quantity
  var QUANTITY_IMAGE_Y_SPACING = 6; // vertical space between quantity and image
  var IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
  var BRACKET_FONT = new RPALFont( 12 ); // font for the bracket labels
  var BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
  var BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it

  /**
   * @param {Reaction} reaction the reaction to be displayed
   * @param {Property.<boolean>} beforeExpandedProperty whether the 'before' box is expanded
   * @param {Property.<boolean>} afterExpandedProperty whether the 'after' box is expanded
   * @param {Object} [options]
   * @constructor
   */
  function ReactionBoxesNode( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {

    options = _.extend( {
      boxSize: new Dimension2( 310, 240 ), // size of the 'before' and 'after' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // range of the quantity values
      layoutStrategy: 'stacked', // layout strategy for molecules inside the boxes, either 'stacked' or 'random',
      showSymbols: true, // whether to show the molecule symbols
      beforeTitle: beforeReactionString,
      afterTitle: afterReactionString,
      boxYMargin: 6, // vertical margin between the inner edge of box and the tallest molecule image
      maxImageSize: new Dimension2( 0, 0 ) // our best guess at the maximum image size
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // options common to box titles
    var titleOptions = { font: TITLE_FONT, fill: 'white' };

    // options common to both accordion boxes
    var accordionBoxOptions = {
      titleAlign: 'center',
      buttonAlign: 'right',
      contentXMargin: 0,
      contentYMargin: 0,
      contentYSpacing: 0,
      fill: RPALColors.REACTION_BAR_COLOR,
      buttonTouchAreaDilatedX: 10,
      buttonTouchAreaDilatedY: 10,
      stroke: null
    };

    // options common to the content in both accordion boxes
    var contentOptions = {
      fill: 'white',
      stroke: Color.toColor( RPALColors.REACTION_BAR_COLOR ).withAlpha( 0.2 )
    };

    // 'Before Reaction' accordion box
    var beforeContent = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, contentOptions );
    // @private
    this.beforeBox = new AccordionBox( beforeContent, _.extend( {
      expandedProperty: beforeExpandedProperty,
      titleNode: new Text( options.beforeTitle, titleOptions )
    }, accordionBoxOptions ) );

    // 'After Reaction' accordion box
    var afterContent = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, contentOptions );
    // @private
    this.afterBox = new AccordionBox( afterContent, _.extend( {
      expandedProperty: afterExpandedProperty,
      titleNode: new Text( options.afterTitle, titleOptions )
    }, accordionBoxOptions ) );

    // Arrow between boxes
    var arrowNode = new RightArrowNode( { fill: RPALColors.REACTION_BAR_COLOR, stroke: null, scale: 0.75 } );

    // layout of boxes and arrow
    var hBox = new HBox( { children: [ this.beforeBox, arrowNode, this.afterBox ], spacing: 10 } );
    thisNode.addChild( hBox );

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    this.quantityNodes = []; // @private
    var imageNodes = [];
    this.productImageNode = []; // @private needed for 'custom sandwich' scenario
    var symbolNodes = [];

    // explicitly hoist vars that are reused in loops
    var reactant, product, i, xMargin, centerX, deltaX, quantityNode, imageNode, symbolNode, moleculeStackNode;

    // reactants: stuff below the 'before' box
    var reactantsParent = new Node();
    thisNode.addChild( reactantsParent );
    var numberOfReactants = reaction.reactants.length;
    xMargin = ( numberOfReactants > 2 ) ? 0 : ( 0.15 * options.boxSize.width ); // make 2 reactants case look nice
    deltaX = ( options.boxSize.width - ( 2 * xMargin ) ) / numberOfReactants;
    centerX = this.beforeBox.left + xMargin + (deltaX / 2 );
    for ( i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // quantity is editable via a spinner
      quantityNode = new NumberSpinner( reactant.quantityProperty, options.quantityRange, { font: QUANTITY_FONT, centerX: centerX } );
      reactantsParent.addChild( quantityNode );
      this.quantityNodes.push( quantityNode );

      // image
      imageNode = new Node( { children: [ reactant.molecule.node ], centerX: quantityNode.centerX } );
      reactantsParent.addChild( imageNode );
      imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.molecule.symbol, { font: SYMBOL_FONT, centerX: quantityNode.centerX } );
        reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // products: stuff below the 'after' box
    var productsParent = new Node();
    thisNode.addChild( productsParent );
    var numberOfProducts = reaction.products.length;
    xMargin = ( numberOfProducts + numberOfReactants > 2 ) ? 0 : ( 0.15 * options.boxSize.width ); // make 2 reactants case look nice
    deltaX = ( options.boxSize.width - ( 2 * xMargin ) ) / ( numberOfProducts + numberOfReactants );
    centerX = this.afterBox.left + xMargin + (deltaX / 2 );
    for ( i = 0; i < numberOfProducts; i++ ) {

      product = reaction.products[i];

      // quantity is not editable
      quantityNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      productsParent.addChild( quantityNode );
      this.quantityNodes.push( quantityNode );

      // image
      imageNode = new Node( { children: [ product.molecule.node ], centerX: quantityNode.centerX } );
      productsParent.addChild( imageNode );
      imageNodes.push( imageNode );
      this.productImageNode.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( product.molecule.symbol, { font: SYMBOL_FONT, centerX: quantityNode.centerX } );
        productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // leftovers: stuff below the 'after' box, to the right of the products
    var leftoversParent = new Node();
    thisNode.addChild( leftoversParent );
    for ( i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // quantity is not editable
      quantityNode = new NumberNode( reactant.leftoversProperty, { font: QUANTITY_FONT, centerX: centerX } );
      leftoversParent.addChild( quantityNode );
      this.quantityNodes.push( quantityNode );

      // image
      imageNode = new Node( { children: [ reactant.molecule.node ], centerX: quantityNode.centerX } );
      leftoversParent.addChild( imageNode );
      imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.molecule.symbol, { font: SYMBOL_FONT, centerX: quantityNode.centerX } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // vertical layout of components below the boxes
    var maxQuantityHeight = _.max( this.quantityNodes, function( node ) { return node.height; } ).height;
    var maxImageHeight = Math.max( options.maxImageSize.height, _.max( imageNodes, function( node ) { return node.height; } ).height );
    var maxSymbolHeight = _.max( symbolNodes, function( node ) { return node.height; } ).height;
    var numberOfColumns = this.quantityNodes.length;
    var componentsTop = this.beforeBox.bottom + BOX_QUANTITY_Y_SPACING;
    for ( i = 0; i < numberOfColumns; i++ ) {
      this.quantityNodes[i].centerY = componentsTop + ( maxQuantityHeight / 2 );
      imageNodes[i].centerY = componentsTop + maxQuantityHeight + QUANTITY_IMAGE_Y_SPACING + ( maxImageHeight / 2 );
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

    var reactantsBracket = new HBracketNode( new Text( reactantsString, bracketLabelOptions ), _.extend( {
      bracketWidth: Math.max( options.maxImageSize.width, reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: reactantsParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( reactantsBracket );

    var productsBracket = new HBracketNode( new Text( productsString, bracketLabelOptions ), _.extend( {
      bracketWidth: Math.max( options.maxImageSize.width, productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: productsParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( productsBracket );

    var leftoversBracket = new HBracketNode( new Text( leftoversString, bracketLabelOptions ), _.extend( {
      bracketWidth: Math.max( options.maxImageSize.width, leftoversParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: leftoversParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( leftoversBracket );

    // molecule stacks inside the 'before' and 'after' boxes
    this.moleculeStackNodes = []; // @private
    var startCenterY = beforeContent.height - options.boxYMargin - ( maxImageHeight / 2 );
    var deltaY = ( beforeContent.height - ( 2 * options.boxYMargin ) - maxImageHeight ) / ( options.quantityRange.max - 1 );

    // reactants inside the 'before' box
    for ( i = 0; i < numberOfReactants; i++ ) {
      reactant = reaction.reactants[i];
      moleculeStackNode = new MoleculeStackNode( reactant.quantityProperty, reactant.molecule.nodeProperty,
        this.quantityNodes[i].centerX, startCenterY, deltaY );
      beforeContent.addChild( moleculeStackNode );
    }

    // products inside the 'after' box
    for ( i = 0; i < numberOfProducts; i++ ) {
      product = reaction.products[i];
      moleculeStackNode = new MoleculeStackNode( product.quantityProperty, product.molecule.nodeProperty,
          this.quantityNodes[i + numberOfReactants ].centerX - ( this.afterBox.left - this.beforeBox.left ), startCenterY, deltaY );
      afterContent.addChild( moleculeStackNode );
    }

    // leftovers inside the 'after' box
    for ( i = 0; i < numberOfReactants; i++ ) {
      reactant = reaction.reactants[i];
      moleculeStackNode = new MoleculeStackNode( reactant.leftoversProperty, reactant.molecule.nodeProperty,
          this.quantityNodes[i + numberOfReactants + numberOfProducts].centerX - ( this.afterBox.left - this.beforeBox.left ), startCenterY, deltaY );
      afterContent.addChild( moleculeStackNode );
    }

    // pass options to supertype
    thisNode.mutate( options );
  }

  return inherit( Node, ReactionBoxesNode, {

    // @public Unlinks all property observers. The node is no longer functional after calling this function.
    dispose: function() {

      // accordion boxes from 'expand' properties
      this.beforeBox.dispose();
      this.afterBox.dispose();

      // quantity spinners and displays
      this.quantityNodes.forEach( function( quantityNode ) {
        quantityNode.dispose();
      } );

      // molecule stacks
      this.moleculeStackNodes.forEach( function( moleculeStackNode ) {
        moleculeStackNode.dispose();
      } );
    }
  } );
} );
