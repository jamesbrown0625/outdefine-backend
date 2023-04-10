import { IJobsPosted } from "@interface";
import { QueryType } from "src/service/job/job_post";
import wd from "wink-distance";
import nlp from "wink-nlp-utils";

const getRankingScore = (job: IJobsPosted, query: QueryType) => {
  // const skill_score = getSkillMatchScore(job.primary_skills, query.primary_skills)
  const rate_score = getRateMatchScore(
    job.hourly_min_rate,
    job.hourly_max_rate,
    query.hourly_min_rate,
    query.hourly_max_rate,
  );

  const term_score = getTermMatchScore(job.term, query.terms);
  const visa_score = getVisaMatchScore(job.visa_sponsor, query.visa_sponsor);
  const experience_score = getExperienceMatchScore(job.experience_level, query.experience_level);
  const timezone_score = getTimezoneMatchScore(job.timezone, query.timezone);

  return (
    (term_score * config.term_weight +
      rate_score * config.rate_weight +
      visa_score * config.visa_weight +
      experience_score * config.exp_weight +
      timezone_score * config.timezone_weight) /
    (config.term_weight +
      config.rate_weight +
      config.visa_weight +
      config.exp_weight +
      config.timezone_weight)
  );
};

const getSkillMatchScore = (skills_in_job: Array<number>, skills_in_query: Array<number>) => {
  if (!skills_in_query) return 1;
  const overlap = skills_in_job.filter((value) => skills_in_query.includes(value));
  const mismatch_count = skills_in_query.length - overlap.length;

  return Math.max(
    0,
    overlap.length / skills_in_job.length - config.skill_subweight * mismatch_count,
  );
};

const getExperienceMatchScore = (exp_in_job: string, exps_in_query: Array<string>) => {
  if (!exps_in_query) return 1;
  return exps_in_query.includes(exp_in_job) ? 1 : 0;
};

const getTimezoneMatchScore = (timezone_in_job: string, timezones_in_query: Array<string>) => {
  if (!timezones_in_query) return 1;
  return timezones_in_query.includes(timezone_in_job) ? 1 : 0;
};

const getVisaMatchScore = (visa_in_job: boolean, visa_in_query?: boolean) => {
  if (visa_in_query === undefined) return 1;
  return visa_in_job === visa_in_query ? 1 : 0;
};

const getRateMatchScore = (
  min_rate: number, // 50
  max_rate: number, // 90
  qmin_rate: number, // 30
  qmax_rate: number, // 60
) => {
  const bool_includes = min_rate <= qmin_rate && max_rate >= qmax_rate;
  const len_rate = max_rate - min_rate;
  const len_qrate = qmax_rate - qmin_rate;
  const len_overlap = Math.min(qmax_rate, max_rate) - Math.max(qmin_rate, min_rate);

  if (bool_includes) {
    return 1 - (1 - len_qrate / len_rate) * config.rate_subweight;
  }
  if (len_overlap < 0) {
    return 0;
  }
  return (2 * len_overlap) / (len_rate + len_qrate);
};

const getTermMatchScore = (term_in_job: string, terms_in_query: Array<string>) => {
  if (!terms_in_query) return 1;
  return terms_in_query.includes(term_in_job) ? 1 : 0;
};

const sortByScore = (jobs: Array<any>) => {
  const _jobs = jobs.sort((a, b) => b.score - a.score);
  return _jobs;
};

const config = {
  skill_weight: 0.6,
  term_weight: 0.4,
  rate_weight: 1,
  visa_weight: 0.3,
  exp_weight: 0.3,
  timezone_weight: 0.5,
  skill_subweight: 0.03,
  rate_subweight: 0.1,
  term_subweight: 0.02,
};

const getCosineSimilarity = (query: any, item:any) => {
  const skill_score = wd.bow.cosine(nlp.tokens.bagOfWords(query?.toLowerCase().split(" ")), nlp.tokens.bagOfWords(item?.skill_names?.toLowerCase().split(",")));
  const job_score = wd.bow.cosine(nlp.tokens.bagOfWords(query?.toLowerCase().split(" ")), nlp.tokens.bagOfWords(item?.job_title.toLowerCase()));
  return Math.min(skill_score, job_score);
};

const getProfileSimilarity = (profile, item) => {
  const skill_score =
    (profile?.skills &&
      profile?.skills.length &&
      item?.skill_names &&
      item?.skill_names.length &&
      wd.bow.cosine(
        nlp.tokens.bagOfWords(profile?.skills?.map((item) => item.toLowerCase())),
        nlp.tokens.bagOfWords(item?.skill_names?.toLowerCase().split(",")),
      )) || 1;
  const job_score = profile?.role_name && item?.job_title && profile?.role_name?.toLowerCase() === item?.job_title?.toLowerCase() ? 0 : 1;

  const roles_open_score = profile?.roles_open_to && item.location && wd.bow.cosine(
    nlp.tokens.bagOfWords(profile?.roles_open_to?.map((item) => item.toLowerCase())),
    nlp.tokens.bagOfWords([item?.location?.toLowerCase()]),
  ) || 1;
  const experience_score = profile?.level_of_experience && item?.experience_level && profile?.level_of_experience?.toLowerCase() === item?.experience_level?.toLowerCase() ? 0 : 1;
  const rate_score = item?.hourly_min_rate && profile?.hourly_rate && item?.hourly_max_rate && item?.hourly_min_rate <= profile?.hourly_rate && item?.hourly_max_rate >= profile?.hourly_rate ? 0 : 1;
  const avg_score = (skill_score + job_score + roles_open_score + experience_score + rate_score) / 5;
  return avg_score;
};

const Ranking = {
  getRankingScore,
  sortByScore,
  getCosineSimilarity,
  getProfileSimilarity,
};

export default Ranking;
