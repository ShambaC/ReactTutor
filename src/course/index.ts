// The course, in order. Each module file is plain JavaScript (see docs/AUTHORING.md).
import type { Lesson, Module } from "./types";
import m01 from "./modules/m01-welcome.js";
import m02 from "./modules/m02-values.js";
import m03 from "./modules/m03-functions.js";
import m04 from "./modules/m04-decisions.js";
import m05 from "./modules/m05-arrays.js";
import m06 from "./modules/m06-objects.js";
import m07 from "./modules/m07-dom-events.js";
import m08 from "./modules/m08-modules.js";
import m09 from "./modules/m09-hello-react.js";
import m10 from "./modules/m10-props.js";
import m11 from "./modules/m11-lists-conditions.js";
import m12 from "./modules/m12-state.js";
import m13 from "./modules/m13-forms.js";
import m14 from "./modules/m14-thinking-in-react.js";
import m15 from "./modules/m15-effects-fetch.js";
import m16 from "./modules/m16-refs-context-hooks.js";
import m17 from "./modules/m17-router-basics.js";
import m18 from "./modules/m18-router-params-nested.js";
import m19 from "./modules/m19-router-search-data.js";
import m20 from "./modules/m20-capstone.js";

export const MODULES: Module[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20] as Module[];

export const ALL_LESSONS: { lesson: Lesson; module: Module }[] = MODULES.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module })));
export const findLesson = (id: string) => ALL_LESSONS.find((x) => x.lesson.id === id);
export const nextLesson = (id: string) => ALL_LESSONS[ALL_LESSONS.findIndex((x) => x.lesson.id === id) + 1]?.lesson;
