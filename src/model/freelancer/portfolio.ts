import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerProfilePortfolio, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "freelancer_profile_portfolio";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerProfilePortfolio> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    freelancer_id: { type: DataTypes.INTEGER },
    project_name: { type: DataTypes.STRING },
    project_description: { type: DataTypes.STRING },
    project_links: { type: DataTypes.STRING },
    completed_date: { type: DataTypes.DATE },
    cover_images: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerProfilePortfolio
  }

  const FreelancerProfilePortfolio: any = <MyModelStatic>sequelize.define(tableName, attributes);
  FreelancerProfilePortfolio.associate = (models: any) => {
    FreelancerProfilePortfolio.belongsTo(models.FreelancerProfile, { foreignKey: "freelancer_id" });
  };

  return FreelancerProfilePortfolio;
};

export const FreelancerProfilePortfolio = createDatabase(sequelize);
