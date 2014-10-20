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
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var showAllString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/showAll' );
  var hideMoleculesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/hideMolecules' );
  var hideNumbersString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/hideNumbers' );

  // constants
  var TEXT_OPTIONS = { font: new RPALFont( 14 ) };
  var RADIO_BUTTON_OPTIONS = { radius: 12 };

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
    var showAllRadioButton = new AquaRadioButton( showAllProperty, true, new Text( showAllString, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
    var hideMoleculesButton = new AquaRadioButton( moleculesVisibleProperty, false, new Text( hideMoleculesString, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
    var hideNumbersButton = new AquaRadioButton( numbersVisibleProperty, false, new Text( hideNumbersString, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );

    // vertical layout
    var content = new LayoutBox( {
      children: [ showAllRadioButton, hideMoleculesButton, hideNumbersButton ],
      orientation: 'vertical',
      align: 'left',
      spacing: 10
    } );

    Panel.call( this, content, options );
  }

  return inherit( Panel, VisibilityControl );
} );
