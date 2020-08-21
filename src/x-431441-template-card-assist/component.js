import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import view from './view';
import actions from './actions';

createCustomElement('x-431441-template-card-assist', {
  renderer: { type: snabbdom },
  view,
  styles,
  properties: {
    modalData: { default: {} },
    loader: { default: true },
    incidents: { default: null },
    deletedAlert: { default: false }
  },
  actionHandlers: actions
});