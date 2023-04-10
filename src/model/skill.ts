import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ISkill, SequelizeAttributes } from "@interface";

const tableName = "skills";

export default (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ISkill> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(56), allowNull: false },
    role_id: { type: DataTypes.INTEGER },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ISkill
  }

  const Skill: any = <MyModelStatic>sequelize.define(tableName, attributes);
  Skill.associate = (models: any) => {
    Skill.belongsTo(models.Role, { as: "Skills", foreignKey: "role_id" });
    Skill.belongsToMany(models.FreelancerProfile, {
      through: models.FreelancerSkill,
    });
  };

  return Skill;
};
