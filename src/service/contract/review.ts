import { getDB } from "@model";
import { IReview } from "src/interface/contract/IReview";

class ReviewService {
  async getTable() {
    return (await getDB()).ContractReview;
  }

  async getAllByDirection(direction: "C2F" | "F2C") {
    const table = await this.getTable();

    return await table.getAll({
      where: {
        direction,
      },
    });
  }

  async getAllReviewsForACompany(company_id: number) {
    const table = await this.getTable();

    return await table.getAll({
      where: {
        company_id,
        direction: "F2C",
      },
    });
  }

  async getAllReviewsForAFreelancer(freelancer_id: number) {
    const table = await this.getTable();

    return await table.getAll({
      where: {
        freelancer_id,
        direction: "C2F",
      },
    });
  }

  async leaveAReviewForAFreelancer(data: IReview) {
    const table = await this.getTable();

    return table.create({ ...data, direction: "C2F" });
  }

  async leaveAReviewForACompany(data: IReview) {
    const table = await this.getTable();

    return table.create({ ...data, direction: "C2F" });
  }

  async checkReviewExistence(
    company_id: string,
    freelancer_id: string,
    contract_id: string,
    direction: "C2F" | "F2C",
  ) {
    const table = await this.getTable();

    return table.findOne({
      where: {
        company_id,
        freelancer_id,
        contract_id,
        direction,
      },
    });
  }
}

export const reviewService = new ReviewService();
