import { getLambda, stackName, getStage, isInDevelopment } from "@config";

const invokeLambda = async (functionName: string, payload: any) => {
  // if (isInDevelopment()) return

  await getLambda()
    .invoke({
      FunctionName: `${stackName}-${getStage()}-${functionName}`,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    })
    .promise();
};

const invokeLambdaSync = async (functionName: string, payload: any) => {
  // if (isInDevelopment()) return

  return await getLambda()
    .invoke({
      FunctionName: `${stackName}-${getStage()}-${functionName}`,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(payload),
    })
    .promise();
};

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getValidUrlFormat = (url) => {
  if (isValidHttpUrl(url)) return url;
  return undefined;
};

const splitByAndReturn = (value, splitBy, fieldOrder) => {
  const arr = nullToEmptyString(value).toString().split(splitBy);
  if (arr?.length > fieldOrder) return arr[fieldOrder];

  return "";
};

const getValidAvatarUrl = (value) => {
  if (value === null || value === undefined) return undefined;

  if (value.length <= 2) {
    const number = Number(value);
    if (number < 7) return `https://www.app.outdefine.com/common/avatar/DEFAULT-MAN-${number}.png`;
    if (number < 13) { return `https://www.app.outdefine.com/common/avatar/DEFAULT-WOMEN-${number - 6}.png`; }
  }
  return getValidUrlFormat(value);
};

const getEmploymentTypes = (value) => {
  if (value === null || value === undefined) return "";

  const arr = JSON.parse(value);
  const types = arr?.map((item) => item.value);
  return types.join(", ");
};

const getSkills = (value) => {
  if (value === null || value === undefined) return "";

  const types = value?.map((item) => item.name);
  return types.join(", ");
};

const nullToUndefined = (value) => {
  if (value === null) return undefined;
  return value;
};

const getVettedStatusFromField = (value) => {
  if (value === "TRUSTED") return "Yes";

  return "No";
};

const nullToEmptyString = (value) => {
  if (value === null || value === undefined) return "";
  return value;
};

const getMinimumExperienceLevel = (value) => {
  switch (value) {
    case "Entry-level":
      return 1;
    case "Mid-level":
      return 3;
    case "Senior-level":
      return 5;
    case "Director-level":
      return 7;
  }
  return undefined;
};

const getMaximumExperienceLevel = (value) => {
  const minimumLevel = getMinimumExperienceLevel(value);
  if (minimumLevel === undefined) return undefined;

  return minimumLevel + 3;
};

export {
  invokeLambda,
  invokeLambdaSync,
  isValidHttpUrl,
  getValidUrlFormat,
  nullToEmptyString,
  splitByAndReturn,
  nullToUndefined,
  getVettedStatusFromField,
  getValidAvatarUrl,
  getEmploymentTypes,
  getSkills,
  getMinimumExperienceLevel,
  getMaximumExperienceLevel,
};
