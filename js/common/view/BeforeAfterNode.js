// Copyright 2014-2018, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const QuantitiesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/QuantitiesNode' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const StacksAccordionBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StacksAccordionBox' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const afterReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/afterReaction' );
  const beforeReactionString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/beforeReaction' );

  // constants
  const TITLE_OPTIONS = { font: new RPALFont( 14 ), fill: 'white' }; // box titles

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

    Node.call( this );

    // vars to improve readability
    const reactants = reaction.reactants;
    const products = reaction.products;
    const leftovers = reaction.leftovers;

    // x-offsets of the substances relative to their boxes
    const beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.contentSize.width );
    const afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.contentSize.width );

    // @private 'Before Reaction' box, with stacks of reactants
    this.beforeBox = new StacksAccordionBox( reactants, beforeXOffsets, _.extend( {
      expandedProperty: beforeExpandedProperty,
      titleNode: new Text( options.beforeTitle, TITLE_OPTIONS ),
      maxQuantity: options.quantityRange.max
    }, options ) );

    // @private 'After Reaction' box, with stacks of products and leftovers
    this.afterBox = new StacksAccordionBox( products.concat( leftovers ), afterXOffsets, _.extend( {
      expandedProperty: afterExpandedProperty,
      titleNode: new Text( options.afterTitle, TITLE_OPTIONS ),
      maxQuantity: options.quantityRange.max
    }, options ) );

    // Arrow between boxes
    const arrowNode = new RightArrowNode( { fill: RPALColors.PANEL_FILL, stroke: null, scale: 0.75 } );

    // layout of boxes and arrow
    const hBox = new LayoutBox( {
      children: [ this.beforeBox, arrowNode, this.afterBox ],
      orientation: 'horizontal',
      spacing: 10
    } );
    this.addChild( hBox );

    // @private Everything below the boxes
    this.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      showSymbols: options.showSymbols,
      boxWidth: options.contentSize.width,
      afterBoxXOffset: this.afterBox.left - this.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      x: this.beforeBox.x,
      top: this.beforeBox.bottom + 6
    } );
    this.addChild( this.quantitiesNode );

    // a11y - set the order in the PDOM
    this.accessibleOrder = [ this.quantitiesNode, hBox ];

    // pass options to supertype
    this.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'BeforeAfterNode', BeforeAfterNode );

  return inherit( Node, BeforeAfterNode, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {

      // accordion boxes
      this.beforeBox.dispose();
      this.beforeBox = null;
      this.afterBox.dispose();
      this.afterBox = null;

      // stuff below the boxes
      this.quantitiesNode.dispose();
      this.quantitiesNode = null;

      Node.prototype.dispose.call( this );
    }
  } );
} );
