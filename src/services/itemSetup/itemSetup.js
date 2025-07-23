export default build => ({
    getItemSummary:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_item_summary'
        })
    }),
     getItemDetails:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_item_details'
        })
    }),
    getHazardousItems:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_hazardous_items'
        })
    }),
    getTobaccoDetails:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_tobacco_details'
        })
    }),
    getItemWhDetails:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_wh_details'
        })
    }),
    getItemAuditDetails:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_item_audit_details'
        })
    }),
    getItemDeals:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_item_deals'
        })
    }),
    getModShipp:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'item/get_mod_shipp'
        })
    }),

 

//   getLogin: build.query({
//     query: () => ({
//       method: "GET",
//       url: "http://gcpcosappcpnjs01dev.cswg.com:8099/Oauth2Secure/Controller/AccessResource/2022-RCM-PRTL?",
//     }),
//   }) ,

   getWhItemsEdit: build.mutation({
        query: (payload) => ({
            url: 'item/wh_item_details_update',
            method: 'POST',
            body: payload,
        }),
    }),
    getCustDetails: build.mutation({
      query: (payload) => ({
          url: 'item/get_cust_details',
          method: 'POST',
          body: payload,
      }),
  }),
  updateItemDetails: build.mutation({
    query: (payload) => ({
        url: 'item/update_item_details',
        method: 'POST',
        body: payload,
    }),
}),

updateCustomerItemDetails: build.mutation({
    query: (payload) => ({
        url: 'item/update_cust_item_details',
        method: 'POST',
        body: payload,
    }),
}),
saveItemDetail: build.mutation({
    query: (payload) => ({
        url: 'item/save_item_detail',
        method: 'POST',
        body: payload,
    }),
}),


customerItemDetailsCreate: build.mutation({
    query: (payload) => ({
        url: 'item/InsertCustItemDetails',
        method: 'POST',
        body: payload,
    }),
}),
hazardousDeatilsUpdate: build.mutation({
    query: (payload) => ({
        url: '/item/save_hazard_items',
        method: 'POST',
        body: payload,
    }),
}),

itemsVendorDeduct: build.mutation({
    query: (payload) => ({
        url: '/item/save_cust_debit_credit',
        method: 'POST',
        body: payload,
    }),
}),
masterObjRetrieve:build.mutation({
     query: (payload) => ({
        url: '/item/get_hazardous_child',
        method: 'POST',
        body: payload,
    }),
}),
masterObjUpdate:build.mutation({
     query: (payload) => ({
        url: '/item/update_hazardous_child_item',
        method: 'POST',
        body: payload,
    }),
})
    })