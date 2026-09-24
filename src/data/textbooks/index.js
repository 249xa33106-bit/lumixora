// Digital Textbook Registry
import { FULLSTACK_TEXTBOOK } from './fullstackCoreCsTextbook';
import { MULTI_LANG_TEXTBOOK } from './multiLangTextbook';
import { COMPETITIVE_DSA_TEXTBOOK } from './competitiveDsaTextbook';
import { SPEED_CODING_TEXTBOOK } from './speedCodingTextbook';

export const ALL_TEXTBOOKS = {
  'course-fullstack-core-cs': FULLSTACK_TEXTBOOK,
  'course-multilang-specialist': MULTI_LANG_TEXTBOOK,
  'course-dsa-competitive-solver': COMPETITIVE_DSA_TEXTBOOK,
  'course-weekly-championship': SPEED_CODING_TEXTBOOK,
};

export function getTextbookForCourse(courseId) {
  return ALL_TEXTBOOKS[courseId] || null;
}
