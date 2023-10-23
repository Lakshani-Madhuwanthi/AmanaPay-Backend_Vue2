let appSettings

if (process.env.NODE_ENV === "production") {
    appSettings = {
        $api_url: "http://apay-test.paymediasolutions.com:5000",
        $api_url_internal: "https://uatlankaremitv2.lankapay.net:7016",
        timeoutDuration: 90000
    }
} else {
    appSettings = {
        $api_url: "http://apay-test.paymediasolutions.com:5000",
        timeoutDuration: 60000
    }
}

appSettings.canAccessInternally = true
appSettings.internalWebPort = "7027"

appSettings.version = "2.0"
appSettings.year = "2023"

export { appSettings }
