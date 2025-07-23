export default build => ({
    getScanProcessList:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'scan/getScans'
        })
    }), 
    getScanErrorProcessList:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'scan/getScanStg'
        })
    }), 
    saveScanErrorProcess:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'scan/saveScansStg'
        })
    }),
    getScanAudit:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'scan/get_scan_audit'
        })
    }),
    getScanErrorAudit:build.mutation  ({      
        query: (payload) => ({
            body: payload,
            method: 'POST',
             url: 'scan/get_scan_stg_audit'
        })
    }),
})
