import {applyMiddleware, legacy_createStore} from "redux"
import logger from "redux-logger"
import { Reducer } from "./reducer"

export const store = legacy_createStore(Reducer,applyMiddleware(logger))