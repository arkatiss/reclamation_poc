import React from 'react';

const GridBodyRenderer = ({
  field,
  rowData,
  index,
  renderEditableField,
  item,
  handleIconClick,
  handleRulesDef,
  exploded,
  activeButtonTemplate,
  getStoreDetails,
  getCustomerFeeDetails,
  checkBoxes,
  getSelection,
  getexclusionValidation,
  getEffectiveDate,
  getSelectionInput,
  getMasterUPCDetails,
  getCustAndVendorFees,
  ruleLink,
  showItemPurchaseStatus,
  getVendorCustomerDebitCreditDetails,
  getIsRecallAndSwell,
  getActionClear,
  getCheckBoxValueMap,
  getVendorProfileView,
  selectAction,
  getSelectionList,
  showFileNameLink,
  showStatusDownload,
  getRulesDefAuditIcon,
  showExclusion,
  screenFeatures,
  divisionInfoView,
  showErrorLink,
  lastUPDDateAudit,
  explodedRulesRule,
  getCustomerFeeDetailsRule,
  hazLockCheckboxes,
  statusChange,
  activeLabel,
}) => {
    

  // 2️⃣ New Record Mode
  if (rowData?.isNewRecord) {
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

  // 3️⃣ Read-only / View Mode
  const renderMap = {
    originalReclaimApVendor: handleRulesDef,
    reclaimCustomerGroup: handleRulesDef,
    gl: handleRulesDef,
    csChains: handleRulesDef,
    reclaimCustomerNumber: handleRulesDef,
    privateLabel: handleRulesDef,
    hazardous: handleRulesDef,
    isCustomerCredit: handleRulesDef,
    isVendorDebit: handleRulesDef,
    deductReasonCode: handleRulesDef,
    newReclaimApVendor: handleRulesDef,
    absolute: handleRulesDef,
    csCustNumberName: handleRulesDef,
    processStatus: handleRulesDef,
    custStoreNumber: handleRulesDef,
    rclmVendorNumberName: handleRulesDef,
    whseItemCode: handleRulesDef,
    itemDescription: handleRulesDef,
    facilityNumberName: handleRulesDef,
    rclmCustGrpNumName: handleRulesDef,
    reclaimasServiceFlag: handleRulesDef,
    hazflag: handleRulesDef,
    avgScan: handleRulesDef,
    vendorDeduct: handleRulesDef,
    swellFlag: handleRulesDef,
    reclaimVendor: handleRulesDef,
    debitReason: handleRulesDef,
    apVendor: handleRulesDef,
    reclaimItem: handleRulesDef,
    recallFlag: handleRulesDef,
    recallClassification: handleRulesDef,
    hasRuleExploded: exploded,
    HAS_RULE_EXPLODED: exploded,
    PARTY_SITE_STATUS: activeButtonTemplate,
    status: activeButtonTemplate,
    PROFILE_STATUS: activeButtonTemplate,
    profileStatus: activeButtonTemplate,
    STORE_DETAILS: getStoreDetails,
    customerFee: getCustomerFeeDetails,
    hasVendorFee: getCustomerFeeDetails,
    audit: getCustomerFeeDetails,
    Audit: getCustomerFeeDetails,
    AUDIT: getCustomerFeeDetails,
    HAS_CUSTOMER_FEE: getCustomerFeeDetailsRule,
    HAS_VENDOR_FEE: getCustomerFeeDetailsRule,
    rulesAudit: getRulesDefAuditIcon,
    allowCustomerOwnedItems: checkBoxes,
    passThroughFee: checkBoxes,
    scanAgainstSales: checkBoxes,
    scanAuthorization: checkBoxes,
    pvtLabelAuth: checkBoxes,
    view: checkBoxes,
    update: checkBoxes,
    hasWarehouseDamages: checkBoxes,
    excludedGis: getSelection,
    scannedSources: getSelection,
    exclusionValidation: getexclusionValidation,
    effectiveForm: getEffectiveDate,
    effectiveTo: getEffectiveDate,
    lastPurchaseDate: getEffectiveDate,
    lastSoldDate: getEffectiveDate,
    lastScanDate: getEffectiveDate,
    unitFactor: getSelectionInput,
    seqNumber: getSelectionInput,
    prompt: getSelectionInput,
    caseUpcXr: getSelectionInput,
    brandName: getSelectionInput,
    width: getSelectionInput,
    masterUpc: getMasterUPCDetails,
    masterItemId: getMasterUPCDetails,
    MASTER_UPC: getMasterUPCDetails,
    hasCustomerFee: getCustAndVendorFees,
    rule: ruleLink,
    itemPurchStatus: showItemPurchaseStatus,
    customerCreditExploded: getVendorCustomerDebitCreditDetails,
    vendorDebitExploded: getVendorCustomerDebitCreditDetails,
    isRecallExploded: getIsRecallAndSwell,
    isSwellExploded: getIsRecallAndSwell,
    clear: getActionClear,
    requiredFlag: getCheckBoxValueMap,
    show: getCheckBoxValueMap,
    viewsWithFilters: getCheckBoxValueMap,
    create: getCheckBoxValueMap,
    edit: getCheckBoxValueMap,
    delete: getCheckBoxValueMap,
    bulkUpdateByColumn: getCheckBoxValueMap,
    excelUpload: getCheckBoxValueMap,
    excelDownload: getCheckBoxValueMap,
    template: getCheckBoxValueMap,
    copyAndCreate: getCheckBoxValueMap,
    divisionStatus: getCheckBoxValueMap,
    AP_VENDOR_NUMBER: getVendorProfileView,
    actionDivision: selectAction,
    userActions: selectAction,
    file_name: showFileNameLink,
    error_count: showErrorLink,
    validation_status: showStatusDownload,
    EXCLUSION_VALIDATION: showExclusion,
    screenFeatures: screenFeatures,
    DIVISION_ROLE_JSON: divisionInfoView,
    CHANGED_TIME: lastUPDDateAudit,
    EXPLOSION_SOURCE: explodedRulesRule,
    WI_LOCK: hazLockCheckboxes,
    CT_LOCK: hazLockCheckboxes,
    CA_LOCK: hazLockCheckboxes,
    TX_LOCK: hazLockCheckboxes,
    FL_LOCK: hazLockCheckboxes,
    STATUS: statusChange,
  };

  const renderFn = renderMap[field];

  return renderFn
    ? renderFn(field, rowData, index)
    : activeLabel === 'Edit'
    ? renderEditableField(item, rowData, index)
    : rowData[field];
};

// ✅ Custom comparison: only re-render when specific row or editing state changes
export default React.memo(GridBodyRenderer, (prevProps, nextProps) => {
  return (
    prevProps.rowData === nextProps.rowData &&
    prevProps.editingRowIndex === nextProps.editingRowIndex &&
    prevProps.activeLabel === nextProps.activeLabel &&
    prevProps.field === nextProps.field
  );
});
