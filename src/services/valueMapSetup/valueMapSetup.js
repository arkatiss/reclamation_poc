export default build => ({
    getValueMapCodes:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'value_map/get_map_codes'
        })
    }), 
    getValueMapDef:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'value_map/get_vm_data'
        })
    }), 
    saveVmDef:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'value_map/save_vm_def'
        })
    }),
    getValueMapData:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'value_map/get_vm_def'
        })
    }), 
    saveValueMapData:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'value_map/save_value_map'
        })
    }), 
})
