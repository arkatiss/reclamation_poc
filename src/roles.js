const config = {
        admin: {
            customerSetup: {
                customerMaster: ["create", "read", "update" ],
                customerGroup: ["create", "read", "update"],
                customerProfile: ["create", "read", "update", "delete"]
            },
            itemSetup: {
                itemSummary: ["create", "read", "update", "delete"],
                itemDetails: ["create", "read", "update", "delete"]
            },
            vendorSetup: {
                vendorMaster: ["create", "read", "update", "delete"],
                vendorProfile: ["create", "read", "update", "delete"]
            },
            rulesSetup: {
                rulesDefinition: ["create", "read", "update", "delete"],
                explodedRules: ["create", "read", "update", "delete"],
                vendorCoasting: ["create", "read", "update", "delete"],
                scanoMatic: ["create", "read", "update", "delete"]
            },
            scanSetup: {
                scanProcess: ["create", "read", "update", "delete"],
                scanErrorProcess: ["create", "read", "update", "delete"]
            },
            valueMap: ["create", "read", "update", "delete"]
        },

        user: {
            customerSetup: {
                customerMaster: ["read"],
                customerGroup: ["read"],
                customerProfile: ["read"]
            },
            itemSetup: {
                itemSummary: ["read"],
                itemDetails: ["read"]
            },
            vendorSetup: {
                vendorMaster: ["read"],
                vendorProfile: ["read"]
            },
            rulesSetup: {
                rulesDefinition: ["read"],
                explodedRules: ["read"],
                vendorCoasting: ["read"],
                scanoMatic: ["read"]
            },
            scanSetup: {
                scanProcess: ["read"],
                scanErrorProcess: ["read"]
            },
            valueMap: ["read"]
        }
    
}
export const hasPermission = (userRole, module, submodule, action) => {
    const permissions = config.roles[userRole];
    return permissions?.[module]?.[submodule]?.includes(action);
};
export default config;