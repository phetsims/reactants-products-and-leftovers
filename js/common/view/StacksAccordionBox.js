// Copyright 2002-2014, University of Colorado Boulder

/**
 *  Accordion box that shows stacks of 'items', used in the 'Sandwiches' and 'Molecules' screens.
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var StackNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StackNode' );

  // constants
  var MAX_TITLE_PERCENTAGE = 0.75; // title will be scaled down if greater than this percentage of the box width

  /**
   * @param {[BoxItem]} items items in the box
   * @param {Object} [options]
   * @constructor
   */
  function StacksAccordionBox( items, options ) {

    options = _.extend( {

      // AccordionBox options
      fill: 'white',
      stroke: RPALColors.BOX_STROKE,
      cornerRadius: 3,
      buttonTouchAreaDilatedX: 10,
      buttonTouchAreaDilatedY: 10,
      titleBarFill: RPALColors.PANEL_FILL,
      titleAlign: 'center',
      buttonAlign: 'right',
      contentXMargin: 0,
      contentYMargin: 0,
      contentYSpacing: 0,

      // StacksAccordionBox options
      contentSize: new Dimension2( 100, 100 ), // size of box's content
      quantityRange: RPALConstants.QUANTITY_RANGE,
      minIconSize: new Dimension2( 0, 0 ), // minimum amount of layout space reserved for Substance icons
      boxYMargin: 6 // vertical margin between the inner edge of box and the tallest node

    }, options );

    // title, scaled to fit
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
      _.max( items, function( item ) { return item.nodeProperty.get().height; } ).nodeProperty.get().height );

    // vertical stacks of nodes inside the box
    this.stackNodes = []; // @private see dispose
    var deltaY = ( options.contentSize.height - ( 2 * options.boxYMargin ) - maxIconHeight ) / ( options.quantityRange.max - 1 );
    var startCenterY = rectangle.height - options.boxYMargin - ( maxIconHeight / 2 );
    for ( var i = 0; i < items.length; i++ ) {
      var item = items[i];
      var stackNode = new StackNode( options.contentSize.height, item.nodeProperty, item.quantityProperty, startCenterY, deltaY, {
        centerX: item.centerX
      } );
      content.addChild( stackNode );
      this.stackNodes.push( stackNode );
    }

    AccordionBox.call( this, content, options );
  }

  return inherit( AccordionBox, StacksAccordionBox, {

    // @override Ensures that this node is eligible for GC.
    dispose: function() {
      AccordionBox.prototype.dispose.call( this );
      this.stackNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
