import { CLEAR_STATE, LOGOUT } from "./chatActions"

export const clearState = () => {
    return {
        type: CLEAR_STATE
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}