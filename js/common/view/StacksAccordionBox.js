// Copyright 2014-2020, University of Colorado Boulder

/**
 *  Accordion box that shows stacks of substances. Used in the 'Sandwiches' and 'Molecules' screens.
 *
 *  @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const StackNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StackNode' );

  // constants
  const MAX_TITLE_PERCENTAGE = 0.75; // title will be scaled down if greater than this percentage of the box width

  class StacksAccordionBox extends AccordionBox {

    /**
     * @param {Substance[]} substances substances in the box
     * @param {number[]} xOffsets x-offsets of each substance, in the same order as substances param
     * @param {Object} [options]
     */
    constructor( substances, xOffsets, options ) {

      assert && assert( substances.length === xOffsets.length );

      options = merge( {

        // AccordionBox options
        fill: RPALColors.BOX_FILL,
        stroke: RPALColors.BOX_STROKE,
        cornerRadius: 3,
        expandCollapseButtonOptions: {
          touchAreaXDilation: 10,
          touchAreaYDilation: 10
        },
        titleNode: null, // {Node} optional title for the box
        titleBarOptions: {
          fill: RPALColors.PANEL_FILL
        },
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
      const content = new Node();

      // rectangle with no fill, this ensures constant size of the content
      const rectangle = new Rectangle( 0, 0, options.contentSize.width, options.contentSize.height, options.cornerRadius, options.cornerRadius );
      content.addChild( rectangle );

      // compute max height of the nodes in the box
      const maxIconHeight = Math.max(
        options.minIconSize.height,
        _.maxBy( substances, substance => substance.iconProperty.get().height ).iconProperty.get().height );

      // vertical stacks of nodes inside the box
      const stackNodes = []; // @private
      const deltaY = ( options.contentSize.height - ( 2 * options.boxYMargin ) - maxIconHeight ) / ( options.maxQuantity - 1 );
      const startCenterY = rectangle.height - options.boxYMargin - ( maxIconHeight / 2 );
      for ( let i = 0; i < substances.length; i++ ) {
        const substance = substances[ i ];
        const stackNode = new StackNode( options.contentSize.height, substance.iconProperty, substance.quantityProperty, startCenterY, deltaY, {
          centerX: xOffsets[ i ]
        } );
        content.addChild( stackNode );
        stackNodes.push( stackNode );
      }

      super( content, options );

      // @private
      this.disposeStacksAccordionBox = () => {
        stackNodes.forEach( node => node.dispose() );
        stackNodes.length = 0;
      };
    }

    /**
     * @public
     * @override
     */
    dispose() {
      super.dispose();
      this.disposeStacksAccordionBox();
    }
  }

  return reactantsProductsAndLeftovers.register( 'StacksAccordionBox', StacksAccordionBox );
} );
