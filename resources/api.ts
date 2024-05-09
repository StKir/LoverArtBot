import axios from "axios";
import { API_URL, AUTH_HEADERS, FB_SECRET, FB_TOKEN, sleep } from "./constants";
const FormData = require("form-data");

interface IGenerateProps {
  prompt: string;
  style?: string;
}

export const getModel = () => {
  return axios
    .get(API_URL + "key/api/v1/models", { headers: AUTH_HEADERS })
    .then((res) => res)
    .catch((err) => err);
};

export const generate = async (props: IGenerateProps) => {
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
  const responce = await axios.post(
    API_URL + "key/api/v1/text2image/run",
    data,
    {
      headers: {
        ...data.getHeaders(),
        ...AUTH_HEADERS,
      },
    }
  );

  console.log(responce.data.uuid);
  return responce.data.uuid;
};

export const check_generation = async (
  req_id: string,
  attempts: number = 10
) => {
  while (attempts > 0) {
    const response = await axios
      .get(API_URL + "key/api/v1/text2image/status/" + req_id, {
        headers: AUTH_HEADERS,
      })
      .then((res) => res.data)
      .catch((err) => err.message);

    if (response.status === "DONE") return response;
    if (response.status === "FAIL")
      return {
        error: true,
      };

    await sleep(10000);
  }
  return "Ошибка";
};
