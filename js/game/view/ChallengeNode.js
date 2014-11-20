// Copyright 2002-2014, University of Colorado Boulder

/**
 * View of a Game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BoxItem = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/BoxItem' );
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameButtons' );
  var RandomBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/RandomBox' );
  var HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/HideBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var QuantitiesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/QuantitiesNode' );
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

    // convenience variables, to improve readability
    var reaction = challenge.reaction;
    var guess = challenge.guess;
    assert && assert( reaction.reactants.length === guess.reactants.length );
    assert && assert( reaction.products.length === guess.products.length );
    var challengeType = challenge.challengeType;
    assert && assert( challengeType === ChallengeType.BEFORE || challengeType === ChallengeType.AFTER );

    options = _.extend( {
      boxSize: new Dimension2( 310, 240 ), // size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // range of the quantity values
      maxImageSize: new Dimension2( 0, 0 ) // our best guess at the maximum image size
    }, options );

    var thisNode = this;
    Node.call( thisNode );

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
    // Items
    //------------------------------------------------------------------------------------

    // items in the 'Before Reaction' box
    var beforeItems = BoxItem.createBeforeBoxItems(
      ( challengeType === ChallengeType.BEFORE ) ? guess.reactants : reaction.reactants, options.boxSize.width );

    // items in the 'After Reaction' box
    var afterItems = BoxItem.createAfterBoxItems(
      ( challengeType === ChallengeType.AFTER ) ? guess.products : reaction.products,
      ( challengeType === ChallengeType.AFTER ) ? guess.reactants : reaction.reactants,
      options.boxSize.width );

    //------------------------------------------------------------------------------------
    // Property that tells us whether the user has made a valid guess.
    //------------------------------------------------------------------------------------

    // dependencies is the set of quantities that the user can guess
    var dependencies = [];
    if ( challenge.challengeType === ChallengeType.BEFORE ) {
      guess.reactants.forEach( function( reactant ) { dependencies.push( reactant.quantityProperty ); } );
    }
    else {
      guess.products.forEach( function( product ) { dependencies.push( product.quantityProperty ); } );
      guess.reactants.forEach( function( reactant ) { dependencies.push( reactant.leftoversProperty ); } );
    }
    // @private
    thisNode.guessIsValidProperty = new DerivedProperty( dependencies, function() {
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
    thisNode.beforeBox = new RandomBox( beforeItems, options.quantityRange.max, {
      boxSize: options.boxSize,
      right: arrowNode.left - 5,
      top: equationNode.bottom + 18
    } );
    thisNode.addChild( thisNode.beforeBox );
    arrowNode.centerY = thisNode.beforeBox.centerY;

    // 'After Reaction' box, with molecules at random locations
    thisNode.afterBox = new RandomBox( afterItems, options.quantityRange.max, {
      boxSize: options.boxSize,
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
    faceNode.centerX = ( challengeType === ChallengeType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    // centerY is handled below

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    var questionMark = new Text( '?', {
      font: new RPALFont( { size: 150, weight: 'bold' } )
    } );
    thisNode.addChild( questionMark );
    questionMark.centerX = ( challengeType === ChallengeType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    // centerY is handled below

    // visible only until the user has entered a valid guess
    var guessIsValidObserver = function( guessIsValid ) {
      questionMark.visible = !guessIsValid;
      if ( guessIsValid ) { thisNode.guessIsValidProperty.unlink( guessIsValidObserver ); }
    };
    thisNode.guessIsValidProperty.link( guessIsValidObserver );

    //------------------------------------------------------------------------------------
    // Buttons (Check, Try Again, ...)
    //------------------------------------------------------------------------------------

    // buttons (Check, Try Again, ...)
    var buttons = new GameButtons( model, challenge, audioPlayer, faceNode, thisNode.guessIsValidProperty );
    thisNode.addChild( buttons );
    buttons.centerX = ( challengeType === ChallengeType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    buttons.bottom = thisNode.beforeBox.bottom - 15;

    // center face and '?' in negative space above buttons
    faceNode.centerY = questionMark.centerY = thisNode.beforeBox.top + ( buttons.top - thisNode.beforeBox.top ) / 2;

    //------------------------------------------------------------------------------------
    // Quantities, images, symbols and brackets below the boxes
    //------------------------------------------------------------------------------------

    var reactants = ( challengeType === ChallengeType.BEFORE ) ? guess.reactants : reaction.reactants;
    var products = ( challengeType === ChallengeType.AFTER ) ? guess.products : reaction.products;
    var leftovers = ( challengeType === ChallengeType.AFTER ) ? guess.reactants : reaction.reactants;
    thisNode.quantitiesNode = new QuantitiesNode(
      reactants, products, leftovers, beforeItems, afterItems, challengeType,
      {
        boxWidth: options.boxSize.width,
        beforeBoxLeft: thisNode.beforeBox.left,
        afterBoxLeft: thisNode.afterBox.left,
        maxImageSize: options.maxImageSize,
        quantityRange: options.quantityRange,
        hideNumbersBox: !model.numbersVisible,
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
        left: ( challengeType === ChallengeType.BEFORE ) ? thisNode.afterBox.left : thisNode.beforeBox.left,
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
      this.guessIsValidProperty.detach();

      // stuff below the boxes
      this.quantitiesNode.dispose();
    }
  } );
} );
