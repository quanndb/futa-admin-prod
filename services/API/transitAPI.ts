import axios from "@/services";
import { Page, PagingRequest } from "@/types/Paging";

export type TransitPoint = {
  id: string;
  name: string;
  address: string;
  hotline: string;
  type: TransitPointType;
};

export enum TransitPointType {
  PLACE,
  STATION,
  OFFICE,
  TRANSPORT,
}

export interface TransitPagingRequest extends PagingRequest {
  types?: TransitPointType[];
}

const transitAPI = {
  getTransit: (
    params: TransitPagingRequest
  ): Promise<{ data: TransitPoint[]; page: Page }> => {
    const url = "trip/api/v1/transit-points";
    return axios.get(url, { params });
  },

  create: (data: TransitPoint): Promise<TransitPoint> => {
    const url = "trip/api/v1/transit-points";
    return axios.post(url, data);
  },

  update: (id: string, data: TransitPoint): Promise<TransitPoint> => {
    const url = `trip/api/v1/transit-points/${id}`;
    return axios.post(url, data);
  },

  delete: (id: string): Promise<void> => {
    const url = `trip/api/v1/transit-points/${id}`;
    return axios.delete(url);
  },
};

export default transitAPI;
