// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory functions for creating the icons used for level-selection buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var doubleQuestionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/doubleQuestionMark' );
  var questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

  // constants
  var FONT = new RPALFont( { size: 70, weight: 'bold' } );
  var MOLECULE_SCALE = 3;

  var createIcon = function( leftNode, rightNode ) {
    var arrowNode = new ArrowNode( 0, 0, 50, 0, {
      headHeight: 20,
      headWidth: 20,
      tailWidth: 6
    } );
    return new LayoutBox( { children: [ leftNode, arrowNode, rightNode ], orientation: 'horizontal', spacing: 20 } );
  };

  return {

    // ? -> HCl
    createLevelOneIcon: function() {
      var leftNode = new Text( questionMarkString, { font: FONT } );
      var rightNode = new HClNode( RPALConstants.ATOM_OPTIONS );
      rightNode.setScaleMagnitude( MOLECULE_SCALE );
      return createIcon( leftNode, rightNode );
    },

    // H2O -> ?
    createLevelTwoIcon: function() {
      var leftNode = new H2ONode( RPALConstants.ATOM_OPTIONS );
      leftNode.setScaleMagnitude( MOLECULE_SCALE );
      var rightNode = new Text( questionMarkString, { font: FONT } );
      return createIcon( leftNode, rightNode );
    },

    // NH3 -> ??
    createLevelThreeIcon: function() {
      var leftNode = new NH3Node( RPALConstants.ATOM_OPTIONS );
      leftNode.setScaleMagnitude( MOLECULE_SCALE );
      var rightNode = new Text( doubleQuestionMarkString, { font: FONT } );
      return createIcon( leftNode, rightNode );
    }
  };
} );
