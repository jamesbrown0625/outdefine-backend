import { IJobsOffer } from "@interface";
import { formatJSONResponse } from "@libs";
import { getDB } from "@model";

class JobOfferService {
  async getTable() {
    return (await getDB()).JobsOffer;
  }

  async getOffersById(from: string, id: number) {
    const table = await this.getTable();

    return table.findAll({
      where: from === "freelancer" ? { freelancer_id: id } : { company_id: id },
      include: [
        {
          model: (await getDB()).Company,
          as: "Company",
          include: [
            {
              model: (await getDB()).CompanySocialLink,
              as: "CompanySocialLink",
            },
          ],
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
        {
          model: (await getDB()).FreelancerProfile,
          as: "FreelancerProfile",
          include: [
            {
              model: (await getDB()).Skill,
              as: "skills",
            },
          ],
        },
      ],
    });
  }

  async create(item: IJobsOffer) {
    const table = await this.getTable();
    return table.create(item);
  }

  async withdraw(id: number, company_id: number, withdraw_reason: string) {
    const table = await this.getTable();
    const offer = await table.findOne({ where: { id, company_id } });
    if (!offer) {
      return formatJSONResponse({
        status: 500,
        message: `Error Occurred: Offer not founds`,
      });
    }

    await offer.update({ offer_status: "WITHDRAWN", withdraw_reason });
    await offer.save();
  }

  async addressAnOffer(id: number, company_id: number, freelancer_id: number, method: string) {
    const table = await this.getTable();
    const offer = await table.findOne({ where: { id, company_id, freelancer_id } });

    if (!offer) {
      throw new Error("Offer not exists");
    }

    if (offer.offer_status === "WITHDRAWN") {
      throw new Error("Already withdrawn by clients");
    }

    if (offer.offer_status !== "OFFERED") {
      throw new Error(`Can't update the offer status, current status: ${offer.offer_status}`);
    }

    await offer.update({ offer_status: method });
    await offer.save();

    return offer;
  }

  async fillMockData() {
    const table = await this.getTable();
    const count = 20;
    for (let i = 0; i < count; i++) {
      const random = Math.random() * 100;
      await table.create({
        client_id: Math.floor(random % 10) + 1,
        company_id: Math.floor(random % 10) + 1,
        freelancer_id: Math.floor(random % 3) + 1,
        job_id: Math.floor(random % 20) + 1,
        offered_date: new Date().toLocaleString(),
        offer_status: "OFFERED",
      });
    }
  }
}

export const jobOfferService = new JobOfferService();
