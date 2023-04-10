import { IFreelancerProfileSocialLink } from "@interface";
import { getDB } from "@model";

class FreelancerProfileSocialLinkService {
  async getTable() {
    return (await getDB()).FreelancerProfileSocialLink;
  }

  async getOneById(id: number): Promise<IFreelancerProfileSocialLink> {
    const table = await this.getTable();
    const Profile = await table.findByPk(id);
    if (Profile === null) {
      await table.create({
        freelancer_id: id,
      });
    }

    return await table.findByPk(id);
  }

  async update(item: IFreelancerProfileSocialLink) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.freelancer_id);
    if (Profile === null) {
      return await table.create(item);
    }
    return await table.update(item, { where: { freelancer_id: item.freelancer_id } });
  }
}

export const freelancerProfileSocialLinkService = new FreelancerProfileSocialLinkService();
