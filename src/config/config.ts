/**
 * File created for set the constant
 * Created: 29-Oct-2017
 * Creator: Jagdish Thakre
 */
export const CONFIG= {
    HTTP_HOST_URL: "http://52.34.207.5:5091/api/v1/",
    // HTTP_HOST_URL: "http://172.10.55.79:5091/api/v1/",
    // HTTP_HOST_URL: "http://128.205.165.196/api/v1/",
    MESSAGES: {
        RegSuccessMsg: "Your registration information was successfully submitted. You will receive an e-mail notifying you when you can access the app.",
        NetworkMsg: "Nerwork is not available!!",
        ServerMsg: "Server is not responding!",
        SessionMsg: "Session expired!"
    },
    ValidExpr: {
        email: '^[ a-zA-Z0-9]+[a-zA-Z0-9]+[a-zA-Z0-9._]+@[a-z]*[.]{1,1}[a-z ]{2,5}$',
        contactLength: 10,
        firstname: '[a-zA-Z]*',
        lastname: '[a-zA-Z ]*',
        number: '[0-9]*'
    }
}