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
        ServerMsg: "Server not responding!",
        SessionMsg: "Session expired!",
        CantPlayMsg: "You can't play!",
        DownloadSuccess: "Download successfully!",
        DownloadFailed: "Download Failed!"
    },
    ValidExpr: {
        email: '^[ a-zA-Z0-9]+[a-zA-Z0-9]+[a-zA-Z0-9._]+@[a-z]*[.]{1,1}[a-z ]{2,5}$',
        contactLength: 10,
        firstname: '[a-zA-Z]*',
        lastname: '[a-zA-Z ]*',
        number: '[0-9]*'
    },
    LocalDir: 'OmniSeq/',
    GoogleAnyId: "UA-115452123-1",
    GAnalyticsPageName: {
        login: "Login",
        forgotPwd: "Forgot Password",
        signup: "Signup",
        setting: "Setting",
        profile: "Profile",
        changePwd: "Change Password",
        askQue: "Ask a Questions",
        about: "About",
        homePage: "Home Screen",
        reportCard: "OmniSeq Report Card",
        comprehensive: "OmniSeq Comrehensive",
        podcastList: "Podcast List",
        podcastDetail: "Podcast Detail",
        videosList: "Videos",
        videoDetail: "Video Detail",
        calldebrief: "Call-de Brief Survey",
        cancerImmuneCycle: "Cancer Immune Cycle",
        rcGeneList: "Report Card Gene List",
        rcGeneDetail: "Report Card Gene Detail",
        rcCompanionList: "Report Card Companion/Complementary List",
        rcCompanionDetail: "Report Card Companion/Complementary Detail",
        ComprehensiveGeneList: "Comprehensive Gene List",
        ComprehensiveGeneDetail: "Comprehensive Gene Detail",
        ComprehensiveCompanionList: "Comprehensive Companion/Complementary List",
        ComprehensiveCompanionDetail: "Comprehensive Companion/Complementary Detail",
        rcQuiz: "Report Card Quiz Screen",
        rcQuizComplete: "Report Card Quiz Congratulation Screen",
        ComprehensiveQuiz: "Comprehensive Quiz Screen",
        ComprehensiveQuizComplete: "Comprehensive Quiz Congratulation Screen",
        rcFAQ: "Report Card FAQ",
        ComprehensiveFAQ: "Comprehensive FAQ",
        histology: "Histology View",
        cancerslist: "Cancers Types List"
    }
}