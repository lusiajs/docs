import { variable } from "lusiajs";

// How many times the box's onAttach and onDetach hooks ran. Shared by the demo and the box.
export const attachRuns = variable(0);
export const detachRuns = variable(0);
