import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

import * as actions from '../../store/actions/index';

export const BurgerBuilder = (props) => {

  // You can also put here const dispatch = useDispatch() and get the functions from the bottom to the top as constants
  // The same with e.g. const ings = useSelector(state => state.burgerBuilder.ingredients);
  
  const [purchasing, setPurchasing] = useState(false);
  const { onInitIngredients } = props;

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    return sum > 0;
  };

  // addIngredientHandler = (type) => {
  //   const oldCount = state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = { ...state.ingredients };
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;

  //   setState({ ingredients: updatedIngredients, totalPrice: newPrice });
  //   updatePurchaseState(updatedIngredients);
  // };

  // removeIngredientHandler = (type) => {
  //   const oldCount = state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = { ...state.ingredients };
  //   updatedIngredients[type] = updatedCount;
  //   const priceSubtraction = INGREDIENT_PRICES[type];
  //   const oldPrice = state.totalPrice;
  //   const newPrice = oldPrice - priceSubtraction;

  //   setState({ ingredients: updatedIngredients, totalPrice: newPrice });
  //   updatePurchaseState(updatedIngredients);
  // };

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath('checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push('/checkout');
    // const queryParams = [];
    // for (let i in state.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       '=' +
    //       encodeURIComponent(state.ingredients[i])
    //   );
    // }
    // queryParams.push('price=' + state.totalPrice);
    // const queryString = queryParams.join('&');
    // props.history.push({
    //   pathname: '/checkout',
    //   search: '?' + queryString,
    // });
  };

  const disabledInfo = { ...props.ings };

  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  // Checks if ingredients were fetched from the database

  let orderSummary = null;
  let burger = props.error ? (
    <p style={{ textAlign: 'center' }}>Ingredients can't be loaded</p>
  ) : (
    <Spinner />
  );

  if (props.ings) {
    burger = (
      <Aux>
        <Burger ingredients={props.ings} />
        <BuildControls
          disabled={disabledInfo}
          ingredientAdded={props.onIngredientAdded}
          ingredientRemoved={props.onIngredientRemoved}
          ordered={purchaseHandler}
          price={props.totalPrice}
          purchasable={updatePurchaseState(props.ings)}
          isAuth={props.isAuthenticated}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        ingredients={props.ings}
        price={props.totalPrice}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
