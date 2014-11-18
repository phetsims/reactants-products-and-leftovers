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
  var HBracketNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HBracketNode' );
  var HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/HideBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberNode' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var StacksAccordionBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/StacksAccordionBox' );
  var SubstanceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/SubstanceNode' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var leftoversString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/leftovers' );
  var productsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/products' );
  var reactantsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants' );

  // constants
  var QUANTITY_FONT = new RPALFont( 28 ); // font for the quantities that appear below the boxes
  var SYMBOL_FONT = new RPALFont( 16 ); // font for the symbols that appear below the boxes
  var BOX_QUANTITY_Y_SPACING = 6; // vertical space between box and quantity
  var QUANTITY_IMAGE_Y_SPACING = 6; // vertical space between quantity and image
  var IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
  var BRACKET_LABEL_OPTIONS = { font: new RPALFont( 12 ), fill: 'black' };
  var BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
  var BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it
  var MAX_BRACKET_LABEL_WIDTH = 140; // maximum width of bracket labels, determined by eye

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

    // explicitly hoist vars that are reused
    var numberOfItems, reactants, products, reactant, product, i,
      xMargin, centerX, deltaX, spinnerNode, numberNode, imageNode, symbolNode;

    //------------------------------------------------------------------------------------
    // Equation
    //------------------------------------------------------------------------------------

    // equation
    var equationNode = new MoleculesEquationNode( reaction, {
      fill: 'black',
      top: challengeBounds.top + 15,
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

    //TODO this section is similar to BeforeAfterNode
    //TODO StacksAccordionBox shouldn't be involved here

    // items in the 'Before Reaction' box, including their horizontal positions
    var beforeItems = [];
    numberOfItems = reaction.reactants.length;
    xMargin = ( numberOfItems > 2 ) ? 0 : ( 0.15 * options.boxSize.width ); // make 2-items case look nice
    deltaX = ( options.boxSize.width - ( 2 * xMargin ) ) / numberOfItems;
    centerX = xMargin + ( deltaX / 2 );
    reactants = ( challengeType === ChallengeType.BEFORE ) ? guess.reactants : reaction.reactants;
    reactants.forEach( function( reactant ) {
      beforeItems.push( StacksAccordionBox.item( reactant.nodeProperty, reactant.quantityProperty, centerX ) );
      centerX += deltaX;
    } );

    // items in the 'After Reaction' box, including their horizontal positions
    var afterItems = [];
    numberOfItems = reaction.products.length + reaction.reactants.length;
    xMargin = ( numberOfItems > 2 ) ? 0 : ( 0.15 * options.boxSize.width ); // make 2-items case look nice
    deltaX = ( options.boxSize.width - ( 2 * xMargin ) ) / numberOfItems;
    centerX = xMargin + ( deltaX / 2 );
    products = ( challengeType === ChallengeType.AFTER ) ? guess.products : reaction.products;
    reactants = ( challengeType === ChallengeType.AFTER ) ? guess.reactants : reaction.reactants;
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

    //TODO use GridBox
    // 'Before Reaction' box, with stacks of reactants
    thisNode.beforeBox = new StacksAccordionBox( beforeItems, {
      contentSize: options.boxSize,
      expandedProperty: new Property( true ),
      right: arrowNode.left - 5,
      top: equationNode.bottom + 15
    } );
    thisNode.addChild( thisNode.beforeBox );
    arrowNode.centerY = thisNode.beforeBox.centerY;

    //TODO use GridBox
    // 'After Reaction' box, with stacks of products and leftovers
    thisNode.afterBox = new StacksAccordionBox( afterItems, {
      contentSize: options.boxSize,
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
    buttons.bottom = thisNode.beforeBox.bottom - 10;

    //------------------------------------------------------------------------------------
    // Quantities, images and symbols below the boxes
    //------------------------------------------------------------------------------------

    //TODO this section is similar to BeforeAfterNode

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    thisNode.spinnerNodes = []; // @private see dispose
    thisNode.numberNodes = []; // @private see dispose
    thisNode.imageNodes = []; // @private see dispose
    var symbolNodes = [];

    // reactants, below the 'Before' box
    var reactantsParent = new Node();
    thisNode.addChild( reactantsParent );
    for ( i = 0; i < reaction.reactants.length; i++ ) {

      reactant = ( challengeType === ChallengeType.BEFORE ) ? guess.reactants[i] : reaction.reactants[i];
      centerX = thisNode.beforeBox.left + beforeItems[i].centerX;

      // non-editable number
      numberNode = new NumberNode( reactant.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      reactantsParent.addChild( numberNode );
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( challengeType === ChallengeType.BEFORE ) {
        spinnerNode = new NumberSpinner( reactant.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        reactantsParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // image
      imageNode = new SubstanceNode( reactant, { centerX: centerX } );
      reactantsParent.addChild( imageNode );
      thisNode.imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // products, below the 'After' box
    var productsParent = new Node();
    thisNode.addChild( productsParent );
    for ( i = 0; i < reaction.products.length; i++ ) {

      product = ( challengeType === ChallengeType.AFTER ) ? guess.products[i] : reaction.products[i];
      centerX = thisNode.afterBox.left + afterItems[i].centerX;

      // non-editable number
      numberNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
      productsParent.addChild( numberNode );
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( challengeType === ChallengeType.AFTER ) {
        spinnerNode = new NumberSpinner( product.quantityProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        productsParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // image
      imageNode = new SubstanceNode( product, { centerX: centerX } );
      productsParent.addChild( imageNode );
      thisNode.imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( product.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    // leftovers, below the 'After' box, to the right of the products
    var leftoversParent = new Node();
    thisNode.addChild( leftoversParent );
    for ( i = 0; i < reaction.reactants.length; i++ ) {

      reactant = ( challengeType === ChallengeType.AFTER ) ? guess.reactants[i] : reaction.reactants[i];
      centerX = thisNode.afterBox.left + afterItems[ i + reaction.products.length ].centerX;

      // non-editable number
      numberNode = new NumberNode( reactant.leftoversProperty, { font: QUANTITY_FONT, centerX: centerX } );
      leftoversParent.addChild( numberNode );
      thisNode.numberNodes.push( numberNode );

      // spinner
      if ( challengeType === ChallengeType.AFTER ) {
        spinnerNode = new NumberSpinner( reactant.leftoversProperty, options.quantityRange,
          { font: QUANTITY_FONT, centerX: centerX } );
        leftoversParent.addChild( spinnerNode );
        thisNode.spinnerNodes.push( spinnerNode );
      }

      // image
      imageNode = new SubstanceNode( reactant, { centerX: centerX } );
      leftoversParent.addChild( imageNode );
      thisNode.imageNodes.push( imageNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }

      centerX += deltaX;
    }

    //TODO this section is identical to BeforeAfterNode

    // vertical layout of components below the boxes
    var spinnerHeight = thisNode.spinnerNodes[0].height;
    var maxImageHeight = Math.max(
      options.maxImageSize.height,
      _.max( thisNode.imageNodes, function( node ) { return node.height; } ).height );
    var maxSymbolHeight = _.max( symbolNodes, function( node ) { return node.height; } ).height;
    var componentsTop = thisNode.beforeBox.bottom + BOX_QUANTITY_Y_SPACING;

    thisNode.spinnerNodes.forEach( function( spinnerNode ) {
      spinnerNode.centerY = componentsTop + ( spinnerHeight / 2 );
    } );
    thisNode.numberNodes.forEach( function( numberNode ) {
      numberNode.centerY = componentsTop + ( spinnerHeight / 2 );
    } );
    thisNode.imageNodes.forEach( function( imageNode ) {
      imageNode.centerY = componentsTop + spinnerHeight + QUANTITY_IMAGE_Y_SPACING + ( maxImageHeight / 2 );
    } );
    if ( options.showSymbols ) {
      symbolNodes.forEach( function( symbolNode ) {
        symbolNode.top = componentsTop + spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxImageHeight + IMAGE_SYMBOL_Y_SPACING;
      });
    }

    var componentsBottom = componentsTop + spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxImageHeight;
    if ( options.showSymbols ) {
      componentsBottom += ( maxSymbolHeight + IMAGE_SYMBOL_Y_SPACING );
    }

    //------------------------------------------------------------------------------------
    // Brackets
    //------------------------------------------------------------------------------------

    //TODO this section is identical to BeforeAfterNode

    var bracketOptions = {
      bracketColor: RPALColors.PANEL_FILL,
      top: componentsBottom + BRACKET_Y_SPACING
    };

    // reactants bracket
    var reactantsLabel = new Text( reactantsString, BRACKET_LABEL_OPTIONS );
    reactantsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / reactantsLabel.width ) ); // i18n
    var reactantsBracket = new HBracketNode( _.extend( {
      labelNode: reactantsLabel,
      bracketWidth: Math.max( options.maxImageSize.width, reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: reactantsParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( reactantsBracket );

    // products bracket
    var productsLabel = new Text( productsString, BRACKET_LABEL_OPTIONS );
    productsLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / productsLabel.width ) ); // i18n
    var productsBracket = new HBracketNode( _.extend( {
      labelNode: productsLabel,
      bracketWidth: Math.max( options.maxImageSize.width, productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: productsParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( productsBracket );

    // leftovers bracket
    var leftoversLabel = new Text( leftoversString, BRACKET_LABEL_OPTIONS );
    leftoversLabel.setScaleMagnitude( Math.min( 1, MAX_BRACKET_LABEL_WIDTH / leftoversLabel.width ) ); // i18n
    var leftoversBracket = new HBracketNode( _.extend( {
      labelNode: leftoversLabel,
      bracketWidth: Math.max( options.maxImageSize.width, leftoversParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: leftoversParent.centerX
    }, bracketOptions ) );
    thisNode.addChild( leftoversBracket );

    //------------------------------------------------------------------------------------
    // Optional 'hide' boxes on top of molecules and numbers
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

    var hideNumbersBox = null;
    if ( !model.numbersVisible ) {
      hideNumbersBox = new HideBox( {
        boxSize: new Dimension2( options.boxSize.width, spinnerHeight ),
        iconHeight: 0.65 * spinnerHeight,
        cornerRadius: 3,
        left: ( challengeType === ChallengeType.BEFORE ) ? thisNode.afterBox.left : thisNode.beforeBox.left,
        centerY: thisNode.spinnerNodes[0].centerY
      } );
      thisNode.addChild( hideNumbersBox );
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
      if ( hideNumbersBox ) { hideNumbersBox.visible = hideBoxVisible; }

      // switch between spinners and static numbers
      var spinnersVisible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK  );
      thisNode.spinnerNodes.forEach( function( spinnerNode ) { spinnerNode.visible = spinnersVisible; } );
      if ( challengeType === ChallengeType.BEFORE ) {
        for ( i = 0; i < reaction.reactants.length; i++ ) {
          thisNode.numberNodes[i].visible = !spinnersVisible;
        }
      }
      else {
        for ( i = reaction.reactants.length; i < thisNode.numberNodes.length; i++ ) {
          thisNode.numberNodes[i].visible = !spinnersVisible;
        }
      }

      // reveal the correct answer
      if ( state === PlayState.NEXT ) { challenge.showAnswer(); }
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, ChallengeNode, {

    dispose: function() {

      // boxes
      this.beforeBox.dispose();
      this.afterBox.dispose();

      this.guessIsValidProperty.detach();

      // stuff below the boxes
      this.spinnerNodes.forEach( function( node ) { node.dispose(); } );
      this.numberNodes.forEach( function( node ) { node.dispose(); } );
      this.imageNodes.forEach( function( node ) { node.dispose(); } );
    }
  } );
} );
