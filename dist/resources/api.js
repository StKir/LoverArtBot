"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_generation = exports.generate = exports.getModel = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const FormData = require("form-data");
const getModel = () => {
    return axios_1.default
        .get(constants_1.API_URL + "key/api/v1/models", { headers: constants_1.AUTH_HEADERS })
        .then((res) => res)
        .catch((err) => err);
};
exports.getModel = getModel;
const generate = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, style } = props;
    const params = {
        type: "GENERATE",
        numImages: 1,
        width: 1024,
        height: 1024,
        style: "DEFAULT",
        generateParams: {
            query: prompt,
        },
    };
    const data = new FormData();
    const modelIdData = { value: 4, options: { contentType: null } };
    const paramsAData = {
        value: JSON.stringify(params),
        options: { contentType: "application/json" },
    };
    data.append("model_id", modelIdData.value, modelIdData.options);
    data.append("params", paramsAData.value, paramsAData.options);
    const responce = yield axios_1.default.post(constants_1.API_URL + "key/api/v1/text2image/run", data, {
        headers: Object.assign(Object.assign({}, data.getHeaders()), constants_1.AUTH_HEADERS),
    });
    console.log(responce.data.uuid);
    return responce.data.uuid;
});
exports.generate = generate;
const check_generation = (req_id_1, ...args_1) => __awaiter(void 0, [req_id_1, ...args_1], void 0, function* (req_id, attempts = 10) {
    while (attempts > 0) {
        const response = yield axios_1.default
            .get(constants_1.API_URL + "key/api/v1/text2image/status/" + req_id, {
            headers: constants_1.AUTH_HEADERS,
        })
            .then((res) => res.data)
            .catch((err) => err.message);
        if (response.status === "DONE")
            return response;
        if (response.status === "FAIL")
            return {
                error: true,
            };
        yield (0, constants_1.sleep)(10000);
    }
    return "Ошибка";
});
exports.check_generation = check_generation;
