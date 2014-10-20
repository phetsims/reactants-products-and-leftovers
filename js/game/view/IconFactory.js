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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pattern_Level_0 = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/pattern_Level_0' );
  var doubleQuestionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/doubleQuestionMark' );
  var questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

  // constants
  var LABEL_OPTIONS = { font: new RPALFont( 45 ) };
  var QUESTION_MARK_OPTIONS = { font: new RPALFont( { size: 70, weight: 'bold' } ) };
  var ARROW_OPTIONS = { headHeight: 20, headWidth: 20, tailWidth: 6 };
  var MOLECULE_SCALE = 3;

  /*
   *  Level N
   *  leftNode -> rightNode
   */
  var createIcon = function( level, leftNode, rightNode ) {
    var labelNode = new Text( StringUtils.format( pattern_Level_0, level ), LABEL_OPTIONS );
    var arrowNode = new ArrowNode( 0, 0, 50, 0, ARROW_OPTIONS );
    var icon = new LayoutBox( { children: [ leftNode, arrowNode, rightNode ], orientation: 'horizontal', spacing: 20 } );
    return new LayoutBox( { children: [ labelNode, icon ], orientation: 'vertical', spacing: 30 } );
  };

  return {

    /**
     *  Level 1
     *  ? -> HCl
     */
    createLevelOneIcon: function() {
      var leftNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
      var rightNode = new HClNode( RPALConstants.ATOM_OPTIONS );
      rightNode.setScaleMagnitude( MOLECULE_SCALE );
      return createIcon( 1, leftNode, rightNode );
    },

    /**
     *  Level 2
     *  H2O -> ?
     */
    createLevelTwoIcon: function() {
      var leftNode = new H2ONode( RPALConstants.ATOM_OPTIONS );
      leftNode.setScaleMagnitude( MOLECULE_SCALE );
      var rightNode = new Text( questionMarkString, QUESTION_MARK_OPTIONS );
      return createIcon( 2, leftNode, rightNode );
    },

    /**
     *  Level 3
     *  NH3 -> ??
     */
    createLevelThreeIcon: function() {
      var leftNode = new NH3Node( RPALConstants.ATOM_OPTIONS );
      leftNode.setScaleMagnitude( MOLECULE_SCALE );
      var rightNode = new Text( doubleQuestionMarkString, QUESTION_MARK_OPTIONS );
      return createIcon( 3, leftNode, rightNode );
    }
  };
} );
