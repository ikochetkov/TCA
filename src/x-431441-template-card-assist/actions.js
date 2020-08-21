import { actionTypes } from '@servicenow/ui-core';
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import { createHttpEffect } from '@servicenow/ui-effect-http';

export default {

  'NOW_ALERT#ACTION_CLICKED': (coeffects) => {
    console.log('close here');
    console.log(coeffects);
    coeffects.updateProperties({deletedAlert: false});
  },

  [COMPONENT_BOOTSTRAPPED]: (coeffects) => {
    const { dispatch } = coeffects;
    dispatch('FETCH_INCIDENTS', {
      sysparm_display_value: true
    });
  },

  'FETCH_INCIDENTS': createHttpEffect('api/now/table/incident', {
    method: 'GET',
    queryParams: ['sysparm_display_value'],
    successActionType: 'FETCH_INCIDENTS_SUCCESS'
  }),
  
  'NOW_DROPDOWN_PANEL#ITEM_CLICKED': (coeffects) => {
    const { updateProperties, action: { payload: { item: { id, data: { card } = 'None' } } } } = coeffects;
    if (id == 'open') {
      updateProperties({ modalData: card });
    }
  },

  'DELETE_INCIDENT': (coeffects) => {
    const { dispatch, updateProperties, action: { payload: { action: { sys_id } } } } = coeffects;
    updateProperties({ loader: true, modalData: {} });
    dispatch('PROCESS_INCIDENT_DELETION', {
      sys_id: sys_id
    });
  },

  'PROCESS_INCIDENT_DELETION': createHttpEffect('api/now/table/incident/:sys_id', {
    method: 'DELETE',
    pathParams: ['sys_id'],
    successActionType: 'INCIDENT_DELETION_SUCCESS'
  }),

  'INCIDENT_DELETION_SUCCESS': (coeffects) => {
    const { dispatch } = coeffects;
    console.log('INCIDENT_DELETION_SUCCESS');
    dispatch('FETCH_INCIDENTS', {
      sysparm_display_value: true
    });
    coeffects.updateProperties({deletedAlert: true});
  },

  'FETCH_INCIDENTS_SUCCESS': (coeffects) => {
    const { action, updateState, updateProperties } = coeffects;
    let { result } = action.payload;
    let formatted_result = [];
    result.map(result => formatted_result.push(
      {
        heading: {
          label: result.short_description
        },
        content: [
          { label: 'Number', value: { type: 'string', value: result.number } },
          { label: 'State', value: { type: 'string', value: result.state } },
          { label: 'Assignment group', value: { type: 'string', value: result.assignment_group.display_value } },
          { label: 'Assigned to', value: { type: 'string', value: result.assigned_to.display_value } }
        ],
        footer_content: {
          label: 'Updated on',
          value: result.sys_updated_on
        },
        sys_id: result.sys_id
      }
    ));
    updateProperties({ loader: false, incidents: formatted_result })
  }

}