export const SEARCH_DATA = "SEARCH_DATA"

export const searchDatas = (payload)=>{
    return{
        type:SEARCH_DATA,
        payload
    }
}