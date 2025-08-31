import type { AxiosInstance } from "axios";
import axios from "axios";

export type MdClientProps = {
  baseURL: string;
}

export class MdApiClient {
  private static instance: MdApiClient;
  private axiosInstance: AxiosInstance;

  private constructor(config: MdClientProps) {
    this.axiosInstance = MdApiClient.createApiClient(config);
  }


  public static createInstace(config: MdClientProps) {
    MdApiClient.instance = new MdApiClient(config);
  }


  static findInstance(): MdApiClient {
    if (!MdApiClient.instance) {
      throw new Error("MdApiClient instance not initialized. Call getInstance() first.");
    }
    return MdApiClient.instance;
  }

  private static createApiClient(config: MdClientProps): AxiosInstance {
    const instance = axios.create({
      baseURL: config.baseURL,
      timeout: 5 * 60 * 1000,
    });
    return instance;
  }

  public get axios(): AxiosInstance {
    return this.axiosInstance;
  }
}
