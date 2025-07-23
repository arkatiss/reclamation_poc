import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React from 'react'

export   const BulkEdit=(props)=> {
  return (
    <div>

        <Dialog
          header="Edit"
          visible={props?.multiEdit}
          style={{ width: "75vw" }}
          onHide={props?.closeMultiEdit}
        >

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="doneButton">
              <Button label="Done"
                onClick={props?.editSubmit}
              />
            </div>
          </div>


          <div className="multiCreateForm">
            <div>
              <DataTable
                value={props?.formData}
                // dataKey="order_line_id"
                editMode="cell"
              >

                {props?.productColumns &&
                  props?.productColumns.map((item, index) => {
                    return (
                      <Column
                        key={item?.field}
                        rowEditor
                        editor={props?.inputTextEditor}
                        columnKey={item?.field}
                        field={item.field}
                        header={item.header}
                        frozen
                      />
                    );
                  })}
              </DataTable>
            </div>
          </div>
        </Dialog>
        
    </div>
  )
}
