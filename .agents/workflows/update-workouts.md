---
description: Update the application's workout database based on the monthly workouts.md file
---

# Workflow: Monthly Workout Plan Update

The user manages the monthly CoupleFit workout variations in the `workouts.md` file located at the root of the project. Whenever the user triggers this workflow (or asks to update the workouts based on the file), follow these specific steps:

1. **Read `workouts.md`**: Use the `view_file` tool to read the complete content of `/Users/michael/dev/vite_fit/workouts.md`.
2. **Parse Structure**: Understand the four training days (A, B, C, D) and the nested exercise block structures (Shared Equipment, Lina's specific exercise, Michael's specific exercise, Reps/Sets, and Notes).
3. **Map to `workoutData.js`**: Use `replace_file_content` or `multi_replace_file_content` to carefully overwrite the `workoutPlan` object exported in `src/data/workoutData.js`.
4. **Preserve Rules**: 
   - Ensure the JSON/Object structure perfectly matches the schema currently in `workoutData.js`. Each entry must have `id`, `category`, `sharedEquipment`, `lina`, and `michael`, where `lina` and `michael` contain `{ name, description, sets, reps, notes, videoUrl }`. 
   - Synthesize or carry over valid `videoUrl` strings representing YouTube searches based on the literal exercise names if not provided in the markdown file.
   - Do **NOT** modify the `expertTips` array exported at the bottom of the file unless explicitly requested.
5. **Verify**: Check that the app correctly compiles and `src/data/workoutData.js` has no syntax errors.
6. **Commit**: Automatically commit the generated updates with a conventional commit like `feat: monthly workout data update`.
