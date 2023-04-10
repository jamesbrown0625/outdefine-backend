import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { SequelizeAttributes } from "@interface";
import {
  getEnumField,
  ENUM_CONTRACT_STATUS,
  ENUM_TERM_OF_HOURS_DURATION,
  ENUM_LOCATION,
  ENUM_PAY_FREQUENCY,
  ENUM_TIMEZONE,
  sequelize,
  ENUM_LEVEL_OF_EXPERIENCE,
  ENUM_TERM,
} from "@config";

const tableName = "jobs_contracts";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobsContract> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    offer_id: { type: DataTypes.INTEGER },
    company_id: { type: DataTypes.INTEGER },
    freelancer_id: { type: DataTypes.INTEGER },
    position: { type: DataTypes.STRING },
    hourly_rate: { type: DataTypes.INTEGER },
    term_of_hours: { type: DataTypes.INTEGER },
    term_of_hours_duration: getEnumField(ENUM_TERM_OF_HOURS_DURATION, "term_of_hours_duration"),
    location: getEnumField(ENUM_LOCATION, "location"),
    pay_frequency: getEnumField(ENUM_PAY_FREQUENCY, "pay_frequency"),
    timezone: getEnumField(ENUM_TIMEZONE, "timezone"),
    contract_start: { type: DataTypes.DATE },
    contract_end: { type: DataTypes.DATE },
    is_ongoing: { type: DataTypes.BOOLEAN },
    experience_level: getEnumField(ENUM_LEVEL_OF_EXPERIENCE, "experience_level"),
    term: getEnumField(ENUM_TERM, "term"),
    duties: { type: DataTypes.STRING },
    primary_skills: { type: DataTypes.STRING },
    secondary_skills: { type: DataTypes.STRING },

    contract_status: getEnumField(ENUM_CONTRACT_STATUS, "contract_status"),
    inactivated_date: { type: DataTypes.DATE },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobsContract;
  };

  const JobsContract: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobsContract.associate = (models: any) => {
    JobsContract.belongsTo(models.Company, { as: "Company", foreignKey: "company_id" });
    JobsContract.belongsTo(models.FreelancerProfile, {
      as: "FreelancerProfile",
      foreignKey: "freelancer_id",
    });
    JobsContract.belongsTo(models.User, {
      as: "User",
      foreignKey: "freelancer_id",
    });
  };

  return JobsContract;
};

export const Contract = createDatabase(sequelize);
