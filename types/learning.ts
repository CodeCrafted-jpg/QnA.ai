export type MasteryState="strong"|"developing"|"attention"|"not-learned";
export interface Concept{ id:string; name:string; mastery:number; state:MasteryState; prerequisiteIds?:string[]; }
export interface Resource{ id:string; title:string; duration:string; topic:string; source:string; }
