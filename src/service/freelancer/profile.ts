import { getDB } from "@model";
import {
  IFreelancerProfile,
  IFreelancerProfileEducation,
  IFreelancerProfileExperience,
  IFreelancerProfilePortfolio,
} from "@interface";
import {
  freelancerProfileEducationService,
  freelancerProfileExperienceService,
  freelancerProfilePortfolioService,
  userService,
} from "@service";

import CQuery from "src/libs/sequelize/query";
import { invokeLambda } from "@libs";

class FreelancerProfileService {
  async getTable() {
    return (await getDB()).FreelancerProfile;
  }

  async getAll() {
    const table = await this.getTable();
    return table.findAll({
      include: [
        {
          model: (await getDB()).FreelancerProfileEducation,
          as: "FreelancerProfileEducations",
        },
        {
          model: (await getDB()).FreelancerProfileExperience,
          as: "FreelancerProfileExperiences",
        },
        {
          model: (await getDB()).FreelancerProfilePortfolio,
          as: "FreelancerProfilePortfolios",
        },
        {
          model: (await getDB()).FreelancerProfileSocialLink,
          as: "FreelancerProfileSocialLink",
        },
        {
          model: (await getDB()).Skill,
          as: "skills",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async getAllVettedTalent() {
    const table = await this.getTable();
    const where = {
      onboarding_status: "COMPLETED",
    };
    return table.findAll({
      where,
      include: [
        {
          model: (await getDB()).User,
          as: "User",
        },
        {
          model: (await getDB()).Skill,
          as: "skills",
        },
        {
          model: (await getDB()).Role,
          as: "Role",
        },
      ],
    });
  }

  async getAllTalentsWithAssessmentInfo() {
    const table = await this.getTable();
    const where = { onboarding_status: "COMPLETED" };
    return table.findAll({
      where,
      include: [
        {
          model: (await getDB()).User,
          as: "User",
          include: [
            {
              model: (await getDB()).CandidateAssessmentInfo,
              as: "AssessmentInfo",
            },
          ],
        },
        {
          model: (await getDB()).Skill,
          as: "skills",
        },
        {
          model: (await getDB()).Role,
          as: "Role",
        },
      ],
    });
  }

  async createOrGetOne(id: number) {
    let freelancerProfile = await this.getOne(id);
    if (freelancerProfile != null) {
      return freelancerProfile;
    }

    await this.create({ freelancer_id: id });
    freelancerProfile = await this.getOne(id);
    return freelancerProfile;
  }

  async getOneById(id: number) {
    const table = await this.getTable();
    return await table.findByPk(id);
  }

  async getOne(id: number) {
    const table = await this.getTable();
    return await table.findByPk(id, {
      include: [
        {
          model: (await getDB()).FreelancerProfileEducation,
          as: "FreelancerProfileEducations",
        },
        {
          model: (await getDB()).FreelancerProfileExperience,
          as: "FreelancerProfileExperiences",
        },
        {
          model: (await getDB()).FreelancerProfilePortfolio,
          as: "FreelancerProfilePortfolios",
        },
        {
          model: (await getDB()).FreelancerProfileSocialLink,
          as: "FreelancerProfileSocialLink",
        },
        {
          model: (await getDB()).Skill,
          as: "skills",
        },
        {
          model: (await getDB()).Role,
          as: "Role",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }

  async createOneFreelancerProfile(item: IFreelancerProfile) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.freelancer_id);
    if (Profile === null) {
      return await table.create(item);
    }
    throw new Error(`Freelancer profile already exists`);
  }

  async addFreelancerProfileExperience(
    freelancerProfile: any,
    experiences: Array<IFreelancerProfileExperience>,
  ) {
    for (let i = 0; i < experiences.length; i++) {
      const experience: IFreelancerProfileExperience = experiences[i];
      const result = await freelancerProfileExperienceService.create(experience);

      await freelancerProfile.addFreelancerProfileExperience(result.id);
    }
  }

  async addFreelancerProfileEducation(
    freelancerProfile: any,
    educations: Array<IFreelancerProfileEducation>,
  ) {
    for (let i = 0; i < educations.length; i++) {
      const experience: IFreelancerProfileEducation = educations[i];
      const result = await freelancerProfileEducationService.create(experience);

      await freelancerProfile.addFreelancerProfileEducation(result.id);
    }
  }

  async addFreelancerProfilePortfolio(
    freelancerProfile: any,
    portfolio: IFreelancerProfilePortfolio,
  ) {
    const result = await freelancerProfilePortfolioService.create(portfolio);

    await freelancerProfile.addFreelancerProfilePortfolio(result.id);
  }

  async addFreelancerProfilePortfolios(
    freelancerProfile: any,
    portfolios: Array<IFreelancerProfilePortfolio>,
  ) {
    for (let i = 0; i < portfolios.length; i++) {
      const experience: IFreelancerProfilePortfolio = portfolios[i];
      const result = await freelancerProfilePortfolioService.create(experience);

      await freelancerProfile.addFreelancerProfilePortfolio(result.id);
    }
  }

  async create(item: IFreelancerProfileExperience) {
    const table = await this.getTable();
    return table.create(item);
  }

  async updateRecruitSlug(id: number, slug: string) {
    const table = await this.getTable();
    await table.update(
      {
        recruitcrm_slug: slug,
      },
      { where: { freelancer_id: id } },
    );
  }

  async updateTrustedStatus(email: string, status: string) {
    const table = await this.getTable();
    const user = await userService.getOneByEmail(email);
    const Profile = await table.findByPk(user.user_id);

    if (Profile === null) {
      throw new Error("Freelancer profile does not exist");
    }

    await table.update(
      {
        is_trusted_talent: status,
        trusted_date: new Date(),
      },
      { where: { freelancer_id: Profile.freelancer_id } },
    );

    await invokeLambda("candidateUpdatedEventHook", {
      body: JSON.stringify({
        Profile,
      }),
    });
  }

  async update(item: IFreelancerProfile) {
    const table = await this.getTable();
    const Profile = await table.findByPk(item.freelancer_id);
    if (Profile === null) {
      return await table.create(item);
    }
    return await table.update(item, { where: { freelancer_id: item.freelancer_id } });
  }

  // filtering

  async filter(arg) {
    const table = await this.getTable();

    const {
      skip,
      limit,
      role,
      talent_location,
      industry,
      timezone,
      min_hourly,
      max_hourly,
      term,
      location,
      seniority_level,
      visa_sponsor,
    } = arg;

    const where = {
      primary_role: CQuery.existence(role),
      job_type: CQuery.existence(industry),
      level_of_experience: CQuery.existence(seniority_level),
      roles_open_to: CQuery.array_of_string(term),
      hourly_rate: CQuery.between_numbers(min_hourly, max_hourly),
      onboarding_status: "COMPLETED",
    };

    return table.findAll({
      offset: skip,
      limit,
      where,
      include: [
        {
          model: (await getDB()).User,
          as: "User",
        },
        {
          model: (await getDB()).FreelancerProfileEducation,
          as: "FreelancerProfileEducations",
        },
        {
          model: (await getDB()).FreelancerProfileExperience,
          as: "FreelancerProfileExperiences",
        },
        {
          model: (await getDB()).FreelancerProfilePortfolio,
          as: "FreelancerProfilePortfolios",
        },
        {
          model: (await getDB()).FreelancerProfileSocialLink,
          as: "FreelancerProfileSocialLink",
        },
        {
          model: (await getDB()).Skill,
          as: "skills",
        },
        {
          model: (await getDB()).Role,
          as: "PrimaryRole",
        },
        {
          model: (await getDB()).User,
          as: "User",
        },
      ],
    });
  }
}

export const freelancerProfileService = new FreelancerProfileService();
