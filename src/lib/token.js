export const setToken = (token) => { 
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
}

export const getToken = () => {
    return localStorage.getItem("token");
}

export const clearToken = () => { 
    localStorage.removeItem("token");
}