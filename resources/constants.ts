import { ConfigService } from "../config/config.service";

const config = new ConfigService();

export const TG_TOKEN = config.get("TGTOKEN");
export const FB_TOKEN = config.get("FBTOKEN");
export const FB_SECRET = config.get("FBSECRET");
export const API_URL = config.get("APIURL");

export const AUTH_HEADERS = {
  "X-Key": `Key ${FB_TOKEN}`,
  "X-Secret": `Secret ${FB_SECRET}`,
};

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
