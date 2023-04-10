import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IJobsOffer, SequelizeAttributes } from "@interface";
import {
  getEnumField,
  ENUM_OFFER_STATUS,
  ENUM_LOCATION,
  ENUM_TIMEZONE,
  ENUM_PAY_FREQUENCY,
  ENUM_TERM_OF_HOURS_DURATION,
  ENUM_LEVEL_OF_EXPERIENCE,
  ENUM_OFFER_WITHDRAW_REASON,
  sequelize,
} from "@config";

const tableName = "jobs_offers";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobsOffer> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    job_id: { type: DataTypes.INTEGER },
    client_id: { type: DataTypes.INTEGER },
    company_id: { type: DataTypes.INTEGER },
    freelancer_id: { type: DataTypes.INTEGER },
    welcome_note: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    position: { type: DataTypes.STRING },
    term: { type: DataTypes.STRING },
    experience_level: getEnumField(ENUM_LEVEL_OF_EXPERIENCE, "experience_level"),
    hourly_rate: { type: DataTypes.INTEGER },
    term_of_hours: { type: DataTypes.INTEGER },
    term_of_hours_duration: getEnumField(ENUM_TERM_OF_HOURS_DURATION, "term_of_hours_duration"),
    location: getEnumField(ENUM_LOCATION, "location"),
    pay_frequency: getEnumField(ENUM_PAY_FREQUENCY, "pay_frequency"),
    timezone: getEnumField(ENUM_TIMEZONE, "timezone"),
    contract_start: { type: DataTypes.DATE },
    contract_end: { type: DataTypes.DATE },
    is_ongoing: { type: DataTypes.BOOLEAN },
    requirements: { type: DataTypes.TEXT },
    duties: { type: DataTypes.TEXT },
    primary_skills: { type: DataTypes.STRING },
    secondary_skills: { type: DataTypes.STRING },
    response_due: { type: DataTypes.DATE },
    calendar_link: { type: DataTypes.STRING },
    offered_date: { type: DataTypes.DATE },
    offer_status: getEnumField(ENUM_OFFER_STATUS, "offer_status"),
    withdraw_reason: getEnumField(ENUM_OFFER_WITHDRAW_REASON, "withdraw_reason"),
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobsOffer;
  };

  const JobsOffer: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobsOffer.associate = (models: any) => {
    JobsOffer.belongsTo(models.FreelancerProfile, {
      as: "FreelancerProfile",
      foreignKey: "freelancer_id",
    });
    JobsOffer.belongsTo(models.Company, {
      as: "Company",
      foreignKey: "company_id",
    });
    JobsOffer.belongsTo(models.User, {
      as: "User",
      foreignKey: "freelancer_id",
    });
  };

  return JobsOffer;
};

export const JobsOffer = createDatabase(sequelize);
