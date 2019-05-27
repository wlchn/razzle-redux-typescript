import React from 'react';
import { Store } from 'redux';

import Root from './Root';
import { render } from 'react-dom';

export default function<State = any>({
  element,
  found,
  store
}: {
  element: HTMLElement;
  found: any;
  store: Store<State>;
}): Promise<any> {
  return found.getRenderArgs(store).then((renderArgs: any) => {
    return render(<Root renderArgs={renderArgs} store={store} />, element);
  });
}
