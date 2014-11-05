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
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameButtons = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/GameButtons' );
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MoleculesEquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/MoleculesEquationNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/NumberSpinner' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var Range = require( 'DOT/Range' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
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

    var thisNode = this;
    Node.call( thisNode );

    // equation
    var equationNode = new MoleculesEquationNode( model.challenge.reaction, {
      fill: 'black',
      centerX: challengeBounds.centerX,
      top: challengeBounds.top + 40 //TODO temporary
    } );
    thisNode.addChild( equationNode );

    // smile/frown face
    var faceNode = new FaceWithPointsNode( {
      faceDiameter: 120,
      faceOpacity: 1,
      pointsAlignment: 'rightCenter',
      centerX: challengeBounds.centerX, //TODO temporary
      top: equationNode.bottom + 30  //TODO temporary
    } );
    thisNode.addChild( faceNode );

    // buttons (Check, Try Again, ...)
    var buttons = new GameButtons( model, challenge, audioPlayer, faceNode, {
      centerX: challengeBounds.centerX, //TODO temporary
      bottom: challengeBounds.bottom - 40 //TODO temporary
    } );
    this.addChild( buttons );

    // play-state changes
    model.playStateProperty.link( function( state ) {

      // visibility of face
      faceNode.visible = ( state === PlayState.TRY_AGAIN ||
                           state === PlayState.SHOW_ANSWER ||
                           ( state === PlayState.NEXT && challenge.isCorrect() ) );

      //TODO if ( state === PlayState.NEXT ) { show answer }
    } );

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
        challenge.guess.products.forEach( function( product ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new Text( product.quantity, SPINNER_OPTIONS ),
              new SubSupText( product.symbol )
            ] } ) );
        } );
        challenge.guess.reactants.forEach( function( reactant ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new Text( reactant.leftovers, SPINNER_OPTIONS ),
              new SubSupText( reactant.symbol )
            ] } ) );
        } );
      }
      else {

        // show the reactants
        challenge.guess.reactants.forEach( function( reactant ) {
          children.push( new LayoutBox( {
            orientation: 'vertical',
            spacing: 8,
            children: [
              new Text( reactant.quantity, SPINNER_OPTIONS ),
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
        spacing: 30,
        centerX: challengeBounds.centerX,
        top: faceNode.bottom + 30
      } ) );
    }

    thisNode.mutate( options );
  }

  return inherit( Node, ChallengeNode );
} );
