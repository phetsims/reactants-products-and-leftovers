// Copyright 2014-2019, University of Colorado Boulder

/**
 * View of a Game challenge. This node is not 'active' (connected to the model) until the activate() function is called.
 * This supports the ability to preload a node, then activate it at some later time.  See issue #17.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DevStringUtils = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevStringUtils' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  const GameButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameButtons' );
  const HideBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HideBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  const Property = require( 'AXON/Property' );
  const QuantitiesNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/QuantitiesNode' );
  const RandomBox = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/RandomBox' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  const RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const questionMarkString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/questionMark' );

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

    const self = this;
    Node.call( this );

    // convenience variables, to improve readability
    const reaction = challenge.reaction;
    const guess = challenge.guess;
    const interactiveBox = challenge.interactiveBox;
    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    // which substances are visible depends on whether we're guessing 'Before' or 'After' quantities
    const reactants = ( interactiveBox === BoxType.BEFORE ) ? guess.reactants : reaction.reactants;
    const products = ( interactiveBox === BoxType.AFTER ) ? guess.products : reaction.products;
    const leftovers = ( interactiveBox === BoxType.AFTER ) ? guess.leftovers : reaction.leftovers;

    //------------------------------------------------------------------------------------
    // Equation
    //------------------------------------------------------------------------------------

    // equation
    const equationNode = new MoleculesEquationNode( reaction, {
      fill: 'black',
      top: challengeBounds.top + 10,
      plusXSpacing: 25,
      arrowXSpacing: 25
    } );
    equationNode.left = challengeBounds.centerX - equationNode.arrowCenterX; // arrow at center of bounds

    // equations background
    const equationBackground = new Rectangle( 0, 0, equationNode.width + 30, equationNode.height + 6, 3, 3, {
      fill: 'white',
      stroke: 'black',
      center: equationNode.center
    } );

    this.addChild( equationBackground );
    this.addChild( equationNode );

    //------------------------------------------------------------------------------------
    // Property that tells us whether the 'Check' button should be enabled
    //------------------------------------------------------------------------------------

    // Check button is disabled if all guessable quantities are zero
    const quantityProperties = [];
    if ( interactiveBox === BoxType.BEFORE ) {
      guess.reactants.forEach( function( reactant ) { quantityProperties.push( reactant.quantityProperty ); } );
    }
    else {
      guess.products.forEach( function( product ) { quantityProperties.push( product.quantityProperty ); } );
      guess.leftovers.forEach( function( leftover ) { quantityProperties.push( leftover.quantityProperty ); } );
    }
    // @private must be detached in dispose
    this.checkButtonEnabledProperty = new DerivedProperty( quantityProperties, function() {
      // true if any quantity that the user can guess is non-zero
      for ( let i = 0, j = arguments.length; i < j; i++ ) {
        if ( arguments[ i ] !== 0 ) { return true; }
      }
      return false;
    } );

    //------------------------------------------------------------------------------------
    // Boxes & arrow
    //------------------------------------------------------------------------------------

    // Arrow between boxes
    const arrowNode = new RightArrowNode( {
      fill: RPALColors.PANEL_FILL,
      stroke: null,
      scale: 0.75,
      centerX: challengeBounds.centerX
      // y position handled below
    } );
    this.addChild( arrowNode );

    // @private 'Before Reaction' box, with molecules at random locations
    this.beforeBox = new RandomBox( reactants, {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      right: arrowNode.left - 5,
      top: equationNode.bottom + 10
    } );
    this.addChild( this.beforeBox );
    arrowNode.centerY = this.beforeBox.centerY;

    // @private 'After Reaction' box, with molecules at random locations
    this.afterBox = new RandomBox( products.concat( leftovers ), {
      boxSize: options.boxSize,
      maxQuantity: options.quantityRange.max,
      left: arrowNode.right + 5,
      top: this.beforeBox.top
    } );
    this.addChild( this.afterBox );

    //------------------------------------------------------------------------------------
    // Face
    //------------------------------------------------------------------------------------

    let faceNode = null; // created on demand

    //------------------------------------------------------------------------------------
    // Question mark
    //------------------------------------------------------------------------------------

    const questionMark = new Text( questionMarkString, {
      font: new RPALFont( { size: 150, weight: 'bold' } ),
      maxWidth: 0.75 * options.boxSize.width // constrain width for i18n
    } );
    this.addChild( questionMark );
    questionMark.centerX = ( interactiveBox === BoxType.BEFORE ) ? this.beforeBox.centerX : this.afterBox.centerX;
    // centerY is handled below

    // visible only until the user has entered a valid guess
    var checkButtonEnabledObserver = function( checkButtonEnabled ) {
      questionMark.visible = !checkButtonEnabled;
      if ( checkButtonEnabled ) { self.checkButtonEnabledProperty.unlink( checkButtonEnabledObserver ); }
    };
    // unlink is unnecessary, since this property belongs to this instance
    this.checkButtonEnabledProperty.link( checkButtonEnabledObserver );

    //------------------------------------------------------------------------------------
    // Buttons (Check, Try Again, ...)
    //------------------------------------------------------------------------------------

    // @private
    this.buttons = new GameButtons( model, this.checkButtonEnabledProperty, {
      maxWidth: 0.85 * options.boxSize.width // constrain width for i18n
    } );
    this.addChild( this.buttons );
    this.buttons.centerX = ( interactiveBox === BoxType.BEFORE ) ? this.beforeBox.centerX : this.afterBox.centerX;
    this.buttons.bottom = this.beforeBox.bottom - 15;

    // center question mark in negative space above buttons
    questionMark.centerY = this.beforeBox.top + ( this.buttons.top - this.beforeBox.top ) / 2;

    //------------------------------------------------------------------------------------
    // Everything below the boxes
    //------------------------------------------------------------------------------------

    // x-offsets of substances relative to their boxes
    const beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.boxSize.width );
    const afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.boxSize.width );

    // @private
    this.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      interactiveBox: interactiveBox,
      boxWidth: options.boxSize.width,
      afterBoxXOffset: this.afterBox.left - this.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      hideNumbersBox: !challenge.numbersVisible,
      x: this.beforeBox.x,
      top: this.beforeBox.bottom + 4
    } );
    this.addChild( this.quantitiesNode );

    //------------------------------------------------------------------------------------
    // Optional 'Hide molecules' box on top of Before or After box
    //------------------------------------------------------------------------------------

    let hideMoleculesBox = null;
    if ( !challenge.moleculesVisible ) {
      hideMoleculesBox = new HideBox( {
        boxSize: options.boxSize,
        iconHeight: 0.4 * options.boxSize.height,
        cornerRadius: 3,
        left: ( interactiveBox === BoxType.BEFORE ) ? this.afterBox.left : this.beforeBox.left,
        bottom: this.beforeBox.bottom
      } );
      this.addChild( hideMoleculesBox );
    }

    //------------------------------------------------------------------------------------
    // Observers
    //------------------------------------------------------------------------------------

    // @private must be disposed
    // Move from "Try Again" to "Check" state when a quantity is changed, see reactants-products-and-leftovers#37.
    this.answerChangedLink = Property.lazyMultilink( quantityProperties, function() {
      if ( self.playStateProperty.get() === PlayState.TRY_AGAIN ) {
        self.playStateProperty.set( PlayState.SECOND_CHECK );
      }
    } );

    // @private handle PlayState changes
    this.playStateObserver = function( playState ) {

      // face
      let faceVisible = false;
      let facePoints = 0;
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
        self.addChild( faceNode );
        // put it in the correct box
        faceNode.centerX = ( interactiveBox === BoxType.BEFORE ) ? self.beforeBox.centerX : self.afterBox.centerX;
        faceNode.centerY = questionMark.centerY = self.beforeBox.top + ( self.buttons.top - self.beforeBox.top ) / 2;
      }
      if ( faceNode ) {
        faceNode.setPoints( facePoints );
        ( facePoints === 0 ) ? faceNode.frown() : faceNode.smile();
        faceNode.visible = faceVisible;
      }

      // 'hide' boxes
      const hideBoxVisible = ( playState !== PlayState.NEXT );
      if ( hideMoleculesBox ) {
        hideMoleculesBox.visible = hideBoxVisible;
        // also hide the Before/After box, so we don't see its stroke
        if ( interactiveBox === BoxType.BEFORE ) {
          self.afterBox.visible = !hideBoxVisible;
        }
        else {
          self.beforeBox.visible = !hideBoxVisible;
        }
      }
      self.quantitiesNode.setHideNumbersBoxVisible( hideBoxVisible );

      // switch between spinners and static numbers
      self.quantitiesNode.setInteractive( _.includes( [ PlayState.FIRST_CHECK, PlayState.SECOND_CHECK, PlayState.TRY_AGAIN ], playState ) );
    };
    this.playStateProperty = null; // @private will be set by activate()

    // a11y keyboard nav order
    this.accessibleOrder = [ this.quantitiesNode, this.buttons ];

    //------------------------------------------------------------------------------------
    // Developer
    //------------------------------------------------------------------------------------

    // The answer to the current challenge, bottom center
    if ( phet.chipper.queryParameters.showAnswers ) {
      this.addChild( new Text( DevStringUtils.quantitiesString( reaction ), {
        fill: 'red',
        font: new RPALFont( 12 ),
        centerX: challengeBounds.centerX,
        bottom: challengeBounds.bottom - 5
      } ) );
    }

    this.mutate( options );
  }

  reactantsProductsAndLeftovers.register( 'ChallengeNode', ChallengeNode );

  return inherit( Node, ChallengeNode, {

    /**
     * Connects this node to the model. Until this is called, the node is preloaded, but not fully functional.
     * @param {Property.<PlayState>} playStateProperty
     * @public
     */
    activate: function( playStateProperty ) {
      this.buttons.activate( playStateProperty );
      this.playStateProperty = playStateProperty;
      // optimization: we're set up in the correct initial state, so wait for state change
      this.playStateProperty.lazyLink( this.playStateObserver ); // must be unlinked in dispose
    },

    // @public Ensures that this node is eligible for GC.
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
      this.checkButtonEnabledProperty.unlinkAll();
      this.checkButtonEnabledProperty.dispose();
      this.answerChangedLink.dispose();

      // stuff below the boxes
      this.quantitiesNode.dispose();
      this.quantitiesNode = null;

      Node.prototype.dispose.call( this );
    }
  } );
} );
