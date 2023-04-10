import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IHackerearthReport, SequelizeAttributes } from "@interface";
import { getEnumField, sequelize, ENUM_HACKEREARTH_TEST } from "@config";

const tableName = "hackerearth_detail";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IHackerearthReport> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    assessment_id: { type: DataTypes.INTEGER, allowNull: false },
    type: getEnumField(ENUM_HACKEREARTH_TEST, "type"), // MCQ report or coding test report
    test_id: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    start_datetime: { type: DataTypes.STRING },
    finish_datetime: { type: DataTypes.STRING },
    time_taken: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    percentage: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING },
    questions_attempted: { type: DataTypes.INTEGER },
    problem_type_scores: { type: DataTypes.STRING },
    section_scores: { type: DataTypes.STRING },
    full_report_url: { type: DataTypes.STRING },
    candidate_assessment_report_url: { type: DataTypes.STRING },
    anon_report_url: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    institute: { type: DataTypes.STRING },
    graduation_year: { type: DataTypes.STRING },
    candidate_id: { type: DataTypes.STRING },
    custom_details: { type: DataTypes.STRING },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IHackerearthReport;
  };

  const HackerearthReport: any = <MyModelStatic>sequelize.define(tableName, attributes);
  // HackerearthReport.associate = (models: any) => {
  // HackerearthReport.belongsTo(models.AssessmentTestBank, { foreignKey: 'test_id' })
  // };

  return HackerearthReport;
};

export const HackerearthReport = createDatabase(sequelize);
