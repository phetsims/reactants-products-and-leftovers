// Copyright 2002-2014, University of Colorado Boulder

/**
 * This is the primary UI component for the 'Sandwiches' and 'Molecules' screens.
 * It displays a reaction as 2 boxes, representing the 'Before' and 'After' states of the reaction.
 * The 'Before' box is on the left, and shows the initial reactants.
 * The 'After' box is on the right, and shows the products and leftovers when the reaction has completed.
 * Below the 'Before' box is a set of spinners for changing the reactant quantities.
 * Below the 'After' box is a set of noneditable quantities for products and leftovers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var QuantitiesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/QuantitiesNode' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var StacksAccordionBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StacksAccordionBox' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var afterReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterReaction' );
  var beforeReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeReaction' );

  // constants
  var TITLE_OPTIONS = { font: new RPALFont( 14 ), fill: 'white' }; // AccordionBox titles
  var BOX_QUANTITY_Y_SPACING = 6; // vertical space between box and quantity

  /**
   * @param {Reaction} reaction the reaction to be displayed
   * @param {Property.<boolean>} beforeExpandedProperty whether the 'Before' box is expanded
   * @param {Property.<boolean>} afterExpandedProperty whether the 'After' box is expanded
   * @param {Object} [options]
   * @constructor
   */
  function BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {

    options = _.extend( {
      contentSize: new Dimension2( 100, 100 ), // {Dimension2} size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of the quantity values
      showSymbols: true, // {boolean} whether to show symbols (eg, H2O) for the substances in the reactions
      beforeTitle: beforeReactionString,  // {string} title on the 'Before' box
      afterTitle: afterReactionString, // {string} title on the 'After' box
      boxYMargin: 6, // {number} vertical margin between the inner edge of box and the tallest node
      minIconSize: new Dimension2( 0, 0 ) // {Dimension2} minimum amount of layout space reserved for Substance icons
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // vars to improve readability
    var reactants = reaction.reactants;
    var products = reaction.products;
    var leftovers = reaction.leftovers;

    //------------------------------------------------------------------------------------
    // x-offsets of the substances relative to their boxes
    //------------------------------------------------------------------------------------

    var beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.contentSize.width );
    var afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.contentSize.width );

    //------------------------------------------------------------------------------------
    // Accordion boxes & arrow
    //------------------------------------------------------------------------------------

    // @private 'Before Reaction' box, with stacks of reactants
    thisNode.beforeBox = new StacksAccordionBox( reactants, beforeXOffsets, _.extend( {
      expandedProperty: beforeExpandedProperty,
      titleNode: new Text( options.beforeTitle, TITLE_OPTIONS ),
      maxQuantity: options.quantityRange.max
    }, options ) );

    // @private 'After Reaction' box, with stacks of products and leftovers
    thisNode.afterBox = new StacksAccordionBox( products.concat( leftovers ), afterXOffsets, _.extend( {
      expandedProperty: afterExpandedProperty,
      titleNode: new Text( options.afterTitle, TITLE_OPTIONS ),
      maxQuantity: options.quantityRange.max
    }, options ) );

    // Arrow between boxes
    var arrowNode = new RightArrowNode( { fill: RPALColors.PANEL_FILL, stroke: null, scale: 0.75 } );

    // layout of boxes and arrow
    var hBox = new LayoutBox( {
        children: [ thisNode.beforeBox, arrowNode, thisNode.afterBox ],
        orientation: 'horizontal',
        spacing: 10 }
    );
    thisNode.addChild( hBox );

    //------------------------------------------------------------------------------------
    // Quantities, images, symbols and brackets below the boxes
    //------------------------------------------------------------------------------------

    // @private
    thisNode.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      boxWidth: options.contentSize.width,
      afterBoxXOffset: thisNode.afterBox.left - thisNode.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      x: thisNode.beforeBox.x,
      top: thisNode.beforeBox.bottom + BOX_QUANTITY_Y_SPACING
    } );
    thisNode.addChild( thisNode.quantitiesNode );

    // pass options to supertype
    thisNode.mutate( options );
  }

  return inherit( Node, BeforeAfterNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {

      // accordion boxes
      this.beforeBox.dispose();
      this.afterBox.dispose();

      // stuff below the boxes
      this.quantitiesNode.dispose();
    }
  } );
} );
