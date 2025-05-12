import axios from "@/services";
import { Page, PagingRequest } from "@/types/Paging";

export type MyWalletResponse = {
  userId: string;
  currentBalance: number;
};

export enum WalletAction {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  USING = "USING",
  RETURN = "RETURN",
}

export type WalletHistory = {
  id: string;
  currenBalance: number;
  bankCode?: string;
  accountNumber?: string;
  receiverName?: string;
  amount: number;
  content?: string;
  action: WalletAction;
  createdAt: string;
};

export enum WalletCommandStatus {
  WAIT_TO_RESOLVE = "WAIT_TO_RESOLVE",
  WAIT_TO_PAY = "WAIT_TO_PAY",
  REJECTED = "REJECTED",
  SUCCESS = "SUCCESS",
  RETURNED = "RETURNED",
}

export type WalletCommand = {
  id: string;
  code: string;
  bankCode?: string;
  accountNumber?: string;
  receiverName?: string;
  amount: number;
  status: WalletCommandStatus;
  action: WalletAction;
  createdAt: string;
  createdBy: string;
  handlerId?: string;
  handledAt?: string;
  completedAt?: string;
  paymentLink?: string;
};

export interface WalletHistoryPagingRequest extends PagingRequest {
  actions?: WalletAction[];
  statuses?: WalletCommandStatus[];
  transactionDate?: string;
}

export interface WalletCommandPagingRequest extends PagingRequest {
  actions?: WalletAction[];
  statuses?: WalletCommandStatus[];
  transactionDate?: string;
  startDate?: string;
  endDate?: string;
}

export type WithdrawRequest = {
  amount: number;
  bankCode: string;
  accountNumber: string;
  receiverName: string;
};

const walletAPI = {
  getMyWallet: (): Promise<{ data: MyWalletResponse }> => {
    const url = "/payment/api/v1/me/wallet";
    return axios.get(url);
  },

  getMyWalletHistory: (
    params: WalletHistoryPagingRequest
  ): Promise<{ data: WalletHistory[]; page: Page }> => {
    const url = "/payment/api/v1/me/wallet-histories";
    return axios.get(url, { params });
  },

  getMyWalletCommands: (
    params: WalletCommandPagingRequest
  ): Promise<{ data: WalletCommand[]; page: Page }> => {
    const url = "/payment/api/v1/me/wallet-commands";
    return axios.get(url, { params });
  },

  deposit: (data: { amount: number }): Promise<{ data: WalletCommand }> => {
    const url = "/payment/api/v1/deposits";
    return axios.post(url, data);
  },
  withdraw: (data: WithdrawRequest): Promise<{ data: WalletCommand }> => {
    const url = "/payment/api/v1/withdraws";
    return axios.post(url, data);
  },
  getBanks: (): Promise<{ data: { short_name: string }[] }> => {
    const url = "https://qr.sepay.vn/banks.json";
    return axios.get(url);
  },
};

export default walletAPI;
