import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { ICandidateAssessmentInfo, SequelizeAttributes } from "@interface";
import { getEnumField, ENUM_ASSESSMENT_TYPE, sequelize, ENUM_ASSESSMENT_STATUS } from "@config";

const tableName = "candidate_assessment_info";

const createDatabase = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<ICandidateAssessmentInfo> = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    introduction_status: {
      ...getEnumField(ENUM_ASSESSMENT_STATUS, "introduction_status"),
      defaultValue: ENUM_ASSESSMENT_STATUS[0],
      allowNull: false,
    },
    hackerearth_status: {
      ...getEnumField(ENUM_ASSESSMENT_STATUS, "hackerearth_status"),
      defaultValue: ENUM_ASSESSMENT_STATUS[0],
      allowNull: false,
    },
    interview_status: {
      ...getEnumField(ENUM_ASSESSMENT_STATUS, "interview_status"),
      defaultValue: ENUM_ASSESSMENT_STATUS[0],
      allowNull: false,
    },
    manually_passed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },

    // Admin assessed fields
    notes_taken: { type: DataTypes.TEXT },
    rating: { type: DataTypes.STRING },
    coding_skills: { type: DataTypes.STRING },
    technical_skills: { type: DataTypes.STRING },
    interview_technical_skills: { type: DataTypes.STRING },

    // Hackerearth, Record
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    confirmed_type: getEnumField(ENUM_ASSESSMENT_TYPE, "confirmed_type"),
    confirmed_id: { type: DataTypes.INTEGER }, // role id or test id
    mcq_passed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    mcq_taken_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    mcq_url: { type: DataTypes.STRING },

    coding_test_id: { type: DataTypes.INTEGER }, // test id incase of engineer
    coding_passed: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    coding_taken_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    coding_url: { type: DataTypes.STRING },

    // Cal.com Schedule Fields
    booking_uid: { type: DataTypes.STRING, defaultValue: "" },

    /**
     * @notice unnecessary fields for new assessment experience!
     */
    // portfolio_link: { type: DataTypes.STRING },
    // recorded_video_link: { type: DataTypes.STRING },
    // experience_summary: { type: DataTypes.STRING },
  };

  type MyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ICandidateAssessmentInfo;
  };

  const CandidateAssessmentInfo: any = <MyModelStatic>sequelize.define(tableName, attributes);
  CandidateAssessmentInfo.associate = (models: any) => {
    CandidateAssessmentInfo.hasMany(models.HackerearthReportLog, {
      as: "HackerearthReportLog",
    });
    CandidateAssessmentInfo.belongsTo(models.User, {
      targetKey: "email_id",
      foreignKey: "email",
    });
  };

  return CandidateAssessmentInfo;
};

export const CandidateAssessmentInfo = createDatabase(sequelize);
