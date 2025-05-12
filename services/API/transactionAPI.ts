import axios from "@/services";
import { TransferType } from "@/services/API/paymentAPI";
import {
  WalletCommand,
  WalletCommandPagingRequest,
} from "@/services/API/walletAPI";
import { StatisticResponse } from "@/types/common";
import { Page, PagingRequest } from "@/types/Paging";

export interface TransactionPagingRequest extends PagingRequest {
  startDate?: string;
  endDate?: string;
  transactionDate?: string;
  transferTypes?: TransferType[];
}

export type Transaction = {
  createdAt: string;
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string;
  content: string;
  transferType: TransferType;
  transferAmount: number;
  referenceCode: string;
  description?: string;
};

const transactionAPI = {
  geTransaction: (
    params: TransactionPagingRequest
  ): Promise<{ data: Transaction[]; page: Page }> => {
    const url = "/payment/api/v1/transactions";
    return axios.get(url, { params });
  },
  getTransactionStatistic: (
    params: TransactionPagingRequest
  ): Promise<{ data: StatisticResponse }> => {
    const url = "/payment/api/v1/transactions/statistics";
    return axios.get(url, { params });
  },

  getWalletCommands: (
    params: WalletCommandPagingRequest
  ): Promise<{ data: WalletCommand[]; page: Page }> => {
    const url = "/payment/api/v1/wallet-commands";
    return axios.get(url, { params });
  },

  getWalletCommandStatistic: (
    params: WalletCommandPagingRequest
  ): Promise<{ data: StatisticResponse }> => {
    const url = "/payment/api/v1/wallet-commands/statistics";
    return axios.get(url, { params });
  },
};

export default transactionAPI;
