import { combineReducers, configureStore } from '@reduxjs/toolkit'
import usersReducer from '../reducers/usersReducer'
import chatReducer from '../reducers/chatReducer'

const appReducer = combineReducers({
    users: usersReducer,
    chats: chatReducer
});

const store = configureStore({
    reducer: appReducer
});

export { store }


// import createSagaMiddleware from 'redux-saga'
// import chatReducer from '../reducers/chatReducer'
// import socketMiddleware from '../middlewares/socketMiddleware'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import rootSaga from '../sagas/index'
// import { CLEAR_STATE } from '../actions/chatActions'
// Create the Redux store with the chat reducer and socket middleware

// const persistConfig = {
//     key: 'root',
//     storage,
// }

// const appReducer = combineReducers({
//     chat: chatReducer,
// })
// const rootReducer = (state, action) => {
//     if (action.type === CLEAR_STATE) {
//         state = undefined
//     }
//     return appReducer(state, action)
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const sagaMiddleware = createSagaMiddleware()


// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware, socketMiddleware)
// })


// // Start the saga middleware

// sagaMiddleware.run(rootSaga)

// const persistor = persistStore(store)

// export { store, persistor };
