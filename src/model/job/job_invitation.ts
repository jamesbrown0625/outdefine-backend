import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IJobsApplied, SequelizeAttributes, IJobInvitation } from "@interface";
import { sequelize } from "@config";

const tableName = "jobs_invitation";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobInvitation> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER },
    company_id: { type: DataTypes.INTEGER },
    job_id: { type: DataTypes.INTEGER },
    link: { type: DataTypes.STRING },
    introduction: { type: DataTypes.TEXT },
    is_declined: { type: DataTypes.BOOLEAN, defaultValue: false },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobsApplied
  }

  const JobInvitation: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobInvitation.associate = (models: any) => {
    JobInvitation.belongsTo(models.JobPosting, { as: "PostedJobs", foreignKey: "job_id" });
    // JobsPosted.hasOne(models.Company, { foreignKey: 'company_id' })
    JobInvitation.belongsTo(models.User, { as: "User", foreignKey: "freelancer_id" });
    JobInvitation.belongsTo(models.FreelancerProfile, {
      as: "FreelancerProfile",
      foreignKey: "freelancer_id",
    });
  };

  return JobInvitation;
};

export const JobInvitation = createDatabase(sequelize);
