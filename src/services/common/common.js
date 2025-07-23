export default build => ({
    gridViewInsert: build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            //url: 'customer/GridViewInsert',
            url: 'customer/grid_insert',
        }),
        invalidatesTags: ['gridRetrieve'],  
    }),
    gridViewRetrieve: build.mutation({        
        query: (payload) => ({
            body: payload,
            method: 'POST',
            //url: 'customer/GridViewInsert',
            url: 'customer/grid_retrive',
        }),
        providesTags: ['gridRetrieve'],

    }),
    gridViewDelete: build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            
            //url: 'customer/GridDelete',
            url: 'customer/grid_delete',
        }),
    }),
    gridViewEdit: build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            //url: 'customer/GridViewUpdate',
            url: 'customer/grid_update'
            
        }),
        invalidatesTags: ['gridRetrieve'],
    }),
     gridSearchData:build.mutation  ({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            url: 'customer/get_ind_lookup',
        }),
    }),
    lookUpSearch: build.mutation({
        query: ({ url, method, payload }) => ({
          url: url,          
          method: method,     
          body: payload,
        }),
      }),
    gridViewShare: build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            
            //url: 'customer/GridDelete',
            url: 'customer/grid_share',
        }),
    }),
    uploadExcelFile: build.mutation({
        query: (payload) => ({
            body: payload,
            method: 'POST',
            
            //url: 'customer/GridDelete',
            url: 'excel_upload/upload',
        }),
    }),

});
