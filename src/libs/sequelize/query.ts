import sequelize from "sequelize";
const { Op } = require("sequelize");

const getLikeQuery = (columnName: string, lookupValue: string) => {
  return sequelize.where(
    sequelize.fn("LOWER", sequelize.col(columnName)),
    "LIKE",
    "%" + lookupValue.toLowerCase() + "%",
  );
};

const array_of_num = (arg: Array<any> | undefined) => {
  return arg
    ? {
        [Op.or]: arg.map((term) => {
          return {
            [Op.contains]: [term],
          };
        }),
      }
    : {
        [Op.not]: null,
      };
};

const array_of_string = (arg: Array<string> | undefined) => {
  return arg
    ? {
        [Op.or]: arg.map((term) => {
          return {
            [Op.eq]: term,
          };
        }),
      }
    : {
        [Op.not]: null,
      };
};

const array_of_string_allow_null = (arg: Array<string> | undefined) => {
  return arg
    ? {
        [Op.or]: arg.map((term) => {
          return {
            [Op.eq]: term,
          };
        }),
      }
    : {};
};

const greater_than = (arg: number, dependency: boolean) => {
  return dependency
    ? {
        [Op.gte]: arg,
      }
    : { [Op.not]: null };
};

const less_than = (arg: number, dependency: boolean) => {
  return dependency
    ? {
        [Op.lte]: arg,
      }
    : { [Op.not]: null };
};

const existence = (arg: any | undefined) => {
  return arg !== undefined
    ? arg
    : {
        [Op.not]: null,
      };
};

const date_in_range = (startDate: string, endDate: string) => {
  return {
    [Op.gte]: startDate,
    [Op.lte]: endDate,
  };
};

const between_numbers = (min?: number, max?: number) => {
  if (min === undefined && max === undefined) {
    return {
      [Op.not]: null,
    };
  }
  if (min !== undefined && max !== undefined) {
    return {
      [Op.gte]: min,
      [Op.lte]: max,
    };
  }

  return min === undefined
    ? {
        [Op.lte]: max,
      }
    : {
        [Op.gte]: min,
      };
};

const ConditionalQuery = {
  getLikeQuery,
  existence,
  less_than,
  greater_than,
  array_of_num,
  array_of_string,
  date_in_range,
  between_numbers,
  array_of_string_allow_null,
};

export default ConditionalQuery;
