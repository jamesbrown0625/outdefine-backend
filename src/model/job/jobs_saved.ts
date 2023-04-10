import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IJobsSaved, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "jobs_save";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobsSaved> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER },
    job_id: { type: DataTypes.INTEGER },
    saved_date: { type: DataTypes.DATE },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobsSaved
  }

  const JobsSaved: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobsSaved.associate = (models: any) => {
    JobsSaved.belongsTo(models.JobPosting, { as: "PostedJobs", foreignKey: "job_id" });
    // JobsPosted.hasOne(models.Company, { foreignKey: 'company_id' })
  };

  return JobsSaved;
};

export const SavedJobs = createDatabase(sequelize);
