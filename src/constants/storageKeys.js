// Single source of truth for every localStorage key CoupleFit touches.
// Import this instead of typing the string literal — a typo'd literal
// silently stops a read/write from matching with no error anywhere.
export const STORAGE_KEYS = {
  WORKOUT_LOGS: 'vitefit_workout_logs',
  ACTIVE_USER: 'vitefit_active_user',
  SELECTED_DAY: 'vitefit_selected_day',
  LANGUAGE: 'vitefit_language',
  SHOW_TEST_USER: 'vitefit_show_test_user',
};
