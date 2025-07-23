import React, { useEffect, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Checkbox } from 'primereact/checkbox';
import { whiteSave, resetIcon } from '../../assests/icons';
import { Form } from 'antd';
import { SelectButton } from 'primereact/selectbutton';
import  DivivionComponent  from '../Division/divisionComponent';
import PermissionComponent from './Permissions/permissionComponent';
import {  changeSubModule } from '../../slices/navigation';
import { useDispatch } from 'react-redux';
import UserComponent from './Users/userComponent';
import { DivisionComponent } from '../Shared/Division';

const SettingsComponent = () => {
  const options = ['Roles', 'Users', 'Division' ];
  const [value, setValue] = useState('');
  const dispatch = useDispatch()


  const [mappingForm] = Form.useForm();
  const [defaultSettingschecked, setDefaultSettingschecked] = useState(false);
  const [activeButton, setActiveButton] = useState(1);
  const [activeButtonNumber, setActiveButtonNumber] = useState(2);
  const [gridTypes, setGridTypes] = useState([
    { value: 'twoStep', label: 'Two Step Grid', checked: true },
    { value: 'scrolling', label: 'Scrolling Grid', checked: false },
  ]);
  const [gridFeatures, setGridFeatures] = useState([
    { value: 'searchBar', label: 'Search Bar', checked: true },
    { value: 'filters', label: 'Filters', checked: true },
    { value: 'pagination', label: 'Pagination', checked: true },
    { value: 'dataVisualization', label: 'Data Visualization', checked: true },
    { value: 'inLineEdit', label: 'Inline Edit', checked: true },
    { value: 'bulkOperations', label: 'Bulk Operation(Create, Edit, Delete)', checked: false },
  ]);
  const [interactions, setInteractions] = useState([
    { value: 'hoverEffects', label: 'Hover Effects', checked: true },
    { value: 'animations', label: 'Animations', checked: true },
    { value: 'tooltips', label: 'Tooltips', checked: true },
  ])

  /**
    @remarks
    This function to change the Grid features
    @author Amar
   */
  const handleChangeGridFeature = (e, i) => {
    i.checked = e?.checked;
    setGridFeatures([...gridFeatures]);
  }
  /**
    @remarks
    This function to change the Grid type
    @author Amar
   */
  const handleChangeGridTypes = (e, i) => {
    i.checked = e?.checked
    setGridTypes([...gridTypes]);
  }
  /**
    @remarks
    This function to change the Interactions
    @author Amar
   */
  const handleChangeInteractions = (e, i) => {
    i.checked = e?.checked
    setInteractions([...interactions]);
  }
  /**
     @remarks
     This function to change the Text alignment
     @author Amar
    */
  const handleBtnTextAlignment = (num) => {
    setActiveButton(num);
  }
  /**
     @remarks
     This function to change the Text alignment
     @author Amar
    */
  const handleBtnNumberAlignment = (num) => {
    setActiveButtonNumber(num);
  }
  /**
     @remarks
     This function to Save the settings page
     @author Amar
    */
  const handleSaveSettingDetails = () => {
  }
  /**
     @remarks
     This function to Reset the settings page
     @author Amar
    */
  const handleResetSettingDetails = () => {
    gridFeatures.map((i) => {
      i.checked = false;
    })
    setGridFeatures([...gridFeatures]);
    gridTypes.map((i) => {
      i.checked = false;
    })
    setGridTypes([...gridTypes]);
    interactions.map((i) => {
      i.checked = false;
    })
    setInteractions([...interactions]);
    setActiveButton(null);
    setDefaultSettingschecked(false);
    setActiveButtonNumber(null);
  }

  const changeMenu = (e) => {
    dispatch(changeSubModule({subModule:e.value}));
    setValue(e.value);
  }

  useEffect(() => {
    changeMenu({ value: 'Roles' });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <SelectButton className='selectiveButton' value={value} onChange={(e) => changeMenu(e)} options={options} />
          <DivisionComponent/>
        {value === 'Layout Configuration' &&
          <div className='d-flex gap-2'>
            <span className='label lblDefaultSettings'>Enable Default Settings  <InputSwitch className='me-2 switchSettings' checked={defaultSettingschecked} onChange={(e) => setDefaultSettingschecked(e.value)} /> </span>
          </div>
        }
      </div>
      {value === 'Layout Configuration' && 
      <Form form={mappingForm}>
        
        <div className='d-flex justify-content-between align-items-center'>
          <p className='lblGridSettings mt-4'>Default Grid Settings</p>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <span className='lblSubHeadings'>1. Grid Type:</span>
        </div>

        <div className='row'>
          {gridTypes?.map((i) => (
            <div className="col-3 mt-3">
              <Checkbox checked={i?.checked} onChange={(e) => handleChangeGridTypes(e, i)} />
              <span className="ms-2">{i.label}</span>
            </div>
          ))}
        </div>
        <hr />
        <div className='d-flex justify-content-between align-items-center'>
          <span className='lblSubHeadings'>2. Grid Features:</span>
        </div>
        <div className='row'>
          {gridFeatures?.map((i) => (
            <div className="col-3 mt-3">
              <Checkbox checked={i?.checked} onChange={(e) => handleChangeGridFeature(e, i)} />
              <span className="ms-2">{i.label}</span>
            </div>
          ))}
        </div>
        <hr />
        <div className='d-flex justify-content-between align-items-center'>
          <span className='lblSubHeadings'>3. Alignments and Spacing:</span>
        </div>
        <div className='row mt-3'>
          <div className='col-1'>
            <span>Text Alignment: </span>
          </div>
          <div className='col-3 btnTextAlignment'>
            <span className={`alignmentBtns ${activeButton === 1 ? 'alignmentBtnactive' : ''}`} onClick={() => handleBtnTextAlignment(1)}>Left</span>
            <span className={`alignmentBtns ${activeButton === 2 ? 'alignmentBtnactive' : ''}`} onClick={() => handleBtnTextAlignment(2)}>Middle</span>
            <span className={`alignmentBtns ${activeButton === 3 ? 'alignmentBtnactive' : ''}`} onClick={() => handleBtnTextAlignment(3)}>Right</span>
          </div>
          <div className='col-2'>
            <span>Number Alignment: </span>
          </div>
          <div className='col-3 btnTextAlignment'>
            <span className={`alignmentBtns ${activeButtonNumber === 1 ? 'alignmentBtnactive' : ''}`} onClick={() => handleBtnNumberAlignment(1)}>Left</span>
            <span className={`alignmentBtns ${activeButtonNumber === 2 ? 'alignmentBtnactive' : ''}`} onClick={() => handleBtnNumberAlignment(2)}>Middle</span>
            <span className={`alignmentBtns ${activeButtonNumber === 3 ? 'alignmentBtnactive' : ''}`} onClick={() => handleBtnNumberAlignment(3)}>Right</span>
          </div>
        </div>
        <hr />
        <div className='d-flex justify-content-between align-items-center'>
          <span className='lblSubHeadings'>4. Interactions:</span>
        </div>
        <div className='row'>
          {interactions?.map((i) => (
            <div className="col-3 mt-3">
              <Checkbox checked={i?.checked} onChange={(e) => handleChangeInteractions(e, i)} />
              <span className="ms-2">{i.label}</span>
            </div>
          ))}
        </div>
        <div className='row mt-5'>
          <div className='col-5'></div>
          <div className='col-1'>
            <button className='secondary-button' onClick={handleResetSettingDetails}><img src={resetIcon} alt="reset" width={20} className='me-1' />Reset</button>
          </div>
          <div className='col-1'>
            <button className='primary-button' onClick={handleSaveSettingDetails}><img src={whiteSave} alt="save" width={20} className='me-1' />Save</button>
          </div>
        </div>
      </Form>
      }
      {value === 'Division' &&
      <div className="mt-3">
      <DivivionComponent />
      </div>
      }
      {value === 'Roles' && 
      <div className="mt-3">
      <PermissionComponent />
      </div>}
      {value === 'Users' && 
      <div className="mt-3">
      <UserComponent />
      </div>}
    </div>

  )

}
export default SettingsComponent