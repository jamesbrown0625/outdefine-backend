import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IRole, SequelizeAttributes } from "@interface";

const tableName = "roles";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IRole> = {
    role_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    job_type_id: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING(64) },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IRole;
  };

  const Role: any = <MyModelStatic>sequelize.define(tableName, attributes);
  Role.associate = (models: any) => {
    Role.hasMany(models.Skill, { foreignKey: "role_id" });
    Role.hasMany(models.FreelancerProfile, { foreignKey: "role" });
    Role.belongsTo(models.FreelancerProfileExperience);
    Role.belongsTo(models.AssessmentTestBank);
    Role.belongsTo(models.JobType, { as: "Roles", foreignKey: "job_type_id" });
  };

  return Role;
};
