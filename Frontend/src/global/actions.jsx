export const SEARCH_DATA = "SEARCH_DATA"
export const REFRESHER = "REFRESHER"


export const searchDatas = (payload)=>{
    return{
        type:SEARCH_DATA,
        payload
    }
}

export const dataRefresher = (payload)=>{
    return{
        type:REFRESHER
    }
}