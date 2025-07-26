import { useUtils } from './utils';
export const GridBodyRenderer = ({
    field,
    rowData,
    index,
    editingRowIndex,
    renderEditableField,
    fieldTypeMap = {},
    item,

    // Existing props
    handleIconClick, handleRulesDef, exploded, activeButtonTemplate,
    getStoreDetails, getCustomerFeeDetails, checkBoxes, getSelection,
    getexclusionValidation, getEffectiveDate, getSelectionInput,
    getMasterUPCDetails, getCustAndVendorFees, ruleLink,
    showItemPurchaseStatus, getVendorCustomerDebitCreditDetails,
    getIsRecallAndSwell, getActionClear, getCheckBoxValueMap,
    getVendorProfileView, selectAction, getSelectionList,
    showFileNameLink, showStatusDownload, getRulesDefAuditIcon,
    showExclusion, screenFeatures, divisionInfoView,
    showErrorLink, lastUPDDateAudit, explodedRulesRule,
    dateFormatChange, getCustomerFeeDetailsRule,
    hazLockCheckboxes, statusChange,setEditing,
    insertFields, setInsertFields,activeLabel,productColumns
}) => {
    const { handleRowClickFun,handleMissingFields } = useUtils();
    const isEditing = editingRowIndex === index;
   
    // 1️⃣ Editing Mode First
    if (isEditing && activeLabel === 'Edit') {
        
        
       // const fieldType = fieldTypeMap[field] || 'textbox'; // default to textbox
        return renderEditableField(item, rowData, index);
    }
    if (!isEditing) {
    return (
        <span
            onDoubleClick={async () => {
   // let updatedFinalFields = await handleMissingFields([rowData], insertFields,productColumns);
    const updatedFields = await handleRowClickFun({ data: rowData }, insertFields,productColumns);
    
  setInsertFields(updatedFields); // 🔄 update state only after async completes
  setEditing(index, item);  // enable edit mode
    // 🔁 move your setup call here
  }}
            className="editable-cell"
        >
        {rowData[field]}
        </span>
    );
}


    // 2️⃣ Then "New Record" handling
    if (rowData.isNewRecord) {
        switch (field) {
            case 'STORE_DETAILS':
                return (
                    <div>
                        <i
                            className="pi pi-plus pointer custom-plus-icon"
                            onClick={() => handleIconClick(rowData, index)}
                        ></i>
                    </div>
                );
            case 'GRP_STATUS':
            case 'GRP_STORE_STATUS':
                return getSelectionList(field, rowData, index);
            case 'CHAIN_NUM':
            case 'CS_STORE_NUM':
            case 'USE_ICOST_AT_NO_SALES':
            case 'RCLM_CUSTOMER_GRP_ID':
            case 'RCLM_CUSTOMER_GRP_NAME':
                return getSelectionInput(field, rowData, index);
            case 'GRP_EFFECTIVE_START_DATE':
            case 'GRP_EFFECTIVE_END_DATE':
            case 'STORE_EFFECTIVE_START_DATE':
            case 'STORE_EFFECTIVE_END_DATE':
                return getEffectiveDate(field, rowData, index);
            case 'audit':
                return getCustomerFeeDetails(field, rowData);
            default:
                return rowData[field];
        }
    }

    // 3️⃣ Otherwise, normal rendering (read-only)
    switch (field) {
        case 'originalReclaimApVendor':
        case 'reclaimCustomerGroup':
        case 'gl':
        case 'csChains':
        case 'reclaimCustomerNumber':
        case 'privateLabel':
        case 'hazardous':
        case 'isCustomerCredit':
        case 'isVendorDebit':
        case 'deductReasonCode':
        case 'newReclaimApVendor':
        case 'absolute':
        case 'csCustNumberName':
        case 'processStatus':
        case 'custStoreNumber':
        case 'rclmVendorNumberName':
        case 'whseItemCode':
        case 'itemDescription':
        case 'facilityNumberName':
        case 'rclmCustGrpNumName':
        case 'reclaimasServiceFlag':
        case 'hazflag':
        case 'avgScan':
        case 'vendorDeduct':
        case 'swellFlag':
        case 'reclaimVendor':
        case 'debitReason':
        case 'apVendor':
        case 'reclaimItem':
        case 'recallFlag':
        case 'recallClassification':
            return handleRulesDef(field, rowData);

        case 'hasRuleExploded':
        case 'HAS_RULE_EXPLODED':
            return exploded(rowData);

        case 'PARTY_SITE_STATUS':
        case 'status':
        case 'PROFILE_STATUS':
        case 'profileStatus':
            return activeButtonTemplate(field, rowData, index);

        case 'STORE_DETAILS':
            return getStoreDetails(rowData);

        case 'customerFee':
        case 'hasVendorFee':
        case 'audit':
        case 'Audit':
        case 'AUDIT':
            return getCustomerFeeDetails(field, rowData);

        case 'HAS_CUSTOMER_FEE':
        case "HAS_VENDOR_FEE":
            return getCustomerFeeDetailsRule(field, rowData);

        case 'rulesAudit':
            return getRulesDefAuditIcon(field, rowData);

        case 'allowCustomerOwnedItems':
        case "passThroughFee":
        case 'scanAgainstSales':
        case 'scanAuthorization':
        case 'pvtLabelAuth':
        case 'view':
        case 'update':
        case 'hasWarehouseDamages':
            return checkBoxes(field, rowData, index);

        case 'excludedGis':
        case 'scannedSources':
            return getSelection(field, rowData, index);

        case 'exclusionValidation':
            return getexclusionValidation(field, rowData, index);

        case 'effectiveForm':
        case 'effectiveTo':
        case 'lastPurchaseDate':
        case 'lastSoldDate':
        case 'lastScanDate':
            return getEffectiveDate(field, rowData, index);

        case 'unitFactor':
        case 'seqNumber':
        case 'prompt':
        case 'caseUpcXr':
        case 'brandName':
        case 'width':
            return getSelectionInput(field, rowData, index);

        case 'masterUpc':
        case 'masterItemId':
        case 'MASTER_UPC':
            return getMasterUPCDetails(field, rowData, index);

        case 'hasCustomerFee':
        case 'hasVendorFee':
            return getCustAndVendorFees(field);

        case 'rule':
            return ruleLink(rowData);

        case 'itemPurchStatus':
            return showItemPurchaseStatus(field, rowData);

        case 'customerCreditExploded':
        case 'vendorDebitExploded':
            return getVendorCustomerDebitCreditDetails(field, rowData);

        case 'isRecallExploded':
        case 'isSwellExploded':
            return getIsRecallAndSwell(field, rowData);

        case 'clear':
            return getActionClear(field, rowData, index);

        case "requiredFlag":
        case "show":
        case "viewsWithFilters":
        case "create":
        case "edit":
        case "delete":
        case "bulkUpdateByColumn":
        case "excelUpload":
        case "excelDownload":
        case "template":
        case "copyAndCreate":
        case "divisionStatus":
            return getCheckBoxValueMap(field, rowData, index);

        case 'AP_VENDOR_NUMBER':
            return getVendorProfileView(field, rowData);

        case 'actionDivision':
        case 'userActions':
            return selectAction(field, rowData, index);

        case 'file_name':
            return showFileNameLink(field, rowData);

        case 'error_count':
            return showErrorLink(field, rowData);

        case 'validation_status':
            return showStatusDownload(field, rowData);

        case 'EXCLUSION_VALIDATION':
            return showExclusion(field, rowData);

        case 'screenFeatures':
            return screenFeatures(field, rowData, index);

        case 'DIVISION_ROLE_JSON':
            return divisionInfoView(field, rowData, index);

        case 'CHANGED_TIME':
            return lastUPDDateAudit(field, rowData, index);

        case 'EXPLOSION_SOURCE':
            return explodedRulesRule(field, rowData, index);

        case 'GRP_EFFECTIVE_START_DATE':
        case 'GRP_EFFECTIVE_END_DATE':
        case 'STORE_EFFECTIVE_START_DATE':
        case 'STORE_EFFECTIVE_END_DATE':
        case 'CREATION_DATE':
        case 'LAST_UPDATE_DATE':
        case 'RULE_EFFECTIVE_FROM':
        case 'RULE_EFFECTIVE_TO':
        case 'EFFECTIVE_FROM':
        case 'EFFECTIVE_TO':
        case 'LAST_SCAN_DATE':
        case 'cust_invoice_date':
        case 'billing_date':
        case 'scan_date':
        case 'vend_invoice_date':
        case 'scan_status_start_date':
        case 'scan_date_to':
        case 'scan_status_end_date':
        case 'scan_date_from':
            return dateFormatChange(field, rowData, index);

        case 'WI_LOCK':
        case 'CT_LOCK':
        case 'CA_LOCK':
        case 'TX_LOCK':
        case 'FL_LOCK':
            return hazLockCheckboxes(field, rowData, index);

        case 'STATUS':
            return statusChange(field, rowData, index);

        default:
            return rowData[field];
    }
};
export default GridBodyRenderer;