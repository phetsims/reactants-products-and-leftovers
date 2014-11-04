// Copyright 2002-2014, University of Colorado Boulder

/**
 * Spinner for numbers, similar in 'look' to Java's JSpinner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} numberProperty value, must be an integer
   * @param {DOT.Range} range range of values, min and max must be integers
   * @param {Object} [options]
   * @constructor
   */
  function NumberSpinner( numberProperty, range, options ) {

    assert && assert( range.contains( numberProperty.get() ) ); // value is in range

    options = _.extend( {
      decimalPlaces: 0,
      font: new RPALFont( 28 ),
      xMargin: 5,
      yMargin: 3,
      ySpacing: 5,
      cornerRadius: 5,
      touchXDilated: 20,
      touchYDilated: 10
    }, options );

    this.numberProperty = numberProperty; // @private

    var valueOptions = {
      font: options.font,
      fill: 'black'
    };

    // compute max width
    var maxWidth = Math.max(
      new Text( Util.toFixed( range.max, options.decimalPlaces ), valueOptions ).width,
      new Text( Util.toFixed( range.min, options.decimalPlaces ), valueOptions ).width
    );

    // value
    var valueNode = new Text( numberProperty.get(), valueOptions );
    var backgroundNode = new Rectangle( 0, 0, maxWidth + ( 2 * options.xMargin ), valueNode.height + ( 2 * options.yMargin ),
      options.cornerRadius, options.cornerRadius, {
        fill: 'white',
        stroke: 'black',
        lineWidth: 0.5
      } );
    var valueParent = new Node( { children: [ backgroundNode, valueNode ] } );

    // buttons
    var upButton = new ArrowButton( 'up', function() { numberProperty.set( numberProperty.get() + 1 ); } );
    var downButton = new ArrowButton( 'down', function() { numberProperty.set( numberProperty.get() - 1 ); } );
    var buttonsParent = new LayoutBox( {
      children: [ upButton, downButton ],
      orientation: 'vertical',
      spacing: options.ySpacing
    } );
    buttonsParent.setScaleMagnitude( backgroundNode.height / buttonsParent.height );
    upButton.touchArea = upButton.localBounds.dilatedXY( options.touchXDilated, options.touchYDilated ).shiftedY( -options.touchYDilated );
    downButton.touchArea = downButton.localBounds.dilatedXY( options.touchXDilated, options.touchYDilated ).shiftedY( options.touchYDilated );

    // buttons to right of value
    options.children = [ valueParent, buttonsParent ];
    options.spacing = options.ySpacing;
    options.orientation = 'horizontal';
    LayoutBox.call( this, options );

    // @private When the value changes ...
    this.numberPropertyObserver = function( value ) {
      assert && assert( range.contains( value ) );

      // update the text and center it
      valueNode.text = Util.toFixed( value, options.decimalPlaces );
      valueNode.center = backgroundNode.center;

      // enable/disable arrow buttons
      upButton.enabled = ( value < range.max );
      downButton.enabled = ( value > range.min );
    };
    numberProperty.link( this.numberPropertyObserver );
  }

  return inherit( LayoutBox, NumberSpinner, {

    // Unlinks from the property. The spinner is no longer functional after calling this function.
    dispose: function() {
      this.numberProperty.unlink( this.numberPropertyObserver );
    }
  } );
} );
