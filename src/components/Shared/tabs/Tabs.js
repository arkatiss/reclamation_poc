import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { addRowIcon, deleteIcon } from '../../../assests/icons';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './tabs.scss';
import { InputText } from 'primereact/inputtext';

const TabsComponent = (props) => {
    const items = props?.tabs.map(tab => ({ label: tab,
                disabled: props?.upcData.length === 0 && (tab === "C&S Warehouse Details" || tab === "Customer Item Details" || tab ==="Mod/Shipper Details" || tab==="Tobacco Details" || tab === "Hazardous, DEA Details")

     }));

    
    return (
        <div className='d-flex align-items-center br' style={{width:'100%'}}>
        <TabMenu 
            model={items} 
            activeIndex={props?.activetab} 
            onTabChange={(e)=>props?.tabChange(e?.index)}
            className="custom-tabs"
        />
        <div className='d-flex ml-auto gap-3 justify-content-end mr-4 pointer' style={{background:'#F6F9FC',padding:'6px'}}>
                {(props?.tabName === "C&S Warehouse Detail" || "Customer Item Details")&& (props?.tabName !== "Item Details") &&
                // <InputText placeholder='Search' className='tabSearch'/>
                <></>
                }
                {props?.tabName === "Customer Item Details" &&
                <>
                {/* <img src={addRowIcon} alt='' width={'28px'} onClick={props?.copyAndAddRow}/>
                <img src={deleteIcon} alt='' width={'28px'}/> */}
                </>
                }
        </div>
        </div>
    );
};

export default TabsComponent;
