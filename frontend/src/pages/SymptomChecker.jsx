import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle, Plus, ChevronRight, HeartPulse, Brain, Thermometer, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import { geminiModel } from '../utils/geminiClient';
import Chatbot from '@/components/Chatbot';
import { useUser } from '@clerk/clerk-react';

const SymptomChecker = () => {

  const parseGeminiResponse = (text) => {
    try {
      // Split the response into individual conditions
      const conditionBlocks = text.split(/(?=Condition:|CONDITION:)/i).filter(block => block.trim());
      
      if (conditionBlocks.length === 0) {
        // Fallback for unstructured responses
        return [{
          name: "Possible Condition",
          probability: 65,
          severity: "Moderate",
          urgency: "Monitor",
          recommendations: text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
            .map(line => line.replace(/^[-•]\s/, "").trim())
        }];
      }
      
      return conditionBlocks.map(block => {
        // Extract the condition name
        const nameMatch = block.match(/(?:Condition|CONDITION):\s*([^\n]+)/i);
        const name = nameMatch ? nameMatch[1].trim() : "Unidentified Condition";
        
        // Extract the severity
        const severityMatch = block.match(/(?:Severity|SEVERITY):\s*([^\n]+)/i);
        const severity = severityMatch ? 
                         severityMatch[1].trim().toLowerCase().includes('high') ? 'High' :
                         severityMatch[1].trim().toLowerCase().includes('low') ? 'Low' : 'Moderate'
                         : 'Moderate';
        
        // Extract the urgency
        const urgencyMatch = block.match(/(?:Urgency|URGENCY):\s*([^\n]+)/i);
        let urgency = 'Monitor';
        if (urgencyMatch) {
          const urgencyText = urgencyMatch[1].trim().toLowerCase();
          if (urgencyText.includes('seek') || urgencyText.includes('emergency')) {
            urgency = 'Seek care';
          } else if (urgencyText.includes('advice') || urgencyText.includes('consult')) {
            urgency = 'Medical advice';
          } else if (urgencyText.includes('non') || urgencyText.includes('home')) {
            urgency = 'Non-urgent';
          }
        }
        
        // Extract the probability
        const probabilityMatch = block.match(/(?:Probability|PROBABILITY):\s*(\d+)%/i);
        // Also try to capture just numbers followed by % anywhere in the text
        const altProbabilityMatch = block.match(/(\d+)(?:\.\d+)?%/);
        const probability = probabilityMatch ? parseInt(probabilityMatch[1], 10) : 
                           altProbabilityMatch ? parseInt(altProbabilityMatch[1], 10) : 
                           Math.floor(Math.random() * 40) + 40; // Random between 40-80% if not found
        
        // Extract the recommendations
        let recommendations = [];
        
        // First, try to find a recommendations section
        const recommendationsMatch = block.match(/(?:Recommendations|RECOMMENDATIONS):\s*([\s\S]*?)(?=(?:\n\n|\n(?:Condition|CONDITION|$)))/i);
        
        if (recommendationsMatch) {
          // Process the recommendations section
          recommendations = recommendationsMatch[1]
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('-') || line.startsWith('*') || line.startsWith('•'))
            .map(line => line.replace(/^[-•]\s/, "").trim());
        }
        
        // If we couldn't find recommendations with bullet points, look for any text after "Recommendations:"
        if (recommendations.length === 0) {
          const simpleRecommendationsMatch = block.match(/(?:Recommendations|RECOMMENDATIONS):\s*([^\n]+)/i);
          if (simpleRecommendationsMatch) {
            recommendations = [simpleRecommendationsMatch[1].trim()];
          }
        }
        
        // If still no recommendations, check for any sentences that sound like advice
        if (recommendations.length === 0) {
          const adviceLines = block.split('\n').filter(line => 
            (line.toLowerCase().includes('should') || 
             line.toLowerCase().includes('recommend') || 
             line.toLowerCase().includes('advised') ||
             line.toLowerCase().includes('take ') ||
             line.toLowerCase().includes('rest') ||
             line.toLowerCase().includes('drink')) && 
            !line.toLowerCase().includes('condition:') &&
            !line.toLowerCase().includes('severity:') &&
            !line.toLowerCase().includes('urgency:') &&
            !line.toLowerCase().includes('probability:')
          );
          
          recommendations = adviceLines.map(line => line.trim());
        }
        
        // Default recommendation if none found
        if (recommendations.length === 0) {
          if (severity === 'High') {
            recommendations = ["Consult a healthcare provider promptly."];
          } else if (severity === 'Moderate') {
            recommendations = ["Monitor symptoms and rest. Seek medical advice if symptoms worsen."];
          } else {
            recommendations = ["Rest and maintain hydration. Use over-the-counter remedies as appropriate."];
          }
        }
        
        return {
          name,
          probability,
          severity,
          urgency,
          recommendations,
        };
      });
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return [
        {
          name: "Analysis Error",
          probability: 0,
          severity: "Moderate",
          urgency: "Monitor",
          recommendations: ["Failed to parse AI response. Please try again with more specific symptoms."],
        },
      ];
    }
  };

  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState('days');
  const [error, setError] = useState(null);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Nausea', 
    'Dizziness', 'Fatigue', 'Chest Pain', 'Shortness of Breath',
    'Abdominal Pain', 'Vomiting', 'Sore Throat'
  ];

  const handleAddSymptom = () => {
    if (currentSymptom && !symptoms.includes(currentSymptom)) {
      setSymptoms([...symptoms, currentSymptom]);
      setCurrentSymptom('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSymptom();
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSuggestionClick = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      setError("Please add at least one symptom before analyzing.");
      return;
    }
  
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
  
    // Prepare a more structured prompt for Gemini AI
    const prompt = `
      You are a medical AI assistant helping analyze symptoms. Provide a structured analysis of these symptoms:
      
      Symptoms: ${symptoms.join(", ")}
      Severity described by patient: ${severity}
      Duration: ${duration}
      
      Analyze and list the top 3-5 most likely conditions that match these symptoms.
      
      For EACH condition, provide this EXACT format - do not deviate from this structure:
      
      Condition: [Full condition name]
      Severity: [Low/Moderate/High]
      Urgency: [Non-urgent/Monitor/Medical advice/Seek care]
      Probability: [XX]%
      Recommendations:
      - [Specific recommendation 1]
      - [Specific recommendation 2]
      - [Specific recommendation 3]
      
      IMPORTANT: Always include the condition name, proper bullet points for recommendations, and make sure each condition is clearly separated.
    `;
  
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 120);
  
      // Call Gemini AI
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      // Parse the response
      const parsedResult = parseGeminiResponse(text);
      
      // Log the parsed results for debugging
      console.log("Raw response:", text);
      console.log("Parsed results:", parsedResult);
  
      // Update the state with the analysis result
      setResult(parsedResult);
      setProgress(100);
    } catch (error) {
      console.error("Error analyzing symptoms with Gemini AI:", error);
      setError("Failed to analyze symptoms. Please try again or check your connection.");
      setResult([
        {
          name: "Analysis Error",
          probability: 0,
          severity: "Moderate",
          urgency: "Monitor",
          recommendations: ["Failed to analyze symptoms. Please try again or add more specific details."],
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetChecker = () => {
    setSymptoms([]);
    setCurrentSymptom('');
    setIsAnalyzing(false);
    setResult(null);
    setProgress(0);
    setSeverity('moderate');
    setDuration('days');
    setError(null);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Non-urgent': return 'bg-green-100 text-green-800 border-green-200';
      case 'Monitor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Medical advice': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Seek care': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Symptom Checker</h1>
            <p className="text-gray-600 mt-2">
              Get quick analysis and guidance for your health concerns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {/* Combined Form Column */}
            <div>
              <Card className="border-none shadow-lg bg-white overflow-hidden">
                <CardContent className="p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                  
                  {!isAnalyzing && !result && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">What symptoms are you experiencing?</h2>
                      
                      <div className="flex gap-2 mb-6">
                        <Input
                          value={currentSymptom}
                          onChange={(e) => setCurrentSymptom(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter symptoms..."
                          className="flex-1"
                        />
                        <Button onClick={handleAddSymptom} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4 mb-6">
                        {symptoms.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {symptoms.map((symptom, index) => (
                              <Badge 
                                key={index}
                                variant="outline"
                                className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1 flex items-center gap-1"
                              >
                                {symptom}
                                <button 
                                  className="ml-1 h-4 w-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center"
                                  onClick={() => removeSymptom(symptom)}
                                >
                                  <span className="text-xs">×</span>
                                </button>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 mb-4">Add symptoms to get started</p>
                        )}

                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Common symptoms:</h3>
                          <div className="flex flex-wrap gap-2">
                            {commonSymptoms.map((symptom, index) => (
                              <Badge 
                                key={index}
                                variant="outline"
                                className="bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-800 cursor-pointer transition-colors"
                                onClick={() => handleSuggestionClick(symptom)}
                              >
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional Information - now part of the same form */}
                      <div className="space-y-6 mt-6 border-t border-gray-100 pt-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-3">How severe are your symptoms?</h3>
                          <RadioGroup value={severity} onValueChange={setSeverity} className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mild" id="mild" />
                              <Label htmlFor="mild">Mild - Noticeable but not interfering with daily activities</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="moderate" id="moderate" />
                              <Label htmlFor="moderate">Moderate - Affecting some daily activities</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="severe" id="severe" />
                              <Label htmlFor="severe">Severe - Significantly impacting daily life</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-3">How long have you been experiencing these symptoms?</h3>
                          <RadioGroup value={duration} onValueChange={setDuration} className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hours" id="hours" />
                              <Label htmlFor="hours">Hours</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="days" id="days" />
                              <Label htmlFor="days">Days</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weeks" id="weeks" />
                              <Label htmlFor="weeks">Weeks</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="months" id="months" />
                              <Label htmlFor="months">Months or longer</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {isAnalyzing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-8 text-center"
                    >
                      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Analyzing your symptoms</h3>
                      <p className="text-gray-500 mb-4">Please wait while our AI processes your information</p>
                      <Progress value={progress} className="h-2" />
                    </motion.div>
                  )}

                  {result && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Possible Conditions</h2>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          AI Analysis
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {result.map((condition, index) => (
                          <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-900 text-lg">{condition.name}</h3>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700 mr-2">
                                    {condition.probability}%
                                  </span>
                                  <Progress value={condition.probability} className="h-2 w-20" />
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className={getSeverityColor(condition.severity)}>
                                  {condition.severity} Severity
                                </Badge>
                                <Badge variant="outline" className={getUrgencyColor(condition.urgency)}>
                                  {condition.urgency}
                                </Badge>
                              </div>
                              
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations:</h4>
                                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                                  {condition.recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                            {/* <CardFooter className="bg-gray-50 p-3 flex justify-end">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                                Learn More <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </CardFooter> */}
                          </Card>
                        ))}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                            <div>
                              <h3 className="text-sm font-medium text-yellow-800">Important Disclaimer</h3>
                              <p className="text-sm text-yellow-700 mt-1">
                                This analysis is not a medical diagnosis. Please consult with a healthcare 
                                professional for proper medical advice.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                          <Button variant="outline" onClick={resetChecker}>
                            Start Over
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Phone className="h-4 w-4 mr-2" />
                            Find Healthcare
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>

                {!isAnalyzing && !result && (
                  <CardFooter className="bg-gray-50 p-4 flex justify-end border-t border-gray-100">
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={symptoms.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      Analyze Symptoms <Search className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
            {/* <Chatbot /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;