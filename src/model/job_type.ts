import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IJobType, SequelizeAttributes } from "@interface";

const tableName = "job_type";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IJobType> = {
    job_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(64) },
    active: { type: DataTypes.BOOLEAN },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IJobType
  }

  const JobType: any = <MyModelStatic>sequelize.define(tableName, attributes);
  JobType.associate = (models: any) => {
    JobType.hasMany(models.Role);
    JobType.belongsTo(models.AssessmentTestBank);
    JobType.hasMany(models.FreelancerProfile, { foreignKey: "job_type" });
  };

  return JobType;
};
