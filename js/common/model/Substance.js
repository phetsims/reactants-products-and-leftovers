// Copyright 2002-2014, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {number} coefficient substance's coefficient in the reaction equation
   * @param {string} symbol used in reaction equation
   * @param {SCENERY.Node} node visual representation of the substance
   * @param {number} [quantity] how much of a substance we have before the reaction occurs, defaults to zero
   * @constructor
   */
  function Substance( coefficient, symbol, node, quantity ) {

    quantity = quantity || 0;

    assert && assert( coefficient >= 0 );
    assert && assert( quantity >= 0 );

    this.symbol = symbol; // {String}

    PropertySet.call( this, {
      coefficient: coefficient, // {number} substance's coefficient in the reaction equation
      node: node, // {Node} visual representation of the substance, mutable to support the 'custom sandwich' case
      quantity: quantity  // {number} how much of the substance we have before the reaction occurs
    } );
  }

  return inherit( PropertySet, Substance, {

    /**
     * Scenery is a DAG and allows one instance of a Node to appear in the scenegraph in
     * multiple places, with 2 caveats: (1) a Node cannot be a sibling of itself, and (2)
     * transforming a node will do so everywhere that it appears. Because a Substance will
     * appear in multiple places in the view, this function provides a convenient way to
     * wrap this.node, so that we don't accidentally make it a sibling of itself, or
     * attempt to position it.
     * @param {Object} [options] options for the {Node} wrapper
     * @returns {SCENERY.Node}
     */
    getWrappedNode: function( options ) {
      return new Node( _.extend( {}, options, { children: [ this.node ] } ) );
    },

    /*
     * Are 2 substances the same? AXON.Property observers are not considered.
     * @param {Substance} substance
     * @return {boolean}
     */
    equals: function( substance ) {
      return ( substance instanceof Substance &&
               this.coefficient === substance.coefficient &&
               this.symbol === substance.symbol &&
               this.node === substance.node &&
               this.quantity === substance.quantity );
    }
  } );
} );
