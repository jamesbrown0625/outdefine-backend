const safeJsonArray = (
  value: string | undefined | null | number[],
): Array<any> => {
  if (Array.isArray(value)) return value;
  if (value === "" || value === undefined || value === null) {
    return [];
  }
  try {
    const jsonArrary = JSON.parse(value);
    if (!Array.isArray(jsonArrary)) return [];
    return jsonArrary;
  } catch (e) {
    return [];
  }
};

const getSkillNameFromID = (
  skills: any,
  id: number,
): string => {
  return skills.find((skill) => skill.id === id)?.name ?? "";
};

const getSkillNamesFromIDs = (
  skills: any,
  id_array: Array<number>,
): string[] => {
  return id_array?.map((id: number) => getSkillNameFromID(skills, id));
};

export { safeJsonArray, getSkillNameFromID, getSkillNamesFromIDs };
