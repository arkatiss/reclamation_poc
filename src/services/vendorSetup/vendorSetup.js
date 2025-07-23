export default build => ({
    getVendorMasterList:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'vendor/get_vendor_master_details'
        }),
        providesTags: ['vendorMaster'] 
    }), 
    getVendorMasterAudit:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'vendor/get_vendor_master_audit',
        }),
    }), 
    getVendorProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'vendor/get_vendor_details',
        }),
    }), 
    saveVendorMaster:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'vendor/save_vndr_master',
        }),
    }), 
    getVendorProfileFromMaster:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'vendor/get_vndr_prfl',
        }),
    }), 

    saveVendorProfile:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'vendor/save_vendor_profile',
        }),
    }), 

    getSystemDefaults:build.mutation({
          query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'vendor/get_vend_sys_defaults',
        }),
    }),

     saveSystemDefaults:build.mutation({
          query: (payload) => ({
            body: payload,
            method: 'POST',
            url:'vendor/save_vend_sys_defaults',
        }),
    })


})
