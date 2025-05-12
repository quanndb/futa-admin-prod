import axios from "@/services";
import { Page, PagingRequest } from "@/types/Paging";
import {
  WalletCommand,
  WalletCommandPagingRequest,
  WalletCommandStatus,
} from "./walletAPI";

export enum TransferType {
  IN = "in",
  OUT = "out",
}

export interface TransactionPagingRequest extends PagingRequest {
  transactionDate?: string;
  transferTypes?: TransferType[];
}

export type Transaction = {
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  id: string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string;
  content: string;
  transferType: TransferType;
  transferAmount: number;
  accumulated: number;
  subAccount: string;
  referenceCode: string;
  description: string;
};

const paymentAPI = {
  getWalletCommand: (
    params: WalletCommandPagingRequest
  ): Promise<{ data: WalletCommand[]; page: Page }> => {
    const url = "/payment/api/v1/wallet-commands";
    return axios.get(url, { params });
  },

  getWalletCommandById: (id: string): Promise<{ data: WalletCommand }> => {
    const url = `/payment/api/v1/wallet-commands/${id}`;
    return axios.get(url);
  },

  resoleWithdraw: (
    id: string,
    status: WalletCommandStatus.REJECTED | WalletCommandStatus.WAIT_TO_PAY
  ): Promise<{ data: WalletCommand }> => {
    const url = `/payment/api/v1/wallet-commands/${id}?status=${status}`;
    return axios.patch(url);
  },

  getTransaction: (
    params: TransactionPagingRequest
  ): Promise<{ data: Transaction[]; page: Page }> => {
    const url = "/payment/api/v1/transactions";
    return axios.get(url, { params });
  },
};

export default paymentAPI;
