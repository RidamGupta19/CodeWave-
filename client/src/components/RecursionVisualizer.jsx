import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const RecursionVisualizer = ({ visualizationData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && visualizationData?.steps && currentStep < visualizationData.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500); // 1.5 seconds per step
    } else if (currentStep >= (visualizationData?.steps?.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, visualizationData]);

  if (!visualizationData || !visualizationData.steps) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-gray-400 text-center">
        No visualization data available for this checkpoint.
      </div>
    );
  }

  const stepData = visualizationData.steps[currentStep];
  const { activeNodes = [], returningNodes = [], text = "" } = stepData || {};

  const handleNext = () => {
    if (currentStep < visualizationData.steps.length - 1) setCurrentStep((p) => p + 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Helper to render tree nodes recursively
  const renderTreeNode = (nodeId) => {
    const node = visualizationData.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const isActive = activeNodes.includes(nodeId);
    const isReturning = returningNodes.includes(nodeId);
    const isPending = !isActive && !isReturning && !visualizationData.steps.slice(0, currentStep).some(s => s.activeNodes.includes(nodeId));
    const isCompleted = !isActive && !isReturning && !isPending;

    let bgColor = "bg-gray-700";
    let borderColor = "border-gray-600";
    if (isActive) {
      bgColor = "bg-blue-600";
      borderColor = "border-blue-400";
    } else if (isReturning) {
      bgColor = "bg-green-600";
      borderColor = "border-green-400";
    } else if (isCompleted) {
      bgColor = "bg-gray-800 opacity-50";
      borderColor = "border-gray-700";
    }

    return (
      <div key={nodeId} className="flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isActive ? 1.1 : 1, opacity: isPending ? 0.4 : 1 }}
          transition={{ duration: 0.3 }}
          className={`px-4 py-2 rounded-lg border-2 text-white font-mono text-sm shadow-lg z-10 ${bgColor} ${borderColor}`}
        >
          {node.label}
          {isReturning && node.returnValue && (
            <span className="ml-2 text-green-200 font-bold">→ {node.returnValue}</span>
          )}
        </motion.div>
        
        {/* Children Row */}
        {node.children && node.children.length > 0 && (
          <div className="flex justify-center mt-6 relative gap-8">
            {/* Simple connector lines */}
            <div className="absolute top-[-24px] left-1/2 w-px h-6 bg-gray-500" />
            {node.children.length > 1 && (
              <div className="absolute top-[-12px] left-1/4 right-1/4 h-px bg-gray-500" />
            )}
            
            {node.children.map(childId => (
              <div key={childId} className="relative pt-3">
                <div className="absolute top-[-12px] left-1/2 w-px h-3 bg-gray-500" />
                {renderTreeNode(childId)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Find root nodes (nodes without parents)
  const childIds = new Set();
  visualizationData.nodes.forEach(n => n.children?.forEach(c => childIds.add(c)));
  const rootNodes = visualizationData.nodes.filter(n => !childIds.has(n.id));

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden flex flex-col h-full border border-gray-700">
      
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="text-blue-400">⚡</span> 
          {visualizationData.title || "Recursion Tree Visualization"}
        </h3>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button 
            onClick={handleNext}
            disabled={currentStep >= visualizationData.steps.length - 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-md transition-colors"
            title="Next Step"
          >
            <FiSkipForward />
          </button>
          <button 
            onClick={handleReset}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            title="Reset"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Step Explanation Banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-gray-800 border border-gray-600 px-6 py-2 rounded-full shadow-2xl text-blue-300 font-mono text-sm whitespace-nowrap">
          Step {currentStep + 1}/{visualizationData.steps.length}: <span className="text-white">{text}</span>
        </div>

        {/* Tree Container */}
        <div className="flex-1 overflow-auto p-12 flex justify-center items-start pt-20 custom-scrollbar">
          {rootNodes.map(root => renderTreeNode(root.id))}
        </div>

        {/* Call Stack Sidebar representation */}
        <div className="h-40 border-t border-gray-700 bg-gray-800 p-4 flex gap-6">
          <div className="flex-1">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Call Stack</h4>
            <div className="flex flex-col-reverse gap-1 h-24 overflow-hidden relative">
              <AnimatePresence>
                {activeNodes.map((nodeId, idx) => {
                  const n = visualizationData.nodes.find(x => x.id === nodeId);
                  return (
                    <motion.div 
                      key={nodeId}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-purple-900 border border-purple-500 text-purple-200 text-xs px-3 py-1.5 rounded"
                    >
                      {n?.label}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {activeNodes.length === 0 && (
                <div className="text-gray-500 text-xs italic mt-auto">Stack is empty</div>
              )}
            </div>
          </div>
          <div className="flex-1 border-l border-gray-700 pl-6">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Variables / State</h4>
            <div className="bg-gray-900 rounded p-2 h-24 font-mono text-xs text-green-400 overflow-auto">
              {stepData.variables ? (
                Object.entries(stepData.variables).map(([k, v]) => (
                  <div key={k}>{k} = {v}</div>
                ))
              ) : (
                <div className="text-gray-600">No local state tracked</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecursionVisualizer;
