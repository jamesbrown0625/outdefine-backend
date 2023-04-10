import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IJobsPosted, SequelizeAttributes } from "@interface";
import {
  getEnumField,
  ENUM_LOCATION,
  ENUM_TERM,
  ENUM_LEVEL_OF_EXPERIENCE,
  ENUM_TIMEZONE,
  ENUM_JOBPOSTING_STATUS,
  ENUM_NUMBER_OF_HIRES,
  sequelize,
} from "@config";

const tableName = "jobs_posts";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobsPosted> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    client_id: { type: DataTypes.INTEGER },
    company_id: { type: DataTypes.INTEGER },
    recruiter: { type: DataTypes.INTEGER },
    recruitcrm_slug: { type: DataTypes.STRING },
    company_name: { type: DataTypes.STRING },
    job_title: { type: DataTypes.STRING },
    status: getEnumField(ENUM_JOBPOSTING_STATUS, "status"),
    number_of_hires: getEnumField(ENUM_NUMBER_OF_HIRES, "number_of_hires"),
    date_posted: { type: DataTypes.DATE },
    date_last_activated: { type: DataTypes.DATE },
    hourly_max_rate: { type: DataTypes.INTEGER },
    hourly_min_rate: { type: DataTypes.INTEGER },
    experience_level: getEnumField(ENUM_LEVEL_OF_EXPERIENCE, "experience_level"),
    location: getEnumField(ENUM_LOCATION, "location"),
    term: getEnumField(ENUM_TERM, "term"),
    weekly_hours: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    looking_for_description: { type: DataTypes.TEXT },
    duties: { type: DataTypes.TEXT },
    skill_names: { type: DataTypes.TEXT },
    primary_skills: { type: DataTypes.STRING },
    secondary_skills: { type: DataTypes.STRING },
    visa_sponsor: { type: DataTypes.BOOLEAN },
    timezone: getEnumField(ENUM_TIMEZONE, "timezone"),
    contactor_id: { type: DataTypes.INTEGER },
    contact_email: { type: DataTypes.STRING },
    company_number: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    benefits: { type: DataTypes.STRING },
    actively_hiring: { type: DataTypes.BOOLEAN },
    draft: { type: DataTypes.BOOLEAN, defaultValue: false },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobsPosted
  }

  const JobPosting: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobPosting.associate = (models: any) => {
    JobPosting.hasOne(models.JobApplication, { foreignKey: "job_id" });
    JobPosting.hasOne(models.SavedJobs, { foreignKey: "job_id" });
    JobPosting.belongsTo(models.Company, {
      as: "Company",
      foreignKey: "company_id",
    });
    JobPosting.belongsTo(models.ClientProfile, {
      as: "ClientProfile",
      foreignKey: "client_id",
    });
  };

  return JobPosting;
};

export const JobPosting = createDatabase(sequelize);
