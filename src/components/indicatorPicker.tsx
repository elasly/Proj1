// components/ui/IndicatorPicker.js
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { getindicatorOfGroup , getindicatorGroup} from "@/server/db/queries";
import { groupCollapsed } from "console";


const IndicatorPicker = ({  onIndicatorSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getindicatorGroup()
        setGroups(data);
        console.log("Fetched Groups:", groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);



  const fetchIndicators = useCallback(async () => {
    if (selectedGroup) {
      console.log("Fetching indicators for group:", selectedGroup);
      try {
        const response = await getindicatorOfGroup(selectedGroup);
        setIndicators(response.data);
        console.log("Fetched indicators:", response.data);

      } catch (error) {
        console.error("Error fetching indicators:", error);
      }
    }
  }, [selectedGroup]);

  useEffect(() => {
    fetchIndicators();
  }, [selectedGroup, fetchIndicators]);

  const handleGroupChange = (group) => {
    console.log("handleGroupChange called with group:", group);
    setSelectedGroup(group);
    // onIndicatorSelect(index, null);
    // Remove the direct call to fetchIndicators here
  };

  const handleIndicatorChange = async (indicator) => {
    console.log("handleIndicatorChange called with indicator:", indicator);
    onIndicatorSelect(indicator);

    if (indicator) {
      try {
        const data = await getindicatorOfGroup(group);
      } catch (error) {
        console.error("Error fetching indicator details:", error);
      }
    } else {
      updateIndicatorDetails(index, null);
    }
  };

  return (
    <div>
      <Select onValueChange={handleGroupChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Group" />
        </SelectTrigger>
        <SelectContent>
        {groups.map((groupObj, index) => (
            <SelectItem key={index} value={groupObj.group}>
            {groupObj.group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedGroup && (
        <Select onValueChange={handleIndicatorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Indicator" />
          </SelectTrigger>
          <SelectContent>
            {indicators.map((indicatorObj) => (
              <SelectItem key={indicatorObj.id} value={indicatorObj.name}>
                {indicatorObj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export default IndicatorPicker