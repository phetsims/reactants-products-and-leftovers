// Copyright 2002-2014, University of Colorado Boulder

/**
 * View of a Game challenge. This node is not 'active' (connected to the model) until the activate() function is called.
 * This supports the ability to preload a node, then activate it at some later time.  See issue #17.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DevStringUtils = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevStringUtils' );
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
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

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
      boxSize: RPALConstants.GAME_BEFORE_AFTER_BOX_SIZE, // {Dimension2} size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of the quantity values
      minIconSize: new Dimension2( 0, 0 ) // {Dimension2} minimum amount of layout space reserved for Substance icons
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // convenience variables, to improve readability
    var reaction = challenge.reaction;
    var guess = challenge.guess;
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
      top: challengeBounds.top + 10,
      plusXSpacing: 25,
      arrowXSpacing: 25
    } );
    equationNode.left = challengeBounds.centerX - equationNode.arrowCenterX; // arrow at center of bounds

    // equations background
    var equationBackground = new Rectangle( 0, 0, equationNode.width + 30, equationNode.height + 6, 3, 3, {
      fill: 'white',
      stroke: 'black',
      center: equationNode.center
    } );

    thisNode.addChild( equationBackground );
    thisNode.addChild( equationNode );

    //------------------------------------------------------------------------------------
    // Property that tells us whether the 'Check' button should be enabled
    //------------------------------------------------------------------------------------

    // Check button is disabled if all guessable quantities are zero
    var quantityProperties = [];
    if ( interactiveBox === BoxType.BEFORE ) {
      guess.reactants.forEach( function( reactant ) { quantityProperties.push( reactant.quantityProperty ); } );
    }
    else {
      guess.products.forEach( function( product ) { quantityProperties.push( product.quantityProperty ); } );
      guess.leftovers.forEach( function( leftover ) { quantityProperties.push( leftover.quantityProperty ); } );
    }
    // @private must be detached in dispose
    thisNode.checkButtonEnabledProperty = new DerivedProperty( quantityProperties, function() {
      // true if any quantity that the user can guess is non-zero
      for ( var i = 0, j = arguments.length; i < j; i++ ) {
        if ( arguments[ i ] !== 0 ) { return true; }
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
      // y position handled below
    } );
    thisNode.addChild( arrowNode );

    // @private 'Before Reaction' box, with molecules at random locations
    thisNode.beforeBox = new RandomBox( reactants, {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      right: arrowNode.left - 5,
      top:   equationNode.bottom + 10
    } );
    thisNode.addChild( thisNode.beforeBox );
    arrowNode.centerY = thisNode.beforeBox.centerY;

    // @private 'After Reaction' box, with molecules at random locations
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

    var faceNode = null; // created on demand

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    var questionMark = new Text( questionMarkString, {
      font: new RPALFont( { size: 150, weight: 'bold' } ),
      maxWidth: 0.75 * options.boxSize.width // constrain width for i18n
    } );
    thisNode.addChild( questionMark );
    questionMark.centerX = ( interactiveBox === BoxType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    // centerY is handled below

    // visible only until the user has entered a valid guess
    var checkButtonEnabledObserver = function( guessIsValid ) {
      questionMark.visible = !guessIsValid;
      if ( guessIsValid ) { thisNode.checkButtonEnabledProperty.unlink( checkButtonEnabledObserver ); }
    };
    // unlink is unnecessary, since this property belongs to this instance
    thisNode.checkButtonEnabledProperty.link( checkButtonEnabledObserver );

    //------------------------------------------------------------------------------------
    // Buttons (Check, Try Again, ...)
    //------------------------------------------------------------------------------------

    // @private
    thisNode.buttons = new GameButtons( model, thisNode.checkButtonEnabledProperty );
    thisNode.addChild( thisNode.buttons );
    thisNode.buttons.centerX = ( interactiveBox === BoxType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
    thisNode.buttons.bottom = thisNode.beforeBox.bottom - 15;

    // center question mark in negative space above buttons
    questionMark.centerY = thisNode.beforeBox.top + ( this.buttons.top - thisNode.beforeBox.top ) / 2;

    //------------------------------------------------------------------------------------
    // Everything below the boxes
    //------------------------------------------------------------------------------------

    // x-offsets of substances relative to their boxes
    var beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.boxSize.width );
    var afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.boxSize.width );

    // @private
    thisNode.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      interactiveBox: interactiveBox,
      boxWidth: options.boxSize.width,
      afterBoxXOffset: thisNode.afterBox.left - thisNode.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      hideNumbersBox: !challenge.numbersVisible,
      x: thisNode.beforeBox.x,
      top:             thisNode.beforeBox.bottom + 4
    } );
    thisNode.addChild( thisNode.quantitiesNode );

    //------------------------------------------------------------------------------------
    // Optional 'Hide molecules' box on top of Before or After box
    //------------------------------------------------------------------------------------

    var hideMoleculesBox = null;
    if ( !challenge.moleculesVisible ) {
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

    // @private handle PlayState changes
    thisNode.playStateObserver = function( playState ) {

      // face
      var faceVisible = false;
      var facePoints = 0;
      if ( playState === PlayState.TRY_AGAIN || playState === PlayState.SHOW_ANSWER ) {
        audioPlayer.wrongAnswer();
        facePoints = 0;
        faceVisible = true;
      }
      else if ( playState === PlayState.NEXT ) {
        // Check facePoints instead of correctness of challenge, because correct answer has been filled in by now.
        facePoints = challenge.points;
        if ( challenge.points > 0 ) {
          audioPlayer.correctAnswer();
          faceVisible = true;
        }
      }

      // create face on demand
      if ( !faceNode && faceVisible ) {
        faceNode = new FaceWithPointsNode( {
          faceDiameter: 150,
          faceOpacity: 0.5,
          pointsAlignment: 'rightCenter',
          pointsFill: 'yellow',
          pointsStroke: 'rgb(50,50,50)',
          pointsOpacity: 0.65
        } );
        thisNode.addChild( faceNode );
        // put it in the correct box
        faceNode.centerX = ( interactiveBox === BoxType.BEFORE ) ? thisNode.beforeBox.centerX : thisNode.afterBox.centerX;
        faceNode.centerY = questionMark.centerY = thisNode.beforeBox.top + ( thisNode.buttons.top - thisNode.beforeBox.top ) / 2;
      }
      if ( faceNode ) {
        faceNode.setPoints( facePoints );
        ( facePoints === 0 ) ? faceNode.frown() : faceNode.smile();
        faceNode.visible = faceVisible;
      }

      // 'hide' boxes
      var hideBoxVisible = ( playState !== PlayState.NEXT );
      if ( hideMoleculesBox ) {
        hideMoleculesBox.visible = hideBoxVisible;
        // also hide the Before/After box, so we don't see its stroke
        if ( interactiveBox === BoxType.BEFORE ) {
          thisNode.afterBox.visible = !hideBoxVisible;
        }
        else {
          thisNode.beforeBox.visible = !hideBoxVisible;
        }
      }
      thisNode.quantitiesNode.setHideNumbersBoxVisible( hideBoxVisible );

      // switch between spinners and static numbers
      thisNode.quantitiesNode.setInteractive( playState === PlayState.FIRST_CHECK || playState === PlayState.SECOND_CHECK );
    };
    thisNode.playStateProperty = null; // @private will be set by activate()

    //------------------------------------------------------------------------------------
    // Developer
    //------------------------------------------------------------------------------------

    // The answer to the current challenge, bottom center
    if ( RPALQueryParameters.DEV ) {
      thisNode.addChild( new Text( DevStringUtils.quantitiesString( reaction ), {
        fill: 'red',
        font: new RPALFont( 12 ),
        centerX: challengeBounds.centerX,
        bottom: challengeBounds.bottom - 5
      } ) );
    }

    thisNode.mutate( options );
  }

  return inherit( Node, ChallengeNode, {

    /**
     * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
     * @param {Property.<PlayState>} playStateProperty
     */
    activate: function( playStateProperty ) {
      this.buttons.activate( playStateProperty );
      this.playStateProperty = playStateProperty;
      // optimization: we're set up in the correct initial state, so wait for state change
      this.playStateProperty.lazyLink( this.playStateObserver ); // must be unlinked in dispose
    },

    // Ensures that this node is eligible for GC.
    dispose: function() {

      // model
      if ( this.playStateProperty ) {
        this.playStateProperty.unlink( this.playStateObserver );
      }

      // boxes
      this.beforeBox.dispose();
      this.beforeBox = null;
      this.afterBox.dispose();
      this.afterBox = null;

      // buttons
      this.buttons.dispose();
      this.buttons = null;
      this.checkButtonEnabledProperty.dispose();

      // stuff below the boxes
      this.quantitiesNode.dispose();
      this.quantitiesNode = null;
    }
  } );
} );
