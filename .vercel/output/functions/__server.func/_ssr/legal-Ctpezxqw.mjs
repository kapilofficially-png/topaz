import { n as createServerFn } from "./ssr.mjs";
import { r as createSsrRpc } from "./createSsrRpc-BwqePK-a.mjs";
import { a as object, i as number, n as array, o as record, s as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal-Ctpezxqw.js
var retrieveInput = object({
	query: string().min(3).max(4e3),
	k: number().int().min(1).max(12).optional(),
	categories: array(string()).optional()
});
var draftInput = object({
	slug: string().min(1).max(80),
	title: string().min(1).max(200),
	instructions: string().min(1).max(4e3),
	facts: record(string(), string()),
	ragQuery: string().min(1).max(4e3)
});
var refineInput = object({
	slug: string().min(1).max(80),
	title: string().min(1).max(200),
	currentDraft: string().min(20).max(24e3),
	instruction: string().min(3).max(2e3),
	ragQuery: string().min(1).max(4e3)
});
var askInput = object({ question: string().min(8).max(2500) });
var searchAuthorities = createServerFn({ method: "POST" }).validator((input) => retrieveInput.parse(input)).handler(createSsrRpc("fef6b9a14abf3390243bc546041f329f7f4c34640b19142602d5e7dd06359caf"));
createServerFn({ method: "POST" }).validator((input) => object({ id: string() }).parse(input)).handler(createSsrRpc("533a8b4c32c06ab444ff7725d6a054040af35976a717f7f732605d9168e68d1f"));
createServerFn({ method: "POST" }).validator((input) => object({
	category: string().optional(),
	q: string().optional()
}).parse(input)).handler(createSsrRpc("f7e22f2d46bf71f69fff264ae438baf4e0bed29457c15d42a697414a7f8a921a"));
var generateDraft = createServerFn({ method: "POST" }).validator((input) => draftInput.parse(input)).handler(createSsrRpc("e01f2916e08d10faea50b5e328a52de250fe16b797113148bf07781efa299c1b"));
var refineDraft = createServerFn({ method: "POST" }).validator((input) => refineInput.parse(input)).handler(createSsrRpc("87860d3d820f6f38f39d1c2f753d6ec6dc7f2142fefac3920dc68b3adc357ebb"));
var askTheLaw = createServerFn({ method: "POST" }).validator((input) => askInput.parse(input)).handler(createSsrRpc("946f65fb0f70125389cf9076bce1d39727c79c824f29ab692fae036bb8dc46d7"));
//#endregion
export { searchAuthorities as i, generateDraft as n, refineDraft as r, askTheLaw as t };
