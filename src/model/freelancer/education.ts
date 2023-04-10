import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerProfileEducation, SequelizeAttributes } from "@interface";
import { getEnumField, ENUM_DEGREES, ENUM_EDUCATIN_TYPE, sequelize } from "@config";

const tableName = "freelancer_profile_education";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerProfileEducation> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    major: { type: DataTypes.STRING },
    degree: getEnumField(ENUM_DEGREES, "degree"),
    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },
    self_taught: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerProfileEducation
  }

  const FreelancerProfileEducation: any = <MyModelStatic>sequelize.define(tableName, attributes);
  FreelancerProfileEducation.associate = (models: any) => {
    FreelancerProfileEducation.belongsTo(models.FreelancerProfile, { foreignKey: "freelancer_id" });
  };

  return FreelancerProfileEducation;
};

export const FreelancerProfileEducation = createDatabase(sequelize);
