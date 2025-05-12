import { Page, PagingRequest } from "@/lib/types/Paging";
import axios from "@/services";

export type Route = {
  id: string;
  departure: string;
  departureId: string;
  destination: string;
  destinationId: string;
  distance: number;
  duration: number;
};

export interface RoutePageRequest extends PagingRequest {
  departureKeyword?: string;
  destinationKeyword?: string;
}

const routeAPI = {
  getRoutes: (
    params: RoutePageRequest
  ): Promise<{ data: Route[]; page: Page }> => {
    const url = "trip/api/v1/routes";
    return axios.get(url, { params });
  },
};

export default routeAPI;
