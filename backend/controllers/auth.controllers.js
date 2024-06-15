export const authSignup = async(request, response) => {
    response.send("<h1>Sign up</h1>")
}

export const authLogin = async(request, response) => {
    response.send("<h1>Login</h1>")
}

export const authLogout = async(request, response) => {
    response.send("<h1>Logout</h1>")
}