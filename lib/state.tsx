"use client";
import {createContext,useContext,useMemo,useState} from "react";

type Ctx={mastery:number;setMastery:(n:number)=>void;showTutor:boolean;setShowTutor:(v:boolean)=>void;recommendation:string;addResource:(url:string)=>void;resources:string[]};
const StateContext=createContext<Ctx|null>(null);
export function AppStateProvider({children}:{children:React.ReactNode}){
 const [mastery,setMastery]=useState(42); const [showTutor,setShowTutor]=useState(true); const [recommendation,setRecommendation]=useState("Review Gradient Descent — 7 min"); const [resources,setResources]=useState(["StatQuest — Linear Regression","Andrew Ng — Regression"]);
 const addResource=(url:string)=>{if(url.trim())setResources(r=>[url.trim(),...r]);setRecommendation("Continue with your newly added resource");}
 const value=useMemo(()=>({mastery,setMastery,showTutor,setShowTutor,recommendation,addResource,resources}),[mastery,showTutor,recommendation,resources]);
 return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
export function useAppState(){const ctx=useContext(StateContext);if(!ctx)throw new Error("useAppState must be inside AppStateProvider");return ctx}
