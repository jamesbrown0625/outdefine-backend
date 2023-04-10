import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerProfile, SequelizeAttributes } from "@interface";
import {
  getEnumField,
  ENUM_YEARS_OF_EXPERIENCE,
  ENUM_LEVEL_OF_EXPERIENCE,
  ENUM_PROFESSION,
  ENUM_ONBOARDING_STATUS,
  ENUM_IS_TRUSTED_TALENT,
  sequelize,
} from "@config";

const tableName = "freelancer_profile";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerProfile> = {
    freelancer_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    recruitcrm_slug: { type: DataTypes.STRING },

    industry_id: { type: DataTypes.INTEGER },
    role: { type: DataTypes.INTEGER },

    years_of_experience: getEnumField(ENUM_YEARS_OF_EXPERIENCE, "years_of_experience"),
    level_of_experience: getEnumField(ENUM_LEVEL_OF_EXPERIENCE, "level_of_experience"),
    hourly_rate: { type: DataTypes.INTEGER },

    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    dial_code: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    english_fluency: { type: DataTypes.STRING },

    profession: getEnumField(ENUM_PROFESSION, "profession"),

    summary: { type: DataTypes.STRING },
    resume: { type: DataTypes.STRING },
    onboarding_status: getEnumField(ENUM_ONBOARDING_STATUS, "onboarding_status"),
    roles_open_to: { type: DataTypes.STRING },
    terms_open_to: { type: DataTypes.STRING },
    assessment_visibility: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    is_trusted_talent: getEnumField(ENUM_IS_TRUSTED_TALENT, "is_trusted_talent"),
    trusted_date: { type: DataTypes.DATE },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerProfile;
  };

  const FreelancerProfile: any = <MyModelStatic>sequelize.define(tableName, attributes);
  FreelancerProfile.associate = (models: any) => {
    FreelancerProfile.hasMany(models.FreelancerProfileExperience, {
      as: "FreelancerProfileExperiences",
      foreignKey: "freelancer_id",
    });
    FreelancerProfile.hasMany(models.FreelancerProfileEducation, {
      as: "FreelancerProfileEducations",
      foreignKey: "freelancer_id",
    });
    FreelancerProfile.hasMany(models.FreelancerProfilePortfolio, {
      as: "FreelancerProfilePortfolios",
      foreignKey: "freelancer_id",
    });
    FreelancerProfile.hasOne(models.FreelancerProfileSocialLink, {
      as: "FreelancerProfileSocialLink",
      foreignKey: "freelancer_id",
    });

    FreelancerProfile.belongsToMany(models.Skill, {
      through: models.FreelancerSkill,
      foreign_key: "freelancer_id",
    });

    FreelancerProfile.hasMany(models.Contract, {
      as: "JobsContract",
      foreign_key: "freelancer_id",
    });
    FreelancerProfile.hasMany(models.InvoiceHistory, {
      foreignKey: "freelancer_id",
    });
    FreelancerProfile.belongsTo(models.JobType, { as: "JobType", foreignKey: "job_type" });
    FreelancerProfile.belongsTo(models.Role, { as: "Role", foreignKey: "role" });
    FreelancerProfile.hasOne(models.User, { as: "User", foreignKey: "user_id" });
  };

  return FreelancerProfile;
};

export const FreelancerProfile = createDatabase(sequelize);
