// Copyright 2014-2017, University of Colorado Boulder

/**
 *  Accordion box that shows stacks of substances. Used in the 'Sandwiches' and 'Molecules' screens.
 *
 *  @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var StackNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StackNode' );

  // constants
  var MAX_TITLE_PERCENTAGE = 0.75; // title will be scaled down if greater than this percentage of the box width

  /**
   * @param {Substance[]} substances substances in the box
   * @param {number[]} xOffsets x-offsets of each substance, in the same order as substances param
   * @param {Object} [options]
   * @constructor
   */
  function StacksAccordionBox( substances, xOffsets, options ) {

    assert && assert( substances.length === xOffsets.length );

    options = _.extend( {

      // AccordionBox options
      fill: RPALColors.BOX_FILL,
      stroke: RPALColors.BOX_STROKE,
      cornerRadius: 3,
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,
      titleNode: null, // {Node} optional title for the box
      titleBarFill: RPALColors.PANEL_FILL,
      titleAlignX: 'center',
      buttonAlign: 'right',
      contentXMargin: 0,
      contentYMargin: 0,
      contentYSpacing: 0,

      // StacksAccordionBox options
      contentSize: new Dimension2( 100, 100 ), // size of box's content
      maxQuantity: 2, // max substances in a stack
      minIconSize: new Dimension2( 0, 0 ), // minimum amount of layout space reserved for Substance icons
      boxYMargin: 6 // vertical margin between the inner edge of box and the tallest node

    }, options );

    // scale the title to fit
    if ( options.titleNode ) {
      options.titleNode.setScaleMagnitude( Math.min( 1, MAX_TITLE_PERCENTAGE * options.contentSize.width / options.titleNode.width ) );
    }

    // content for the accordion box
    var content = new Node();

    // rectangle with no fill, this ensures constant size of the content
    var rectangle = new Rectangle( 0, 0, options.contentSize.width, options.contentSize.height, options.cornerRadius, options.cornerRadius );
    content.addChild( rectangle );

    // compute max height of the nodes in the box
    var maxIconHeight = Math.max(
      options.minIconSize.height,
      _.maxBy( substances, function( substance ) { return substance.iconProperty.get().height; } ).iconProperty.get().height );

    // vertical stacks of nodes inside the box
    this.stackNodes = []; // @private
    var deltaY = ( options.contentSize.height - ( 2 * options.boxYMargin ) - maxIconHeight ) / ( options.maxQuantity - 1 );
    var startCenterY = rectangle.height - options.boxYMargin - ( maxIconHeight / 2 );
    for ( var i = 0; i < substances.length; i++ ) {
      var substance = substances[ i ];
      var stackNode = new StackNode( options.contentSize.height, substance.iconProperty, substance.quantityProperty, startCenterY, deltaY, {
        centerX: xOffsets[ i ]
      } );
      content.addChild( stackNode );
      this.stackNodes.push( stackNode );
    }

    AccordionBox.call( this, content, options );
  }

  reactantsProductsAndLeftovers.register( 'StacksAccordionBox', StacksAccordionBox );

  return inherit( AccordionBox, StacksAccordionBox, {

    // @override @public Ensures that this node is eligible for GC.
    dispose: function() {
      AccordionBox.prototype.dispose.call( this );
      this.stackNodes.forEach( function( node ) { node.dispose(); } );
      this.stackNodes = null;
    }
  } );
} );
