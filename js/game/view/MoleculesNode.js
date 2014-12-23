// Copyright 2002-2014, University of Colorado Boulder

/**
 * Draws substances in a Before/After box using Canvas.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = 2; // stored images are scaled this much to improve quality

  /**
   * @param {Substance[]} substances
   * @param {Bounds2} canvasBounds
   * @param {Object} [options]
   * @constructor
   */
  function MoleculesNode( substances, canvasBounds, options ) {

    options = _.extend( {
      boxSize: new Dimension2( 100, 100 ),
      margin: 5, // margin around the inside edge of the box
      maxQuantity: 8,
      /**
       * Molecules in the box are arranged in a grid. This option controls how much the molecules are randomly offset from the center
       * of the grid's cells. Higher values make the layout look less grid-like, but result in more overlap of molecules (a trade-off).
       */
      randomOffset: 8
    }, options );

    var thisNode = this;
    CanvasNode.call( thisNode, { canvasBounds: canvasBounds } );

    this.updateAllowed = false; // @private calling update is not allowed (but may occur) until this instance is fully initialized
    this.substances = substances; // @private
    this.randomOffset = options.randomOffset; // @private

    /*
     * Compute the size of the grid needed to accommodate the maximum number of nodes.
     * Assume that the box is square-ish, so can have the same number of rows and columns.
     */
    var rows = Math.round( Math.sqrt( substances.length * options.maxQuantity ) );
    var columns = rows;

    // @private positions in the grid, this is our 'pool' of positions.
    this.positions = [];
    var dx = Math.floor( ( options.boxSize.width - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / columns );
    var dy = Math.floor( ( options.boxSize.height - ( 2 * options.margin ) - ( 2 * options.randomOffset ) ) / rows );
    for ( var column = 0; column < columns; column++ ) {
      for ( var row = 0; row < rows; row++ ) {
        var x = options.margin + options.randomOffset + ( dx / 2 ) + ( column * dx );
        var y = options.margin + options.randomOffset + ( dy / 2 ) + ( row * dy );
        this.positions.push( new Vector2( x, y ) );
      }
    }
    assert && assert( this.positions.length === rows * columns );

    // Generate images asynchronously.
    var createImage = function( substance ) {
      // Scale up to increase quality. Remember to scale down when drawing to canvas.
      var node = new Node( { children: [ substance.icon ], scale: IMAGE_SCALE } );
      node.toImage( function( image, x, y ) {
        thisNode.substancesData[ substance.symbol ].image = image;
        thisNode.update(); // force an update when image becomes available
      } );
    };

    // use typed array if available, it will use less memory and be faster
    var ArrayConstructor = window.Float32Array || window.Array;

    /*
     * Iterate over all substances.
     * Build a data structure that we'll use to store information for each unique type of molecule.
     * The data structure looks like:
     *
     * {
     *    H<sub>2</sub>O: { image:..., quantity:..., centerX: [...], centerY: [...] },
     *    C:              { image:..., quantity:..., centerX: [...], centerY: [...] },
     *    CO<sub>2</sub>: { image:..., quantity:..., centerX: [...], centerY: [...] },
     *    ...
     * }
     */
    this.substancesData = {};
    substances.forEach( function( substance ) {
      thisNode.substancesData[ substance.symbol ] = {
        image: null, // will be populated asynchronously
        quantity: 0,
        // pre-allocate arrays to improve performance
        centerX: new ArrayConstructor( options.maxQuantity ),
        centerY: new ArrayConstructor( options.maxQuantity ),
        gridPositions: [] // {Vector2[]}
      };
      createImage( substance ); // populate the image field asynchronously
    } );

    this.updateAllowed = true; // ok to call update

    // redraw when any substance's quantity changes
    thisNode.quantityPropertyObserver = function( quantity ) {
      thisNode.update();
    };
    substances.forEach( function( substance ) {
      substance.quantityProperty.link( thisNode.quantityPropertyObserver ); // must be unlinked in dispose
    } );
  }

  return inherit( CanvasNode, MoleculesNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      var thisNode = this;
      thisNode.substances.forEach( function( substance ) {
        substance.quantityProperty.unlink( thisNode.quantityPropertyObserver );
      } );
    },

    /**
     * Chooses a random position and remove it from the pool of positions.
     * @returns {Vector2}
     * @private
     */
    choosePosition: function() {
      assert && assert( this.positions.length > 0 );
      var index = _.random( 0, this.positions.length - 1 );
      var position = this.positions[ index ];
      this.positions.splice( index, 1 );
      return position;
    },

    /**
     * Puts a position back in the pool of positions.
     * @param {Vector2} position
     * @private
     */
    releasePosition: function( position ) {
      this.positions.push( position );
    },

    /*
     * Updates the substances data structure and triggers a paintCanvas.
     * @private
     */
    update: function() {

      if ( !this.updateAllowed ) { return; }

      var thisNode = this;

      // Update the data structure for each substance
      thisNode.substances.forEach( function( substance ) {

        var substanceData = thisNode.substancesData[ substance.symbol ];

        // add additional icons as needed
        var i, gridPosition;
        if ( substance.quantity > substanceData.quantity ) {
          for ( i = substanceData.quantity; i < substance.quantity; i++ ) {
            gridPosition = thisNode.choosePosition();
            substanceData.gridPositions[i] = gridPosition;
            substanceData.centerX[i] = gridPosition.x + _.random( -thisNode.randomOffset, thisNode.randomOffset );
            substanceData.centerY[i] = gridPosition.y + _.random( -thisNode.randomOffset, thisNode.randomOffset );
          }
        }
        else if ( substance.quantity < substanceData.quantity ) {
          // free up cells in the grid
          for ( i = substanceData.quantity - 1; i > substanceData.quantity; i-- ) {
            thisNode.releasePosition( substanceData.gridPositions[i] );
          }
        }
        substanceData.quantity = substance.quantity;
      } );

      // This results in paintCanvas being called.
      thisNode.invalidatePaint();
    },

    /*
     * Iterates over each of the substances and draws their icons directly to Canvas.
     * @param {CanvasContextWrapper} wrapper
     * @override
     * @protected
     */
    paintCanvas: function( wrapper ) {

      var thisNode = this;

      /*
       * Images are stored at a higher resolution to improve their quality.
       * Apply the inverse scale factor to the graphics context, and adjust the radius.
       */
      wrapper.context.scale( 1 / IMAGE_SCALE, 1 / IMAGE_SCALE );

      // Draw each type of molecule that is in the current solution.
      thisNode.substances.forEach( function( substance ) {
        var substancesData = thisNode.substancesData[ substance.symbol ];
        // images are generated asynchronously, so test in case they aren't available when this is first called
        if ( substancesData.image ) {
          for ( var i = 0; i < substancesData.quantity; i++ ) {
            var x = ( IMAGE_SCALE * substancesData.centerX[i] ) - ( substancesData.image.width / 2 );
            var y = ( IMAGE_SCALE * substancesData.centerY[i] ) - ( substancesData.image.height / 2 );
            // Use integer coordinates with drawImage to improve performance.
            wrapper.context.drawImage( substancesData.image, Math.floor( x ), Math.floor( y ) );
          }
        }
      } );
    }
  } );
} );
