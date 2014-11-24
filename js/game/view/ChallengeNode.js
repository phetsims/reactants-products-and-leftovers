// Copyright 2002-2014, University of Colorado Boulder

/**
 * View of a Game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameButtons' );
  var HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HideBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var QuantitiesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/QuantitiesNode' );
  var RandomBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/RandomBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var BOX_QUANTITY_Y_SPACING = 6; // vertical space between box and quantity

  /**
   * @param {GameModel} model
   * @param {Challenge} challenge
   * @param {Bounds2} challengeBounds portion of the screen where the Challenge can be displayed
   * @param {GameAudioPlayer} audioPlayer
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeNode( model, challenge, challengeBounds, audioPlayer, options ) {

    options = _.extend( {
      boxSize: RPALConstants.BEFORE_AFTER_BOX_SIZE, // {Dimension2} size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of the quantity values
      minIconSize: new Dimension2( 0, 0 ) // {Dimension2} minimum amount of layout space reserved for Substance icons
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // convenience variables, to improve readability
    var reaction = challenge.reaction;
    var guess = challenge.guess;
    assert && assert( reaction.reactants.length === guess.reactants.length );
    assert && assert( reaction.products.length === guess.products.length );
    assert && assert( reaction.leftovers.length === guess.leftovers.length );
    var interactiveBox = challenge.interactiveBox;
    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    // which substances are visible depends on whether we're guessing 'Before' or 'After' quantities
    var reactants = ( interactiveBox === BoxType.BEFORE ) ? guess.reactants : reaction.reactants;
    var products = ( interactiveBox === BoxType.AFTER ) ? guess.products : reaction.products;
    var leftovers = ( interactiveBox === BoxType.AFTER ) ? guess.leftovers : reaction.leftovers;

    //------------------------------------------------------------------------------------
    // Equation
    //------------------------------------------------------------------------------------

    // equation
    var equationNode = new MoleculesEquationNode( reaction, {
      fill: 'black',
      top: challengeBounds.top + 18,
      plusXSpacing: 25,
      arrowXSpacing: 25
    } );
    equationNode.left = challengeBounds.centerX - equationNode.arrowCenterX; // arrow at center of bounds

    // equations background
    var equationBackground = new Rectangle( 0, 0, equationNode.width + 30, equationNode.height + 6, 3, 3, {
      fill: 'white',
      stroke: RPALColors.BOX_STROKE,
      center: equationNode.center
    } );

    thisNode.addChild( equationBackground );
    thisNode.addChild( equationNode );

    //------------------------------------------------------------------------------------
    // Property that tells us whether the 'Check' button should be enabled
    //------------------------------------------------------------------------------------

    // Check button is disabled if all guessable quantities are zero
    var quantityProperties = [];
    if ( challenge.interactiveBox === BoxType.BEFORE ) {
      guess.reactants.forEach( function( reactant ) { quantityProperties.push( reactant.quantityProperty ); } );
    }
    else {
      guess.products.forEach( function( product ) { quantityProperties.push( product.quantityProperty ); } );
      guess.leftovers.forEach( function( leftover ) { quantityProperties.push( leftover.quantityProperty ); } );
    }
    // @private
    thisNode.checkButtonEnabledProperty = new DerivedProperty( quantityProperties, function() {
      // true if any quantity that the user can guess is non-zero
      for ( var i = 0, j = arguments.length; i < j; i++ ) {
        if ( arguments[i] !== 0 ) { return true; }
      }
      return false;
    } );

    //------------------------------------------------------------------------------------
    // Boxes & arrow
    //------------------------------------------------------------------------------------

    // Arrow between boxes
    var arrowNode = new RightArrowNode( {
      fill: RPALColors.PANEL_FILL,
      stroke: null,
      scale: 0.75,
      centerX: challengeBounds.centerX
    } );
    thisNode.addChild( arrowNode );

    // 'Before Reaction' box, with molecules at random locations
    thisNode.beforeBox = new RandomBox( reactants, {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      right: arrowNode.left - 5,
      top: equationNode.bottom + 18
    } );
    thisNode.addChild( thisNode.beforeBox );
    arrowNode.centerY = thisNode.beforeBox.centerY;

    // 'After Reaction' box, with molecules at random locations
    thisNode.afterBox = new RandomBox( products.concat( leftovers ), {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      left: arrowNode.right + 5,
      top: thisNode.beforeBox.top
    } );
    thisNode.addChild( thisNode.afterBox );

    //------------------------------------------------------------------------------------
    // Face
    //------------------------------------------------------------------------------------

    var faceNode = new FaceWithPointsNode( {
      faceDiameter: 150,
      faceOpacity: 0.65,
      pointsAlignment: 'rightCenter',
      pointsFill: 'yellow',
      pointsStroke: 'rgb(50,50,50)',
      pointsOpacity: 0.65
    } );
    thisNode.addChild( faceNode );
    faceNode.centerX = ( interactiveBox === BoxType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    // centerY is handled below

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    var questionMark = new Text( '?', {
      font: new RPALFont( { size: 150, weight: 'bold' } )
    } );
    thisNode.addChild( questionMark );
    questionMark.centerX = ( interactiveBox === BoxType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    // centerY is handled below

    // visible only until the user has entered a valid guess
    var checkButtonEnabledObserver = function( guessIsValid ) {
      questionMark.visible = !guessIsValid;
      if ( guessIsValid ) { thisNode.checkButtonEnabledProperty.unlink( checkButtonEnabledObserver ); }
    };
    thisNode.checkButtonEnabledProperty.link( checkButtonEnabledObserver );

    //------------------------------------------------------------------------------------
    // Buttons (Check, Try Again, ...)
    //------------------------------------------------------------------------------------

    // buttons (Check, Try Again, ...)
    var buttons = new GameButtons( model, audioPlayer, faceNode, thisNode.checkButtonEnabledProperty );
    thisNode.addChild( buttons );
    buttons.centerX = ( interactiveBox === BoxType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    buttons.bottom = thisNode.beforeBox.bottom - 15;

    // center face and '?' in negative space above buttons
    faceNode.centerY = questionMark.centerY = thisNode.beforeBox.top + ( buttons.top - thisNode.beforeBox.top ) / 2;

    //------------------------------------------------------------------------------------
    // Quantities, images, symbols and brackets below the boxes
    //------------------------------------------------------------------------------------

    // x-offsets of substances relative to their boxes
    var beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.boxSize.width );
    var afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.boxSize.width );

    thisNode.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      interactiveBox: interactiveBox,
      boxWidth: options.boxSize.width,
      afterBoxXOffset: thisNode.afterBox.left - thisNode.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      hideNumbersBox: !model.numbersVisible,
      x: thisNode.beforeBox.x,
      top: thisNode.beforeBox.bottom + BOX_QUANTITY_Y_SPACING
    } );
    thisNode.addChild( thisNode.quantitiesNode );

    //------------------------------------------------------------------------------------
    // Optional 'Hide molecules' box on top of Before or After box
    //------------------------------------------------------------------------------------

    var hideMoleculesBox = null;
    if ( !model.moleculesVisible ) {
      hideMoleculesBox = new HideBox( {
        boxSize: options.boxSize,
        iconHeight: 0.4 * options.boxSize.height,
        cornerRadius: 3,
        left: ( interactiveBox === BoxType.BEFORE ) ? thisNode.afterBox.left : thisNode.beforeBox.left,
        bottom: thisNode.beforeBox.bottom
      } );
      thisNode.addChild( hideMoleculesBox );
    }

    //------------------------------------------------------------------------------------
    // Observers
    //------------------------------------------------------------------------------------

    // {PlayState} state changes
    model.playStateProperty.link( function( state ) {

      // visibility of face
      faceNode.visible = ( state === PlayState.TRY_AGAIN ||
                           state === PlayState.SHOW_ANSWER ||
                           ( state === PlayState.NEXT && challenge.isCorrect() ) );

      // 'hide' boxes
      var hideBoxVisible = ( state !== PlayState.NEXT );
      if ( hideMoleculesBox ) { hideMoleculesBox.visible = hideBoxVisible; }
      thisNode.quantitiesNode.setHideNumbersBoxVisible( hideBoxVisible );

      // switch between spinners and static numbers
      thisNode.quantitiesNode.setInteractive( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK );

      // reveal the correct answer
      if ( state === PlayState.NEXT ) { challenge.showAnswer(); }
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, ChallengeNode, {

    // Ensures that this node is eligible for GC.
    dispose: function() {

      // boxes
      this.beforeBox.dispose();
      this.afterBox.dispose();

      // derived property, unlink dependencies
      this.checkButtonEnabledProperty.detach();

      // stuff below the boxes
      this.quantitiesNode.dispose();
    }
  } );
} );
