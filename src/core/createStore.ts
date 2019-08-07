import { Request } from 'express';
import { RouteConfig } from 'found';
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose as reduxCompose,
  createStore,
  Reducer,
  ReducersMapObject,
  Store
} from 'redux';

import OutputAction from './OutputAction';
import OutputState from './OutputState';

import configureFound from './configureFound';
import thunk from 'redux-thunk';

const farce = require('farce');

interface CreateStoreArg<State = any, Action extends AnyAction = any> {
  initialState: State;
  req?: Request;
  rootReducer: ReducersMapObject<State, Action>;
  routes: RouteConfig;
}

interface CreateStoreOutput<State = any, Action extends AnyAction = any> {
  found: any;
  store: Store<OutputState<State>, OutputAction<Action>>;
}

const compose =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  process.env.NODE_ENV === 'development'
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : reduxCompose;

export default <State = any, Action extends AnyAction = any>({
  initialState,
  req,
  rootReducer,
  routes
}: CreateStoreArg<State>): CreateStoreOutput<State, Action> => {
  const farceProtocol = !!req ? new farce.ServerProtocol(req.url) : new farce.BrowserProtocol();

  const found = configureFound(routes, farceProtocol);
  const reduxMiddleware = applyMiddleware(thunk);
  const combinedReducers = combineReducers({
    found: found.reducer as Reducer<any, OutputAction<Action>>,
    ...rootReducer
  });

  const store: Store<OutputState<State>, OutputAction<Action>> = createStore(
    combinedReducers,
    initialState,
    compose(
      reduxMiddleware,
      ...found.storeEnhancers
    )
  );

  return { found, store };
};
