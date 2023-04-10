import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { IHackerearthReportLog, SequelizeAttributes } from "@interface";
import { sequelize } from "@config";

const tableName = "hackerearth_report_logs";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IHackerearthReportLog> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    assessment_id: { type: DataTypes.INTEGER },
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
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IHackerearthReportLog
  }

  const HackerearthReportLog: any = <MyModelStatic>sequelize.define(tableName, attributes);
  HackerearthReportLog.associate = (models: any) => {
    HackerearthReportLog.belongsTo(models.CandidateAssessmentInfo, {
      as: "HackerearthReportLogs",
      foreignKey: "assessment_id",
    });
  };

  return HackerearthReportLog;
};

export const HackerearthReportLog = createDatabase(sequelize);
