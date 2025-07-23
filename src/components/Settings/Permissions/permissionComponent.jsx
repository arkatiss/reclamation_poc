import React, { useState } from 'react';
import PrimeDataTable from '../../Shared/DataTable/DataTableComponent';
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

const PermissionComponent = (props) => {
    const [selectSubMenuOptions, setSelectSubMenuOptions] = useState([]);
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [clauses, setClauses] = useState([
        { role: '', menu: '', subMenu: '', permission: '', desc: '' }
    ]);
    const rolesList = [
        { name: 'IS Admin', key: 'isAdmin' },
        { name: 'Reclaim Admin', key: 'reclaimAdmin' },
        { name: 'Business user', key: 'businessUser' },
        { name: 'All read', key: 'allRead' },
    ];

    const menusList = [
        {
            "mainMenu": "Customer Setup",
            "subMenus": [
                { name: 'Customer Master' },
                { name: 'Customer Groups' },
                { name: 'Customer Profile' }
            ]
        },
        {
            "mainMenu": "Item Setup",
            "subMenus": [
                { name: 'Item Summary' },
                { name: 'Item Details' },
                { name: 'Hazardous' }
            ]
        },
        {
            "mainMenu": "Vendor Setup",
            "subMenus": [
                { name: 'Vendor Master' },
                { name: 'Vendor Profile' }
            ]
        },
        {
            "mainMenu": "Rules Setup",
            "subMenus": [
                { name: 'Rules Definition' },
                { name: 'Exploded Rules' },
                { name: 'Vendor Costing' },
                { name: 'Scanomatic' },

            ]
        },
        {
            "mainMenu": "Scan Setup",
            "subMenus": [
                { name: 'Scan Process' },
                { name: 'Scan Error Process' }
            ]
        },
        {
            "mainMenu": "Value Map",
        },
    ]

    const permissionsList = [
        { name: 'Create' },
        { name: 'Edit' },
        { name: 'Delete' },
        { name: 'Upload' },
        { name: 'Download' }
    ]

    const columns = [
        { field: 'id', header: 'Role ID' },
        { field: 'roleName', header: 'Role Name' },
        { field: 'roleDesc', header: 'Role Description' }
    ]
    const data = [
        { id:1, roleName: 'IS Admin', roleDesc: 'Full UI access including settings/preferences' },
        { id:2, roleName: 'Reclaim Admin', roleDesc: 'Full UI access to relcamation including settings/ preferences within assigned divisions' },
        { id:3, roleName: 'Business User', roleDesc: 'UI access is limited to functions where the user has data mutation rights and rest is read-only' },
        { id:4, roleName: 'All Read', roleDesc: 'UI limited to view-only data for assigned divisions.' }
    ]





    const handleChange = (index, field, value) => {
        setClauses((prevClauses) => {
            return prevClauses.map((clause, i) => {
                if (i === index) {
                    // Update the specified field with the new value
                    const updatedClause = {
                        ...clause,
                        [field]: value,
                    };

                    // If the field is 'menu', update 'subMenu' options accordingly
                    if (field === 'menu') {
                        const subMenus = menusList.find(item => item['mainMenu'] === value?.mainMenu)?.['subMenus'] || [];
                        setSelectSubMenuOptions(subMenus); // Update the subMenu options based on the selected menu
                        updatedClause.subMenu = '';
                    }

                    return updatedClause;
                }
                return clause;
            });
        });
    };

    const addClause = () => {
        setClauses([
            ...clauses,
            { role: '', menu: '', subMenu: '', permission: '' }
        ]);
    };

    const removeClause = (index, type) => {
        setClauses((prevClauses) => {
            if (type === 'single') {
                return prevClauses.filter((_, i) => i !== index);
            }
            return prevClauses;
        });
    };

    const transformData = (data) => {
        const transformedData = {
            [data.role]: [
                {
                    mainMenu: data.menu.mainMenu,
                    subMenusList: data.subMenu.map((menu) => ({
                        parentSubMenuName: menu.name,
                        permissions: data.permission.filter((item) => ["Create", "Edit", "Delete"].includes(item.name)),
                        externalPermissions: data.permission.filter((item) => !["Create", "Edit", "Delete"].includes(item.name)),
                    })),
                },
            ],
        };

        return transformedData;
    };

    const savePermissions = () => {

        clauses.map((item) => {
            const permissionsData = transformData(item);
        });
    };

    return (
        <>
            {clauses.map((clause, index) => (

                <div className='row mt-1 align-items-start'>


                    {/* <div className='col-sm-2 d-grid'>
                    <label className="label">Role Name</label>
            <InputText value={role} onChange={(e) => setRole(e.target.value)} />

                   
                    </div>
                 
                    <div className='col-sm-2 d-grid'>
                        <label className='label'>Role Description</label>
                         <InputTextarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} cols={30} />        
                    </div>
                 

                    {index === 0 &&
                        <div className="col-sm-1 pt-4">
                    
                            <button className='success-button'><i className={'pi pi-file-plus me-2'} />{'Create'}</button>
                        </div>
                    }

                    {index > 0 &&
                        <div className="col-sm-1 pt-3">
                            <i className='pi pi-trash f-16 pointer' onClick={() => removeClause(index, 'single')} style={{ color: 'red' }}></i>
                        </div>
                    } */}

                    <div className='row m-0 p-0 mt-3'>
                        <PrimeDataTable hideSort columns={columns}  data={data} height={33} globalViews={true} crudEnabled={true} />
                    </div>

                </div>
            ))}
        </>
    )
}

export default PermissionComponent;