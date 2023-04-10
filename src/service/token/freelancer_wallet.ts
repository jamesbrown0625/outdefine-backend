import { IWallet } from "@interface";
import { getDB } from "@model";

class FreelancerWalletService {
  async getTable() {
    return (await getDB()).FreelancerWallet;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll();
  }

  async create(item: IWallet) {
    const table = await this.getTable();
    return await table.create(item);
  }

  async deposit({ user_id, amount }) {
    const table = await this.getTable();
    const wallet = await table.findByPk(user_id);
    try {
      if (wallet === null) {
        await table.create({ user_id, balance: amount });
      } else {
        wallet.set({
          balance: wallet.balance + Number(amount),
        });
        await wallet.save();
      }
    } catch (err) {
      throw new Error(`freelancer_wallet deposit: ${err}`);
    }
  }

  async withdraw({ user_id, amount }) {
    const table = await this.getTable();
    const wallet = await table.findByPk(user_id);
    try {
      if (wallet === null) {
        await table.create({ user_id, balance: 0 });
      } else {
        if (wallet.balance < amount) {
          throw new Error("Withdrawal amount is more than balance");
        }
        await wallet.update({
          balance: wallet.balance - amount,
        });
        return wallet.balance;
      }
    } catch (err) {
      throw new Error(`freelancer_wallet withdraw: ${err}`);
    }
    return 0;
  }

  async getBalance(user_id) {
    const table = await this.getTable();
    const wallet = await table.findByPk(user_id);
    if (wallet === null) return 0;
    return wallet.balance;
  }

  async setBalance({ user_id, amount }) {
    const table = await this.getTable();
    const wallet = await table.findByPk(user_id);
    try {
      if (wallet === null) {
        await table.create({ user_id, balance: amount });
      } else {
        wallet.set({
          balance: amount,
        });
        await wallet.save();
      }
    } catch (err) {
      throw new Error(`freelancer_wallet setBalance: ${err}`);
    }
  }
}

export const walletService = new FreelancerWalletService();
