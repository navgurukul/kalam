// export const login = (uid) => ({
//     type:'LOGIN',
//     uid
// });

export const changeFetching = (isFetchingStatus) => ({
    type:'FETCHING_STATUS',
    isFetchingStatus
});

export const login = (user, jwt) => ({
    type: 'LOGIN',
    user,
    jwt
});

// // Asynchronous login action which will be used in other functions

// export const startLogin = (user) => {
//   return () => {
//     login(user.id);
//   };
// };

export const logout = () => ({
  type: 'LOGOUT',
});
