import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ICompanySocialLink, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "company_social_link";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ICompanySocialLink> = {
    company_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    linkedin_link: { type: DataTypes.STRING },
    twitter_link: { type: DataTypes.STRING },
    instagram_link: { type: DataTypes.STRING },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICompanySocialLink
  }

  const CompanySocialLink: any = <MyModelStatic>sequelize.define(tableName, attributes);
  CompanySocialLink.associate = (models: any) => {
    CompanySocialLink.belongsTo(models.Company, { foreignKey: "company_id" });
  };

  return CompanySocialLink;
};

export const CompanySocialLink = createDatabase(sequelize);
