import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Skeleton } from 'primereact/skeleton';
import { Column } from 'primereact/column';

const DatatableLoader = (props) => {
  return (
   <div className='d-flex m-0 align-items'>
       <DataTable
         className="grid dataTableLoaderCss"
         value={Array(12).fill({})} // Skeleton data for 12 rows
         rows={12} // Skeleton rows count
         paginator={props?.paginator} // Skeleton view won't have paginator
        //  tableStyle={{ minWidth: '95rem' }}
       >
         {Array(10).fill().map((_, i) => (
           <Column
             key={i}
             header={<Skeleton />}
             body={() => <Skeleton width="100%" height="2rem" />}  // Show skeletons
           />
         ))}
       </DataTable>
     </div>
  )
}

export default DatatableLoader