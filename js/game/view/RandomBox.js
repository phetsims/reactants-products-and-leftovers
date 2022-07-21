// Copyright 2014-2022, University of Colorado Boulder

/**
 * Displays substances at random positions in a box.
 * This is used for the 'Before' and 'After' boxes in the Game screen.
 *
 * To improve performance:
 * - Nodes are created as needed.
 * - Nodes are never removed; they remain as children for the lifetime of this node.
 * - The visibility of nodes is adjusted to show the correct quantity of the substance.
 * - When a node becomes visible, it is assigned a position in the grid.
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import RPALColors from '../../common/RPALColors.js';
import SubstanceIcon from '../../common/view/SubstanceIcon.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

class RandomBox extends Node {

  /**
   * @param {Substance[]} substances the substances in the box
   * @param {Object} [options]
   */
  constructor( substances, options ) {

    options = merge( {
      boxSize: new Dimension2( 100, 100 ),
      maxQuantity: 4, // the maximum quantity of each substance in the box
      cornerRadius: 3,
      fill: RPALColors.BOX_FILL,
      stroke: RPALColors.BOX_STROKE,
      margin: 5, // margin around the inside edge of the box

      /**
       * Molecules in the box are arranged in a grid. This option controls how much the molecules are randomly offset from the center
       * of the grid's cells. Higher values make the layout look less grid-like, but result in more overlap of molecules (a trade-off).
       */
      randomOffset: 8
    }, options );

    super();

    /*
     * Compute the size of the grid needed to accommodate the maximum number of nodes.
     * Assume that the box is square-ish, so can have the same number of rows and columns.
     */
    const rows = Utils.roundSymmetric( Math.sqrt( substances.length * options.maxQuantity ) );
    const columns = rows;

    // Compute positions in the grid, this is our 'pool' of positions.
    const positions = [];
    const dx = Math.floor( ( options.boxSize.width - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / columns );
    const dy = Math.floor( ( options.boxSize.height - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / rows );
    for ( let column = 0; column < columns; column++ ) {
      for ( let row = 0; row < rows; row++ ) {
        const x = options.margin + options.randomOffset + ( dx / 2 ) + ( column * dx );
        const y = options.margin + options.randomOffset + ( dy / 2 ) + ( row * dy );
        positions.push( new Vector2( x, y ) );
      }
    }
    assert && assert( positions.length === rows * columns );

    /**
     * Chooses a random position and remove it from the pool of positions.
     * @returns {Vector2}
     */
    const choosePosition = () => {
      assert && assert( positions.length > 0 );
      const index = dotRandom.nextIntBetween( 0, positions.length - 1 );
      const position = positions[ index ];
      positions.splice( index, 1 );
      return position;
    };

    /**
     * Puts a position back in the pool of positions.
     * @param {Vector2} position
     */
    const releasePosition = position => {
      positions.push( position );
    };

    // the box
    const boxNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: options.fill,
      stroke: options.stroke
    } );
    this.addChild( boxNode );

    // substances inside the box
    this.substanceLayers = []; // @private [{SubstanceLayer}]
    const parent = new Node();
    substances.forEach( substance => {
      const substanceLayer = new SubstanceLayer( substance.iconProperty, substance.quantityProperty, options.randomOffset, choosePosition, releasePosition );
      parent.addChild( substanceLayer );
      this.substanceLayers.push( substanceLayer );
    } );
    this.addChild( parent );

    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.substanceLayers.forEach( node => node.dispose() );
    this.substanceLayers = null;
    super.dispose();
  }
}

/**
 * Responsible for managing all nodes for one substance type.
 */
class SubstanceLayer extends Node {

  /**
   * @param {Property.<Node>} iconProperty
   * @param {Property.<number>} quantityProperty
   * @param {number} randomOffset
   * @param {function} choosePosition returns {Vector2}
   * @param {function} releasePosition @param {Vector2}
   */
  constructor( iconProperty, quantityProperty, randomOffset, choosePosition, releasePosition ) {

    super();

    this.cellNodes = []; // @private {CellNode[]}

    this.quantityPropertyObserver = quantity => {

      const count = Math.max( quantity, this.getChildrenCount() );

      for ( let i = 0; i < count; i++ ) {

        if ( i < this.getChildrenCount() ) {

          // node already exists
          const node = this.getChildAt( i );
          const nodeWasVisible = node.visible;
          node.visible = ( i < quantity );

          if ( node.visible && !nodeWasVisible ) {
            // when an existing node becomes visible, choose a new position for it
            node.setGridPosition( choosePosition() );
          }
          else if ( !node.visible && nodeWasVisible ) {
            // when a visible node becomes invisible, make its position available
            releasePosition( node.getGridPosition() );
          }
        }
        else {
          // add a node
          const cellNode = new CellNode( iconProperty, choosePosition(), randomOffset );
          this.addChild( cellNode );
          this.cellNodes.push( cellNode );
        }
      }
    };
    this.quantityProperty = quantityProperty; // @private
    this.quantityProperty.link( this.quantityPropertyObserver ); // must be unlinked in dispose
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.cellNodes.forEach( node => node.dispose() );
    this.cellNodes = null;
    this.quantityProperty.unlink( this.quantityPropertyObserver );
    super.dispose();
  }
}

/**
 * Icon that occupies a cell in the grid, randomizes its position to make the grid look less regular.
 */
class CellNode extends SubstanceIcon {

  /**
   * @param {Property.<Node>} iconProperty
   * @param {Vector2} gridPosition
   * @param {number} randomOffset
   */
  constructor( iconProperty, gridPosition, randomOffset ) {

    super( iconProperty );

    this.gridPosition = gridPosition; // @private
    this.randomOffset = randomOffset; // @private

    this.setGridPosition( gridPosition ); // initialize position
  }

  /**
   * Gets the grid position.
   * @returns {Vector2}
   * @public
   */
  getGridPosition() {
    return this.gridPosition;
  }

  /**
   * Sets the grid position.
   * @param {Vector2} gridPosition
   * @public
   */
  setGridPosition( gridPosition ) {
    this.gridPosition = gridPosition;
    // Move this node to the specified grid position, with some randomized offset.
    this.centerX = gridPosition.x + dotRandom.nextIntBetween( -this.randomOffset, this.randomOffset );
    this.centerY = gridPosition.y + dotRandom.nextIntBetween( -this.randomOffset, this.randomOffset );
  }
}

reactantsProductsAndLeftovers.register( 'RandomBox', RandomBox );
export default RandomBox;