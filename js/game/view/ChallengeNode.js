// Copyright 2002-2014, University of Colorado Boulder

/**
 * View of a Game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/ChallengeType' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameButtons' );
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var StacksAccordionBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StacksAccordionBox' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var SPINNER_OPTIONS = { font: new RPALFont( 28 ) };

  /**
   * @param {GameModel} model
   * @param {Challenge} challenge
   * @param {Bounds2} challengeBounds portion of the screen where the Challenge can be displayed
   * @param {GameAudioPlayer} audioPlayer
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeNode( model, challenge, challengeBounds, audioPlayer, options ) {

    var challengeType = challenge.challengeType;
    assert && assert( challengeType === ChallengeType.BEFORE || challengeType === ChallengeType.AFTER );

    options = _.extend( {
      contentSize: new Dimension2( 310, 240 ) // size of the 'Before' and 'After' boxes
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // explicitly hoist vars that are reused
    var numberOfItems, reactants, products, reactant, product, i, xMargin, centerX, deltaX, quantityNode, imageNode, symbolNode;

    //------------------------------------------------------------------------------------
    // Equation
    //------------------------------------------------------------------------------------

    // equation
    var equationNode = new MoleculesEquationNode( model.challenge.reaction, {
      fill: 'black',
      centerX: challengeBounds.centerX,
      top: challengeBounds.top + 15
    } );
    thisNode.addChild( equationNode );

    //------------------------------------------------------------------------------------
    // Items
    //------------------------------------------------------------------------------------

    //TODO there's some duplicate code here, factor out?

    // items in the 'Before Reaction' box, including their horizontal positions
    var beforeItems = [];
    numberOfItems = challenge.reaction.reactants.length;
    xMargin = ( numberOfItems > 2 ) ? 0 : ( 0.15 * options.contentSize.width ); // make 2-items case look nice
    deltaX = ( options.contentSize.width - ( 2 * xMargin ) ) / numberOfItems;
    centerX = xMargin + ( deltaX / 2 );
    reactants = ( challengeType === ChallengeType.BEFORE ) ? challenge.guess.reactants : challenge.reaction.reactants;
    reactants.forEach( function( reactant ) {
      beforeItems.push( StacksAccordionBox.item( reactant.nodeProperty, reactant.quantityProperty, centerX ) );
      centerX += deltaX;
    } );

    // items in the 'After Reaction' box, including their horizontal positions
    var afterItems = [];
    numberOfItems = challenge.reaction.products.length + challenge.reaction.reactants.length;
    xMargin = ( numberOfItems > 2 ) ? 0 : ( 0.15 * options.contentSize.width ); // make 2-items case look nice
    deltaX = ( options.contentSize.width - ( 2 * xMargin ) ) / numberOfItems;
    centerX = xMargin + ( deltaX / 2 );
    products = ( challengeType === ChallengeType.AFTER ) ? challenge.guess.products : challenge.reaction.products;
    reactants = ( challengeType === ChallengeType.AFTER ) ? challenge.guess.reactants : challenge.reaction.reactants;
    products.forEach( function( product ) {
      afterItems.push( StacksAccordionBox.item( product.nodeProperty, product.quantityProperty, centerX ) );
      centerX += deltaX;
    } );
    reactants.forEach( function( reactant ) {
      // for 'After', we use display each reactant's leftovers quantity
      afterItems.push( StacksAccordionBox.item( reactant.nodeProperty, reactant.leftoversProperty, centerX ) );
      centerX += deltaX;
    } );

    //------------------------------------------------------------------------------------
    // Property that tells us whether the user has made a valid guess.
    //------------------------------------------------------------------------------------

    // dependencies is the set of quantities that the user can guess
    var dependencies = [];
    if ( challenge.challengeType === ChallengeType.BEFORE ) {
      challenge.guess.reactants.forEach( function( reactant ) { dependencies.push( reactant.quantityProperty ); } );
    }
    else {
      challenge.guess.products.forEach( function( product ) { dependencies.push( product.quantityProperty ); } );
      challenge.guess.reactants.forEach( function( reactant ) { dependencies.push( reactant.leftoversProperty ); } );
    }
    // @private
    thisNode.guessIsValidProperty = new DerivedProperty( dependencies, function() {
      // true if any quantity that the user can guess is non-zero
      for ( var i = 0, j = arguments.length; i < j; i++ ) {
        if ( arguments[i] !== 0 ) {
          return true;
        }
      }
      return false;
    } );

    //------------------------------------------------------------------------------------
    // Boxes & arrow
    //------------------------------------------------------------------------------------

    // Arrow between boxes
    var arrowNode = new RightArrowNode( {
      fill: RPALColors.REACTION_BAR_COLOR,
      stroke: null,
      scale: 0.75,
      centerX: challengeBounds.centerX
    } );
    thisNode.addChild( arrowNode );

    // 'Before Reaction' box, with stacks of reactants
    thisNode.beforeBox = new StacksAccordionBox( beforeItems, {
      contentSize: options.contentSize,
      expandedProperty: new Property( true ),
      right: arrowNode.left - 5,
      top: equationNode.bottom + 15
    } );
    thisNode.addChild( thisNode.beforeBox );
    arrowNode.centerY = thisNode.beforeBox.centerY;

    // 'After Reaction' box, with stacks of products and leftovers
    thisNode.afterBox = new StacksAccordionBox( afterItems, {
      contentSize: options.contentSize,
      expandedProperty: new Property( true ),
      left: arrowNode.right + 5,
      top: thisNode.beforeBox.top
    } );
    thisNode.addChild( thisNode.afterBox );

    //------------------------------------------------------------------------------------
    // Face
    //------------------------------------------------------------------------------------

    var faceNode = new FaceWithPointsNode( {
      faceDiameter: 120,
      faceOpacity: 0.65,
      pointsAlignment: 'rightCenter'
    } );
    thisNode.addChild( faceNode );
    faceNode.center = ( challengeType === ChallengeType.BEFORE ) ? thisNode.beforeBox.center : thisNode.afterBox.center;

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    var questionMark = new Text( '?', {
      font: new RPALFont( { size: 150, weight: 'bold' } )
    } );
    thisNode.addChild( questionMark );
    questionMark.center = ( challengeType === ChallengeType.BEFORE ) ? thisNode.beforeBox.center : thisNode.afterBox.center;

    // visible only until the user has entered a valid guess
    var guessIsValidObserver = function( guessIsValid ) {
      questionMark.visible = !guessIsValid;
      if ( guessIsValid ) { thisNode.guessIsValidProperty.unlink( guessIsValidObserver ) }
    };
    thisNode.guessIsValidProperty.link( guessIsValidObserver );

    //------------------------------------------------------------------------------------
    // Buttons (Check, Try Again, ...)
    //------------------------------------------------------------------------------------

    // buttons (Check, Try Again, ...)
    var buttons = new GameButtons( model, challenge, audioPlayer, faceNode, thisNode.guessIsValidProperty );
    thisNode.addChild( buttons );
    buttons.centerX = ( challengeType === ChallengeType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    buttons.bottom = thisNode.beforeBox.bottom - 10;

    //------------------------------------------------------------------------------------
    // Controls below the boxes
    //------------------------------------------------------------------------------------

    //TODO temporary UI, to get the game working
    {
      var quantityRange = new Range( 0, model.maxQuantity );
      var children = [];
      if ( challenge.challengeType === ChallengeType.BEFORE ) {

        // guess the reactants
        challenge.guess.reactants.forEach( function( reactant ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new NumberSpinner( reactant.quantityProperty, quantityRange, SPINNER_OPTIONS ),
              new SubSupText( reactant.symbol )
            ] } ) );
        } );

        // space
        children.push( new HStrut( 40 ) );

        // show the products & leftovers
        challenge.reaction.products.forEach( function( product ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new NumberNode( product.quantityProperty, SPINNER_OPTIONS ),
              new SubSupText( product.symbol )
            ] } ) );
        } );
        challenge.reaction.reactants.forEach( function( reactant ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new NumberNode( reactant.leftoversProperty, SPINNER_OPTIONS ),
              new SubSupText( reactant.symbol )
            ] } ) );
        } );
      }
      else {

        // show the reactants
        challenge.reaction.reactants.forEach( function( reactant ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new NumberNode( reactant.quantityProperty, SPINNER_OPTIONS ),
              new SubSupText( reactant.symbol )
            ] } ) );
        } );

        // space
        children.push( new HStrut( 40 ) );

        // guess the products and leftovers
        challenge.guess.products.forEach( function( product ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new NumberSpinner( product.quantityProperty, quantityRange, SPINNER_OPTIONS ),
              new SubSupText( product.symbol )
            ] } ) );
        } );
        challenge.guess.reactants.forEach( function( reactant ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new NumberSpinner( reactant.leftoversProperty, quantityRange, SPINNER_OPTIONS ),
              new SubSupText( reactant.symbol )
            ] } ) );
        } );
      }
      thisNode.addChild( new LayoutBox( {
        children: children,
        orientation: 'horizontal',
        spacing: 50,
        centerX: challengeBounds.centerX,
        top: thisNode.beforeBox.bottom + 20
      } ) );
    }

    //------------------------------------------------------------------------------------
    // Observers
    //------------------------------------------------------------------------------------

    // play-state changes
    model.playStateProperty.link( function( state ) {

      // visibility of face
      faceNode.visible = ( state === PlayState.TRY_AGAIN ||
                           state === PlayState.SHOW_ANSWER ||
                           ( state === PlayState.NEXT && challenge.isCorrect() ) );

      //TODO if ( state === PlayState.NEXT ) { show answer }
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, ChallengeNode, {

    dispose: function() {

      // boxes
      this.beforeBox.dispose();
      this.afterBox.dispose();

      this.guessIsValidProperty.detach();

      // quantity spinners and displays
//      this.quantityNodes.forEach( function( node ) { node.dispose(); } ); //TODO

      // substance images
//      this.imageNodes.forEach( function( node ) { node.dispose(); } ); //TODO
    }
  } );
} );
