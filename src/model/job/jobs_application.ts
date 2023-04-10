import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IJobsApplied, SequelizeAttributes } from "@interface";
import { getEnumField, ENUM_APPLICATION_STATUS, sequelize } from "@config";

const tableName = "jobs_application";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobsApplied> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER },
    company_id: { type: DataTypes.INTEGER },
    job_id: { type: DataTypes.INTEGER },
    applied_date: { type: DataTypes.DATE },
    cover_letter: { type: DataTypes.TEXT },
    application_status: getEnumField(ENUM_APPLICATION_STATUS, "application_status"),
    rate_quoted: { type: DataTypes.INTEGER },
    boosted: { type: DataTypes.BOOLEAN },
    token_amount: { type: DataTypes.INTEGER },
    start_date: { type: DataTypes.DATE },
    is_invited: { type: DataTypes.BOOLEAN },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobsApplied
  }

  const JobApplication: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobApplication.associate = (models: any) => {
    JobApplication.belongsTo(models.JobPosting, { as: "PostedJobs", foreignKey: "job_id" });
    // JobsPosted.hasOne(models.Company, { foreignKey: 'company_id' })
    JobApplication.belongsTo(models.User, { as: "User", foreignKey: "freelancer_id" });
    JobApplication.belongsTo(models.FreelancerProfile, {
      as: "FreelancerProfile",
      foreignKey: "freelancer_id",
    });
  };

  return JobApplication;
};

export const JobApplication = createDatabase(sequelize);
