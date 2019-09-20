// Copyright 2014-2019, University of Colorado Boulder

/**
 * Radio buttons for selecting what's visible/hidden in Game challenges.
 * Provides the ability to hide either molecules or numbers (but not both).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const hideMoleculesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/hideMolecules' );
  const hideNumbersString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/hideNumbers' );
  const showAllString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/showAll' );

  // constants
  const TEXT_OPTIONS = { font: new RPALFont( 14 ) };
  const RADIO_BUTTON_OPTIONS = { radius: 8, xSpacing: 10 };
  const FONT_AWESOME_OPTIONS = { scale: 0.5 };
  const X_DILATION = 10; // dilate touchArea for radio buttons
  const Y_DILATION = 6; // dilate touchArea for radio buttons

  /**
   * @param {Property.<boolean>} moleculesVisibleProperty are molecules visible in challenges?
   * @param {Property.<boolean>} numbersVisibleProperty are quantities visible in challenges?
   * @param {Object} [options]
   * @constructor
   */
  function VisibilityRadioButtons( moleculesVisibleProperty, numbersVisibleProperty, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 235, 245, 255 )',
      stroke: 'rgb( 180, 180, 180 )',
      lineWidth: 0.5
    }, options );

    /**
     * This bit of code is a little complicated because of a mismatch between model and view.
     * The model has independent properties for the visibility of molecules and numbers.
     * But the view makes them dependent on each other, and this control mixes 'show' and 'hide'.
     * This could be fixed by modeling this dependency, but I prefer to keep the model clean.
     */
    // unlink is unnecessary because this property is owned by this node
    const showAllProperty = new BooleanProperty( moleculesVisibleProperty.get() && numbersVisibleProperty.get() );
    showAllProperty.link( function( value ) {
      if ( value ) {
        moleculesVisibleProperty.set( true );
        numbersVisibleProperty.set( true );
      }
    } );

    // unlink is unnecessary because this node exists for the lifetime of the simulation
    moleculesVisibleProperty.link( function( visible ) {
      if ( !visible ) {
        numbersVisibleProperty.set( true ); // if molecules are hidden, then numbers must be shown
        showAllProperty.set( false );
      }
      else {
        showAllProperty.set( visible && numbersVisibleProperty.get() );
      }
    } );

    // unlink is unnecessary because this node exists for the lifetime of the simulation
    numbersVisibleProperty.link( function( visible ) {
      if ( !visible ) {
        moleculesVisibleProperty.set( true ); // if numbers are hidden, then molecules must be shown
        showAllProperty.set( false );
      }
      else {
        showAllProperty.set( visible && moleculesVisibleProperty.get() );
      }
    } );

    // radio buttons
    const showAllRadioButton = new AquaRadioButton( showAllProperty, true, createShowAllNode(), RADIO_BUTTON_OPTIONS );
    const hideMoleculesButton = new AquaRadioButton( moleculesVisibleProperty, false, createHideMoleculesNode(), RADIO_BUTTON_OPTIONS );
    const hideNumbersButton = new AquaRadioButton( numbersVisibleProperty, false, createHideNumbersNode(), RADIO_BUTTON_OPTIONS );

    // expand touchArea
    showAllRadioButton.touchArea = showAllRadioButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    hideMoleculesButton.touchArea = hideMoleculesButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    hideNumbersButton.touchArea = hideNumbersButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );

    // vertical layout
    const content = new LayoutBox( {
      children: [ showAllRadioButton, hideMoleculesButton, hideNumbersButton ],
      orientation: 'vertical',
      align: 'left',
      spacing: 15
    } );

    Panel.call( this, content, options );
  }

  reactantsProductsAndLeftovers.register( 'VisibilityRadioButtons', VisibilityRadioButtons );

  /**
   * Creates the content for the 'Show All' radio button, an open eye with text to the right of it.
   * @returns {Node}
   */
  var createShowAllNode = function() {
    const eyeNode = new FontAwesomeNode( 'eye_open', FONT_AWESOME_OPTIONS );
    const textNode = new Text( showAllString, TEXT_OPTIONS );
    return new LayoutBox( {
      children: [ eyeNode, textNode ],
      orientation: 'horizontal',
      spacing: 12
    } );
  };

  /**
   * Creates the content for the 'Hide Molecules' radio button,
   * a closed eye with '123' at lower right, and text to the right.
   * @returns {Node}
   */
  var createHideMoleculesNode = function() {
    const eyeNode = new FontAwesomeNode( 'eye_close', FONT_AWESOME_OPTIONS );
    const moleculeNode = new Node( {
      // wrap in a Node because H2ONode doesn't work with standard options
      children: [ new H2ONode( RPALConstants.MOLECULE_OPTIONS ) ],
      scale: 0.4,
      centerX: eyeNode.right,
      centerY: eyeNode.bottom
    } );
    const textNode = new Text( hideMoleculesString, TEXT_OPTIONS );
    return new LayoutBox( {
      children: [ new Node( { children: [ eyeNode, moleculeNode ] } ), textNode ],
      orientation: 'horizontal',
      spacing: 7
    } );
  };

  /**
   * Creates the content for the 'Hide Numbers' radio button,
   * a closed eye with H2O molecule at lower right, and text to the right.
   * @returns {Node}
   */
  var createHideNumbersNode = function() {
    const eyeNode = new FontAwesomeNode( 'eye_close', FONT_AWESOME_OPTIONS );
    const numbersNode = new Text( '123', {
      font: new RPALFont( 8 ),
      centerX: eyeNode.right + 2,
      centerY: eyeNode.bottom
    } );
    const textNode = new Text( hideNumbersString, TEXT_OPTIONS );
    return new LayoutBox( {
      children: [ new Node( { children: [ eyeNode, numbersNode ] } ), textNode ],
      orientation: 'horizontal',
      spacing: 5
    } );
  };

  return inherit( Panel, VisibilityRadioButtons );
} );
