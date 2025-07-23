import { Button } from 'primereact/button'
import React from 'react'

export const Crudlabels = (props) => {
  return (
    <div className='d-flex gap-2'>
      {props?.saveBulkUpload ? (
        <div className="multipleCreate">
          <Button label="Save" className='primary-button' onClick={props?.submitMultiRecord} />
        </div>
      ) : (
        ""
      )}

      {/* {props?.labelMultiCreate ? (
        <div className="multipleCreate create">
          <Button label="Create"
            // style={{ height: '35px' }}
            className='edit-button '
            onClick={props?.showMultiCreate}
          >&nbsp;<i className="pi pi-plus-circle"></i>
          </Button>
        </div>
      ) : (
        ""
      )} */}

      {(props?.activeLabel === "Edit"  && props?.navObj?.CHILD_MODULE !== 'Item Summary') ? (
        <div className="multipleCreate float-end">
          <Button
            // style={{ height: '35px' }}
            className='primary-button'
            
             onClick={props?.showMultiEdit}
            severity="secondary"
            outlined
            disabled={props?.selectedProducts.length === 0 ? true : false}
          ><i className="pi pi-pen-to-square"></i>&nbsp;&nbsp;Edit</Button>

        </div>
      ) : (
        ""
      )}

      {props?.activeLabel === "Delete" ? (
        <div className="multipleCreate">
          <Button
            className="delete-button"
            // style={{ height: '35px' }}
            severity="danger"
            onClick={props?.deleteRecords}
            disabled={props?.selectedProducts.length === 0 ? true : false}
          ><i className="pi pi-trash"></i>&nbsp;Delete</Button>
        </div>
      ) : (
        ""
      )}

      {props?.activeLabel === "CopyAndCreate" && (  <div className="multipleCreate">
          <Button
            className='primary-button'
            // style={{ height: '35px' }}
            severity="secondary"
             onClick={props?.copyAndCreate}
            disabled={props?.selectedProducts.length === 0 ? true : false}
          ><i className="pi pi-plus-circle"></i>&nbsp;Copy</Button>
        </div>)}
        
        {props?.activeLabel !=="Create" && props?.activeLabel !=="BulkUpdateByColumn"  && props?.activeLabel !=="" && props?.navObj?.CHILD_MODULE !== 'Item Summary' &&  <div>
          <Button className='primary-button' disabled={props?.selectedProducts.length === 0 ? true : false}  onClick={()=>props?.clearGridOptions()}>Cancel</Button>
        </div>}
       

    </div>
  )
}
