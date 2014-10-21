// Copyright 2002-2014, University of Colorado Boulder

/**
 * Visibility control for the 'Game' screen.
 * Provides the ability to hide either molecules or numbers in challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton');
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var showAllString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/showAll' );
  var hideMoleculesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/hideMolecules' );
  var hideNumbersString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/hideNumbers' );

  // constants
  var TEXT_OPTIONS = { font: new RPALFont( 14 ) };
  var RADIO_BUTTON_OPTIONS = { radius: 8, xSpacing: 10 };
  var FONT_AWESOME_OPTIONS = { scale: 0.5 };

  function VisibilityControl( moleculesVisibleProperty, numbersVisibleProperty, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 235, 245, 255 )',
      stroke: 'rgb( 180, 180, 180 )',
      lineWidth: 0.5
    }, options );

    //TODO consider changing the model so that this abomination can be deleted.
    /**
     * This evil piece of code deals with the fact that the model and this control don't match up very nicely.
     * The model has independent properties for the visibility of molecules and numbers.
     * But this control mixes "show" and "hide" controls, and makes these properties dependent on each other.
     */
    var showAllProperty = new Property( moleculesVisibleProperty.get() && numbersVisibleProperty.get() );
    Property.multilink( [ moleculesVisibleProperty, numbersVisibleProperty ],
      function( moleculesVisible, numbersVisible ) {
        assert && assert( moleculesVisible || numbersVisible );
        showAllProperty.set( moleculesVisible && numbersVisible );
      } );
    showAllProperty.link( function( visible ) {
      if ( visible ) {
        moleculesVisibleProperty.set( true );
        numbersVisibleProperty.set( true );
      }
    } );
    moleculesVisibleProperty.link( function( visible ) {
      if ( !visible ) {
        numbersVisibleProperty.set( true );
      }
    } );
    numbersVisibleProperty.link( function( visible ) {
      if ( !visible ) {
        moleculesVisibleProperty.set( true );
      }
    } );

    // radio buttons
    var showAllRadioButton = new AquaRadioButton( showAllProperty, true, createShowAllNode(), RADIO_BUTTON_OPTIONS );
    var hideMoleculesButton = new AquaRadioButton( moleculesVisibleProperty, false, createHideMoleculesNode(), RADIO_BUTTON_OPTIONS );
    var hideNumbersButton = new AquaRadioButton( numbersVisibleProperty, false, createHideNumbersNode(), RADIO_BUTTON_OPTIONS );

    // vertical layout
    var content = new LayoutBox( {
      children: [ showAllRadioButton, hideMoleculesButton, hideNumbersButton ],
      orientation: 'vertical',
      align: 'left',
      spacing: 15
    } );

    Panel.call( this, content, options );
  }

  /**
   * Creates the node for the 'Show All' radio button, an open eye with text to the right of it.
   * @returns {Node}
   */
  var createShowAllNode = function() {
    var eyeNode = new FontAwesomeNode( 'eye_open', FONT_AWESOME_OPTIONS );
    var textNode = new Text( showAllString, TEXT_OPTIONS );
    return new LayoutBox( {
      children: [ eyeNode, textNode ],
      orientation: 'horizontal',
      spacing: 12
    } );
  };

  /**
   * Creates the node for the 'Hide Molecules' radio button, a closed eye with '123' at lower right, and text to the right.
   * @returns {Node}
   */
  var createHideMoleculesNode = function() {
    var eyeNode = new FontAwesomeNode( 'eye_close', FONT_AWESOME_OPTIONS );
    var moleculeNode = new Node( {
      children: [ new H2ONode( RPALConstants.ATOM_OPTIONS ) ], // wrap in a Node because H2ONode doesn't work with standard options
      scale: 0.4,
      centerX: eyeNode.right,
      centerY: eyeNode.bottom
    } );
    var textNode = new Text( hideMoleculesString, TEXT_OPTIONS );
    return new LayoutBox( {
      children: [ new Node( { children: [ eyeNode, moleculeNode ] } ), textNode ],
      orientation: 'horizontal',
      spacing: 7
    } );
  };

  /**
   * Creates the node for the 'Hide Numbers' radio button, a closed eye with H2O molecule at lower right, and text to the right.
   * @returns {Node}
   */
  var createHideNumbersNode = function() {
    var eyeNode = new FontAwesomeNode( 'eye_close', FONT_AWESOME_OPTIONS );
    var numbersNode = new Text( '123', { font: new RPALFont( 8 ), centerX: eyeNode.right + 2, centerY: eyeNode.bottom } );
    var textNode = new Text( hideNumbersString, TEXT_OPTIONS );
    return new LayoutBox( {
      children: [ new Node( { children: [ eyeNode, numbersNode ] } ), textNode ],
      orientation: 'horizontal',
      spacing: 5
    } );
  };

  return inherit( Panel, VisibilityControl );
} );
