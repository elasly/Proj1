//src/lib/queries.ts
"use server";
import  "server-only";
import { entryRules, exitRules, indicator, strategies, riskManagement,  } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, sql, and } from "drizzle-orm";
import { getServerAuthSession } from "@/server/auth";



export const createIndicator = async (Indicator: typeof indicator) => {
  try {
    
    await db.insert(indicator).values(Indicator);
    return { data: null, error: null };
  } catch (error) {
    console.log(error); 
    return { data: null, error: "Error" };
  }
};

export const getindicatorOfGroup = async (group: string) => {
  try {
    console.log(
      "this is inside the getindicatorOfGroup function passed the group value",
      group,
    );
    const P1 =  db
      .select()
      .from(indicator)
      .where(eq(indicator.group, sql.placeholder('group')));
    const data = await P1.execute({ group: group });
    if (data) return { data };
    else return { data: null, error: "error" };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};

export const getindicatorGroup = async () => {
  try {
    console.log("this is inside the getindicatorGroup function");
    const groups = await db
      .selectDistinct({ group: indicator.group })
      .from(indicator);
    if (groups)
      return  (groups);
    else
      return { error: "error" };
  } catch (error) {
    console.log(error);
    return { error: "error" };
  }
};

export const getindicatorDetails = async (selectedIndicator: string) => {
    try {
      const P1 =  db
        .select()
        .from(indicator)
        .where(eq(indicator.name, sql.placeholder('selectedIndicator')));
      const data = await P1.execute({ selectedIndicator: selectedIndicator });
      if (data) return { data };
      else return { data: null, error: "error" };
    } catch (error) {
      console.log(error);
      return { data: null, error: `Error` };
    }
  };


  export const putEntryRule = async (data:typeof entryRules[], strat_id: number) => {

    try {
      data.forEach((item) => (item.strategyId = strat_id));
      await db.insert(entryRules).values(data);
      return { data: null, error: null };
    } catch (error) {
      console.error("Error in putEntryRule:", error);
      return { data: null, error: "An error occurred while inserting entry rules" };
    }
  };
  export const updateEntryRules = async (data:typeof entryRules[], strat_id: number) => {
    try {
      await db.delete(entryRules).where(eq(entryRules.strategyId , strat_id ));
      data.forEach((item) => (item.strategyId = strat_id));
      await db.insert(entryRules).values(data);
      return { data: null, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: "Error" };
    };
  };


//[{"ruleType":"exitRule","ruleAction":"long","indicatorId":"213","operator":"NA","value":0,"sequence":0,"logicalOperator":"NA","compareTo":"slope","compIndicatorId":0,"slope":"positiveOrZero","priceAction":"NA"},{"ruleType":"exitRule","ruleAction":"short","indicatorId":"220","operator":"=","value":0,"sequence":0,"logicalOperator":"NA","compareTo":"price","compIndicatorId":0,"slope":"NA","priceAction":"Close"}]
  export const putExitRule = async (data:typeof exitRules[], strat_id: number) => {
    try {
      data.forEach((item) => (item.strategyId = strat_id));
      console.log("exitRules", data);
      await db.insert(exitRules).values(data);
      return { data: null, error: null };
      } catch (error) {
      console.log(error);
      return { data: null, error: "Error" };
    }
  };
 export const updateExitRules = async (data: typeof exitRules[], strat_id: number) => {
    try {
      await db.delete(exitRules).where(eq(exitRules.strategyId , strat_id ));
      data.forEach((item) => (item.strategyId = strat_id));
      await db.insert(exitRules).values(data);
      return { data: null, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: "Error" };
    };
  };

  export const putStrategy = async (strategyName: string, strategyDescription: string) => {
    try {
      const session = await getServerAuthSession();
      console.log("instde strategy insert", strategyName );
      const stratID = await db.insert(strategies).values({strat_name: strategyName, description: strategyDescription, user_id: session.user.id, createdAt: new Date(), updatedAt: new Date()}).returning({stratID: strategies.id});
      const data = stratID.at(0)
      return {data , error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: "Error" };
    }
  };
export const updateStrategy = async (strategy: Strategy) => {
  try {
    const session = await getServerAuthSession();
    await db.update(strategies).set({
      strat_name: strategy.name,
      description: strategy.description, 
      updatedAt: new Date()}).where(
        and ( eq(strategies.id, strategy.id),
              eq(strategies.user_id, session.user.id)));
  
    return {data: null };
  } catch (error) {
    return {  error: "Error" };
  }}

  export const getStrategy= async () => {
    try {
      const data = await db.select().from(strategies).where(eq(strategies.user_id, session.user.id));
      return { data }
    } catch (error) {
      return { error: "Error"}
    }
  }

  export const putRiskManagement = async (RiskManagement: RiskManagement) => {
    try {
      await db.insert(riskManagement).values(RiskManagement);
      return { data: null, error: null };
    } catch (error) {
      console.log(error);
      return { error: "Error" };
    }
  };