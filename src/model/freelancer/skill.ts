import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerSkill, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "freelancer_skill";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerSkill> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerSkill
  }

  const FreelancerSkill: any = <MyModelStatic>sequelize.define(tableName, attributes);

  return FreelancerSkill;
};

export const FreelancerSkill = createDatabase(sequelize);
