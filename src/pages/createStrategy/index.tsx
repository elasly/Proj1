import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { z } from 'zod';


type Indicator = {
  id: number;
  name: string;
  group: string;
  description: string;
  inputs: string;
  outputs: string;
};

type RuleSection = 'longEntry' | 'longExit' | 'shortEntry' | 'shortExit';

type Rule = {
  indicatorId: number;
  indicatorName: string;
  params: Record<string, string>;
};

type StrategyRules = {
  [key in RuleSection]: Rule[];
};
const IndicatorCard: React.FC<{
    groups: string[];
    onGroupChange: (group: string) => void;
    indicators: Indicator[];
    onIndicatorChange: (indicator: Indicator | null) => void;
    selectedIndicator: Indicator | null;
    onDragStart: (indicator: Indicator) => void;
  }> = ({ groups, onGroupChange, indicators, onIndicatorChange, selectedIndicator, onDragStart }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [params, setParams] = useState<Record<string, string>>({});
  
    const { data: indicatorDetails } = api.queries.getIndicatorsDetails.useQuery(
      { name: selectedIndicator?.name ?? '' },
      { enabled: !!selectedIndicator }
    );
  
    useEffect(() => {
      if (indicatorDetails && indicatorDetails.length > 0) {
        const initialParams = JSON.parse(indicatorDetails[0].inputs);
        const modifiableParams = Object.fromEntries(
          Object.entries(initialParams).filter(([_, value]) => value.includes('='))
        );
        setParams(modifiableParams);
      }
    }, [indicatorDetails]);
  
    const handleParamChange = (key: string, value: string) => {
        setParams(prev => ({ ...prev, [key]: value }));
      };
    
      const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (selectedIndicator && indicatorDetails && indicatorDetails.length > 0) {
          const dragData = {
            ...selectedIndicator,
            description: indicatorDetails[0].description,
            params: params
          };
          e.dataTransfer.setData('application/json', JSON.stringify(dragData));
          onDragStart(selectedIndicator);
        }
      };

      return (
        <div 
        className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-move"
        draggable={!!selectedIndicator}
        onDragStart={handleDragStart}
      >
          <select
            className="w-full p-2 mb-2 border rounded"
            onChange={(e) => onGroupChange(e.target.value)}
          >
            <option value="">Select a group</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
    
          <select
            className="w-full p-2 mb-2 border rounded"
            onChange={(e) => {
              const selected = indicators.find(i => i.id === parseInt(e.target.value));
              onIndicatorChange(selected || null);
            }}
            value={selectedIndicator?.id || ''}
          >
            <option value="">Select an indicator</option>
            {indicators.map((indicator) => (
              <option key={indicator.id} value={indicator.id}>
                {indicator.name}
              </option>
            ))}
          </select>
    
          {selectedIndicator && indicatorDetails && indicatorDetails.length > 0 && (
            <div>
              <button
                className="w-full p-2 bg-gray-100 rounded-lg text-left"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {indicatorDetails[0].description}
              </button>
              {isExpanded && (
                <div className="mt-2">
                  {Object.entries(params).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    };
  
  const CreateStrategy: React.FC = () => {
    const { data: session } = useSession();
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
    const [strategyRules, setStrategyRules] = useState<StrategyRules>({
      longEntry: [],
      longExit: [],
      shortEntry: [],
      shortExit: [],
    });
    const [strategyName, setStrategyName] = useState('');
    const [strategyDescription, setStrategyDescription] = useState('');
  
    const { data: indicatorGroups } = api.queries.getIndGroups.useQuery();
    const { data: groupIndicators } = api.queries.getIndicatorsOfGroup.useQuery(
      { group: selectedGroup ?? '' },
      { enabled: !!selectedGroup }
    );
    const saveStrategyMutation = api.queries.saveStrategy.useMutation();
  
    const handleDragStart = (indicator: Indicator) => {
        console.log('Drag started with indicator:', indicator);
      };
    
      const handleDrop = (e: React.DragEvent<HTMLDivElement>, section: RuleSection) => {
        e.preventDefault();
        try {
          const indicatorData = JSON.parse(e.dataTransfer.getData('application/json'));
          
          setStrategyRules((prev) => ({
            ...prev,
            [section]: [...prev[section], { 
              indicatorId: indicatorData.id, 
              indicatorName: indicatorData.name,
              params: indicatorData.params,
            }],
          }));
        } catch (error) {
          console.error('Error parsing dropped data:', error);
        }
      };

  const handleSubmit = () => {
    const strategySchema = z.object({
      name: z.string().min(1, "Strategy name is required"),
      description: z.string().min(1, "Strategy description is required"),
      entryRules: z.array(z.any()),
      exitRules: z.array(z.any()),
      riskManagement: z.array(z.any()),
    });

    const strategyData = {
      name: strategyName,
      description: strategyDescription,
      entryRules: [...strategyRules.longEntry, ...strategyRules.shortEntry],
      exitRules: [...strategyRules.longExit, ...strategyRules.shortExit],
      riskManagement: [], // Add risk management rules if needed
    };

    try {
      strategySchema.parse(strategyData);
      saveStrategyMutation.mutate([strategyData]);
    } catch (error) {
      console.error("Validation error:", error);
      // Handle validation error (e.g., show error message to user)
    }
  };

  if (!session) {
    return <div>Please sign in to create a strategy.</div>;
  }

    return (
        <DndProvider backend={HTML5Backend}>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Strategy</h1>
            
        <div className="mb-4">
          <input
            type="text"
            placeholder="Strategy Name"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Strategy Description"
            value={strategyDescription}
            onChange={(e) => setStrategyDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex">
          <div className="w-1/3 pr-4">
            <h2 className="text-xl font-semibold mb-2">Indicator Selection</h2>
            <IndicatorCard
              groups={indicatorGroups?.map(g => g.group) ?? []}
              onGroupChange={setSelectedGroup}
              indicators={groupIndicators ?? []}
              onIndicatorChange={setSelectedIndicator}
              selectedIndicator={selectedIndicator}
              onDragStart={handleDragStart}
            />
          </div>

          <div className="w-2/3">
            <h2 className="text-xl font-semibold mb-2">Rules</h2>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(strategyRules) as RuleSection[]).map((section) => (
                <div
                  key={section}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, section)}
                  className="border p-2 rounded min-h-[100px]"
                >
                  <h3 className="font-semibold mb-2">{section}</h3>
                  {strategyRules[section].map((rule, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                      {rule.indicatorName}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saveStrategyMutation.isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {saveStrategyMutation.isLoading ? 'Saving...' : 'Save Strategy'}
        </button>
      </div>
    </DndProvider>
  );
};

export default CreateStrategy;