import { SEARCH_DATA } from "./actions";

const initState = {
    searchData:""
}

export function Reducer(state=initState,action){
    switch(action.type){
        case SEARCH_DATA:
            return {...state, searchData:action.payload}
        default:
            return state
    }
}