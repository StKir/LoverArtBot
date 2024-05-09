import { DotenvParseOutput, config } from "dotenv";
import { IConfigService } from "../intefaces/config.interface";

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();

    if (error) {
      throw new Error("Нет доступа");
    }

    if (!parsed) {
      throw new Error("Нет доступа");
    }

    this.config = parsed;
  }
  get(key: string): string {
    const res = this.config[key];
    if (!res) {
      throw new Error("Env не найден");
    }

    return res;
  }
}
