import * as pkgJson from "../package.json";

export const VERSION = pkgJson.version;

export * from "./core";
export * from "./fakes";
export * from "./match";
export * from "./rules";
export * from "./types";
