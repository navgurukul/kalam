export const changeFetching = (isFetchingStatus) => ({
    type:'FETCHING_STATUS',
    isFetchingStatus
});

export const setupUsers = (users) => ({
    type:'SETUP_USERS',
    users
});

export const login = () => ({
    type:'LOGIN',
});

export const logout = () => ({
    type:'LOGOUT',
});