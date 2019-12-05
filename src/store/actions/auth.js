export const changeFetching = (isFetchingStatus) => ({
    type:'FETCHING_STATUS',
    isFetchingStatus
});

export const login = () => ({
    type:'LOGIN',
});

export const logout = () => ({
    type:'LOGOUT',
});