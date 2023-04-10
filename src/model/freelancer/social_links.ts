import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IFreelancerProfileSocialLink, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "freelancer_profile_social_link";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IFreelancerProfileSocialLink> = {
    freelancer_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    github_link: { type: DataTypes.STRING() },
    linkedin_link: { type: DataTypes.STRING() },
    website_link: { type: DataTypes.STRING() },
    talent_source: { type: DataTypes.STRING() },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IFreelancerProfileSocialLink;
  };

  const FreelancerProfileSocialLink: any = <MyModelStatic>sequelize.define(tableName, attributes);
  FreelancerProfileSocialLink.associate = (models: any) => {
    FreelancerProfileSocialLink.belongsTo(models.FreelancerProfile, {
      foreignKey: "freelancer_id",
    });
  };

  return FreelancerProfileSocialLink;
};

export const FreelancerProfileSocialLink = createDatabase(sequelize);
