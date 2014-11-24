// Copyright 2002-2014, University of Colorado Boulder

/**
 * Collection of static string utilities used for development.
 * Some of this began its life as toString functions associated with various types.
 * But it's a decent chunk of code, and very development-specific, so it was consolidated here.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var DevStringUtils = {

    /**
     * String representation of a reaction equation, with HTML stripped out.
     * @param {Reaction} reaction
     * @returns {string}
     * @static
     */
    equationString: function( reaction ) {
      var s = '';
      // reactants
      for ( var i = 0; i < reaction.reactants.length; i++ ) {
        if ( i !== 0 ) { s += '+ '; }
        s += ( reaction.reactants[i].coefficient + ' ' + reaction.reactants[i].symbol + ' ' );
      }
      // right arrow
      s += '\u2192 ';
      // products
      for ( i = 0; i < reaction.products.length; i++ ) {
        if ( i !== 0 ) { s += '+ '; }
        s += ( reaction.products[i].coefficient + ' ' + reaction.products[i].symbol );
        if ( i < reaction.products.length - 1 ) {
          s += ' ';
        }
      }
      return s.replace( /<sub>/g, '' ).replace( /<\/sub>/g, '' );
    },

    /**
     * String representation of quantities for reactants, products and leftovers.
     * Example: 4,1 -> 1,2,2,0
     * @param {Reaction} reaction
     * @returns {string}
     * @static
     */
    quantitiesString: function( reaction ) {
      var s = '';
      var i = 0;
      // reactants
      for ( i = 0; i < reaction.reactants.length; i++ ) {
        if ( i !== 0 ) { s += ','; }
        s += reaction.reactants[i].quantity;
      }
      // right arrow
      s += ' \u2192 ';
      // products
      for ( i = 0; i < reaction.products.length; i++ ) {
        if ( i !== 0 ) { s += ','; }
        s += reaction.products[i].quantity;
      }
      // leftovers
      for ( i = 0; i < reaction.leftovers.length; i++ ) {
        s += ',';
        s += reaction.leftovers[i].quantity;
      }
      return s;
    },

    /**
     * String representation of a reaction, including quantities.
     * Example: 2H2 + 1O2 -> 2H2O : 2,2 -> 2,0,1
     * @param {Reaction} reaction
     * @returns {string}
     * @static
     */
    reactionString: function( reaction ) {
      return DevStringUtils.equationString( reaction ) + ' : ' + DevStringUtils.quantitiesString( reaction );
    }
  };

  return DevStringUtils;
} );
