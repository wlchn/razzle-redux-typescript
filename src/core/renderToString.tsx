const foundServer = require('found/lib/server');

import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { Store } from 'redux';

import { createRouterRender } from './Root';

export default async function<State = any>({
  found,
  store,
}: {
  found: any;
  store: Store<State>;
}): Promise<{ html: string }> {
  const renderArgs = await found.getRenderArgs(store);

  return {
    html: renderToString(
      <Provider store={store}>
        <foundServer.RouterProvider router={renderArgs.router}>
          {createRouterRender(renderArgs)}
        </foundServer.RouterProvider>
      </Provider>,
    ),
  };
}
