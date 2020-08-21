import '@servicenow/now-template-card';
import '@servicenow/now-modal';
import '@servicenow/now-loader';
import '@servicenow/now-alert';

export default (state) => {
  /* const placeholder = { //for development without Internet//
     heading: {
       label: 'hellow'
     },
     content: [
       { label: 'Number', value: { type: 'string', value: 'INC121212' } },
       { label: 'State', value: { type: 'string', value: 'In progress' } },
       { label: 'Assignment group', value: { type: 'string', value: 'SSC' } },
       { label: 'Assigned to', value: { type: 'string', value: 'Igor Kochetkov' } }
     ],
     footer_content: {
       label: 'Updated on',
       value: '12-12-20'
     },
     sys_id: 'placeholder_sys_id'
   }*/
  const { properties, properties: { incidents } } = state;
  return (
    <div className="main">
      <now-button-iconic icon="filter-fill" tooltipContent="Filter" size="md" variant="primary" configAria={{"aria-label":"Settings"}}></now-button-iconic>
      {properties.deletedAlert ? <div className="alert"> <now-alert status="info" icon="info-circle-outline" header="Done!" content="Incident was succesfuly deleted" action={{ "type": "dismiss" }}></now-alert></div> : null}
      <div className="container">
        {incidents && incidents.map(card =>
          <div className="card">
            <now-template-card-assist
              tagline={{ icon: "tree-view-long-outline", label: 'INCIDENT' }}
              actions={[
                { id: 'open', label: 'Open record', data: { card } },
                { id: 'delete', label: 'Delete', sys_id: card.sys_id, clickActionType: 'DELETE_INCIDENT' }
              ]}
              heading={card.heading}
              content={card.content}
              footer-content={card.footer_content}
            />
          </div>
        )}

        {properties.loader ? <div className="loader"><div className="over"></div><div className="place"><now-loader label="Loading..." size="lg"></now-loader></div></div> : null}

        <now-modal
          opened={properties.modalData.content}
          size='md'
          header-label='Incident details'
          content={properties.modalData.content ?
            (<span>
              <p><b>Description:</b> {properties.modalData.heading.label}</p>
              <p><b>{properties.modalData.footer_content.label}:</b> {properties.modalData.footer_content.value}</p>
              {properties.modalData.content.map(con => <p><b>{con.label}:</b> {con.value.value}</p>)}
            </span>)
            : null}
          footer-actions={[
            { id: 'delete', variant: "primary", label: "Delete", sys_id: properties.modalData.sys_id, clickActionType: 'DELETE_INCIDENT' }
          ]}>
        </now-modal>

      </div>
    </div>
  );
};
