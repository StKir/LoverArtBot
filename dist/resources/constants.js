"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.AUTH_HEADERS = exports.API_URL = exports.FB_SECRET = exports.FB_TOKEN = exports.TG_TOKEN = void 0;
const config_service_1 = require("../config/config.service");
const config = new config_service_1.ConfigService();
exports.TG_TOKEN = config.get("TGTOKEN");
exports.FB_TOKEN = config.get("FBTOKEN");
exports.FB_SECRET = config.get("FBSECRET");
exports.API_URL = config.get("APIURL");
exports.AUTH_HEADERS = {
    "X-Key": `Key ${exports.FB_TOKEN}`,
    "X-Secret": `Secret ${exports.FB_SECRET}`,
};
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
