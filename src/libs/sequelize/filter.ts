import { IJobsPosted } from "@interface";
import { QueryType } from "src/service/job/job_post";

const arrayToLowercaseArray = (arr: string[]) => {
  return arr.map((elem) => elem.toLocaleLowerCase());
};

export default function filterJobPosting(posting: IJobsPosted, filters: QueryType) {
  const skill_names = posting?.skill_names?.split(",");

  if (
    filters?.query && (posting?.job_title || skill_names.length)
  ) {
    return filters?.query.toLowerCase().includes(posting?.job_title) || posting?.job_title.toLowerCase().includes(filters?.query.toLowerCase()) || skill_names?.some((item) => filters?.query.toLowerCase().includes(item.toLowerCase())) || skill_names?.some((item) => item.toLowerCase().includes(filters?.query.toLowerCase()));
  }

  if (
    filters?.experience_level !== undefined &&
    filters?.experience_level?.length !== 0 &&
    !arrayToLowercaseArray(filters?.experience_level).includes(
      posting.experience_level.toLowerCase(),
    )
  ) {
    return false;
  }

  if (
    filters?.location !== undefined &&
    filters?.location?.length !== 0 &&
    !arrayToLowercaseArray(filters?.location).includes(posting?.location?.toLowerCase())
  ) {
    // console.log('location false', filters.location)
    return false;
  }

  if (
    filters?.terms !== undefined &&
    filters?.terms?.length !== 0 &&
    !arrayToLowercaseArray(filters?.terms).includes(posting?.term?.toLowerCase())
  ) {
    // console.log('terms false', filters.terms)
    return false;
  }

  if (
    filters?.timezone !== undefined &&
    filters?.timezone?.length !== 0 &&
    !arrayToLowercaseArray(filters?.timezone).includes(posting?.timezone?.toLowerCase())
  ) {
    // console.log('timezone false', filters.timezone, posting.timezone)
    return false;
  }

  if (filters?.visa_sponsor !== undefined && filters?.visa_sponsor != posting?.visa_sponsor) {
    return false;
  }

  // filter 10 - 20
  // posting 15 - 19

  if (filters.hourly_max_rate === undefined || filters.hourly_min_rate === undefined) return true;

  if (
    (filters?.hourly_min_rate <= posting.hourly_min_rate &&
      posting.hourly_max_rate <= filters.hourly_max_rate) || (filters?.hourly_min_rate >= posting.hourly_min_rate &&
        posting.hourly_max_rate >= filters.hourly_max_rate)
  ) {
    return true;
  }

  return false;
}
