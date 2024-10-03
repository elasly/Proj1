// @/components/ui/StrategyContext.js
import React, { createContext, useContext, useState } from "react";
// import { api } from '@/utils/api'
// import { getindicatorOfGroup, getindicatorGroup, getindicatorDetails } from "@/server/db/queries"
// import { indicator } from "@/server/db/schema";

const StrategyContext = createContext();

export const useStrategyContext = () => useContext(StrategyContext);

export const StrategyProvider = ({ children }) => {
  const [strategyName, setStrategyName] = useState("");
  const [strategyDescription, setStrategyDescription] = useState("");
  const [indicatorCount, setIndicatorCount] = useState(0);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [rules, setRules] = useState([]);
  const [indicatorDetails, setIndicatorDetails] = useState([]);

  const handleIndicatorSelect = (index, indicator) => {
    const updatedIndicators = [...selectedIndicators];
    updatedIndicators[index] = indicator;
    setSelectedIndicators(updatedIndicators);
  };

  const updateRule = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  const addRule = () => {
    setRules([
      ...rules,
      {
        indicator: null,
        comparison: null,
        thresholdType: null,
        threshold: null,
        comparisonIndicator: null,
        operator: null,
        sequence: rules.length + 1,
      },
    ]);
  };

  const removeRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const fetchIndicatorDetails = async (indicator, index) => {
    if (indicator) {
      try {
        // const data = await getindicatorDetails(indicator)
        // const response = await fetch(`http://localhost:5001/fetcindicators?indicator_name=${indicator}`);
        // const data = await response.json();
        // setIndicatorDetails((prevDetails) => {
        //   const updatedDetails = [...prevDetails];
        //   updatedDetails[index] = data;
        //   return updatedDetails;
        // });
      } catch (error) {
        console.error("Error fetching indicator details:", error);
      }
    }
  };

  const updateIndicatorDetails = (index, details) => {
    setIndicatorDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = details;
      return updatedDetails;
    });
  };

  return (
    <StrategyContext.Provider
      value={{
        strategyName,
        strategyDescription,
        indicatorCount,
        selectedIndicators,
        rules,
        indicatorDetails,
        setStrategyName,
        setStrategyDescription,
        setIndicatorCount,
        handleIndicatorSelect,
        updateRule,
        addRule,
        removeRule,
        setIndicatorDetails,
        fetchIndicatorDetails,
        updateIndicatorDetails,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};
