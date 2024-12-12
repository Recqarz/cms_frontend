import { REFRESHER, SEARCH_DATA } from "./actions";

const initState = {
    searchData:"",
    refresher:false
}

export function Reducer(state=initState,action){
    switch(action.type){
        case SEARCH_DATA:
            return {...state, searchData:action.payload}
        case REFRESHER:
            return {...state, refresher:!(state.refresher)}
        default:
            return state
    }
}