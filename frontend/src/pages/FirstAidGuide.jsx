import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  ChevronRight,
  Heart,
  Bandage,
  Shield,
  AlertTriangle,
  Star,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Globe,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import YouTube from "react-youtube"; // Import YouTube component
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const FirstAidGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarked, setBookmarked] = useState(["Cuts and Scrapes", "CPR"]);
  const [language, setLanguage] = useState("english");

  const categories = [
    {
      id: "emergencies",
      name: "Emergencies",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    { id: "injuries", name: "Injuries", icon: Bandage, color: "text-blue-500" },
    {
      id: "medical",
      name: "Medical Conditions",
      icon: Heart,
      color: "text-purple-500",
    },
  ];

  const popularGuides = [
    { id: 1, title: "CPR", category: "emergencies", bookmarked: true },
    { id: 2, title: "Heart Attack", category: "emergencies" },
    {
      id: 3,
      title: "Cuts and Scrapes",
      category: "injuries",
      bookmarked: true,
    },
    { id: 4, title: "Burns", category: "injuries" },
    { id: 5, title: "Allergic Reaction", category: "medical" },
    { id: 6, title: "Choking", category: "emergencies" },
  ];

  const guidesData = {
    CPR: {
      title: "CPR (Cardiopulmonary Resuscitation)",
      category: "emergencies",
      rating: 5,
      steps: [
        {
          title: "Check responsiveness",
          content: 'Tap the person\'s shoulder and shout "Are you OK?"',
        },
        {
          title: "Call for help",
          content:
            "Ask someone to call emergency services or do it yourself if alone.",
        },
        {
          title: "Check breathing",
          content:
            "Look, listen, and feel for breathing for no more than 10 seconds.",
        },
        {
          title: "Begin chest compressions",
          content:
            "Place the heel of your hand on the center of the chest. Place your other hand on top and interlock your fingers. Keep your arms straight and your shoulders directly above your hands. Press down hard and fast at a rate of 100-120 compressions per minute, allowing the chest to fully recoil between compressions.",
        },
        {
          title: "Open the airway",
          content: "Tilt the head back slightly and lift the chin.",
        },
        {
          title: "Give rescue breaths",
          content:
            "Pinch the nose closed, take a normal breath, seal your lips around their mouth, and blow until you see the chest rise. Give 2 breaths, each lasting about 1 second.",
        },
        {
          title: "Continue CPR",
          content:
            "Continue cycles of 30 chest compressions and 2 rescue breaths until emergency help arrives or the person shows signs of life.",
        },
      ],
      notes: `If you're untrained or not confident with rescue breaths, hands-only CPR (continuous chest compressions without rescue breaths) is still effective.`,
      video: true,
      videoId: "BQNNOh8c8ks", // Official Red Cross CPR Tutorial
    },
    "Cuts and Scrapes": {
      title: "Treating Cuts and Scrapes",
      category: "injuries",
      rating: 4,
      steps: [
        {
          title: "Wash your hands",
          content: "Always clean your hands before treating a wound.",
        },
        {
          title: "Stop the bleeding",
          content: "Apply gentle pressure with a clean cloth or bandage.",
        },
        {
          title: "Clean the wound",
          content:
            "Rinse with clean water. Remove any dirt or debris with tweezers cleaned with alcohol.",
        },
        {
          title: "Apply an antibiotic",
          content: "A thin layer of antibiotic ointment can prevent infection.",
        },
        {
          title: "Cover the wound",
          content:
            "Apply a sterile bandage or dressing to keep the wound clean.",
        },
        {
          title: "Change the dressing",
          content:
            "Do this at least once a day or whenever it gets wet or dirty.",
        },
      ],
      notes:
        "Seek medical attention if the wound is deep, bleeding heavily, or shows signs of infection (increased pain, redness, swelling, warmth, or drainage).",
      video: true,
      videoId: "AhANvBB9hz0", // Mayo Clinic: How to Treat Cuts and Scrapes
    },
    Burns: {
      title: "Treating Burns",
      category: "injuries",
      rating: 5,
      steps: [
        {
          title: "Stop the burning process",
          content:
            "Remove the source of heat. If clothing is on fire, smother the flames or drench with water.",
        },
        {
          title: "Cool the burn",
          content:
            "Hold the burned area under cool (not cold) running water for 10-15 minutes. Do not use ice.",
        },
        {
          title: "Remove tight items",
          content:
            "Take off jewelry, belts, and tight clothing from the burned area before swelling occurs.",
        },
        {
          title: "Cover the burn",
          content:
            "Place a clean, sterile bandage or cloth loosely over the burn. Do not apply butter, oil, or ointments.",
        },
        {
          title: "Take pain reliever",
          content:
            "Over-the-counter pain medications can help manage pain and reduce inflammation.",
        },
      ],
      notes:
        "Seek immediate medical attention for: burns covering large areas, burns affecting hands, feet, face, groin, or major joints, third-degree burns (white or charred appearance), chemical or electrical burns.",
      video: true,
      videoId: "z_5tuB1YMK0", // NHS: How to Treat Burns
    },
    Choking: {
      title: "Choking Response",
      category: "emergencies",
      rating: 5,
      steps: [
        {
          title: "Determine severity",
          content:
            "If the person can cough forcefully, encourage them to keep coughing. If they can't speak, cough, or breathe, proceed with the following steps.",
        },
        {
          title: "Give 5 back blows",
          content:
            "Stand behind the person and slightly to one side. Support their chest with one hand and lean them forward. Give 5 sharp blows between the shoulder blades with the heel of your hand.",
        },
        {
          title: "Give 5 abdominal thrusts",
          content:
            "Stand behind the person and wrap your arms around their waist. Place your fist slightly above their navel. Grasp your fist with your other hand and pull sharply inward and upward 5 times.",
        },
        {
          title: "Alternate methods",
          content:
            "Continue alternating between 5 back blows and 5 abdominal thrusts until the object is forced out or the person becomes unresponsive.",
        },
        {
          title: "If person becomes unresponsive",
          content:
            "Lower them to the ground and begin CPR, starting with chest compressions. Before giving breaths, check the mouth for visible obstructions.",
        },
      ],
      notes: `For pregnant women or obese individuals, perform chest thrusts instead of abdominal thrusts. Call emergency services immediately if the person becomes unresponsive or if you're unable to remove the obstruction.`,
      video: true,
      videoId: "7CgtIgSyAiU", // St John Ambulance: How to Help a Choking Adult
    },
    "Heart Attack": {
      title: "Heart Attack Response",
      category: "emergencies",
      rating: 5,
      steps: [
        {
          title: "Call emergency services",
          content:
            "Call for emergency medical help immediately. Every minute counts.",
        },
        {
          title: "Have the person rest",
          content:
            "Help them to a comfortable resting position, typically sitting upright with knees bent to reduce strain on the heart.",
        },
        {
          title: "Give aspirin if available",
          content:
            "If not allergic to aspirin, give the person a regular-strength aspirin to chew slowly (unless advised not to by healthcare provider).",
        },
        {
          title: "Loosen tight clothing",
          content:
            "Loosen buttons, ties, belts, or other restrictive items to help with breathing and circulation.",
        },
        {
          title: "Monitor vital signs",
          content:
            "Keep track of breathing and pulse. Be prepared to perform CPR if the person becomes unresponsive and stops breathing normally.",
        },
      ],
      notes:
        "Common symptoms include chest pain/pressure, shortness of breath, pain in one or both arms, jaw, neck or back, cold sweat, nausea, and lightheadedness. Women may experience different symptoms than men, often including nausea, shortness of breath, and back or jaw pain.",
      video: true,
      videoId: "gDwt7dD3awc", // American Heart Association: Heart Attack Symptoms and Response
    },
    "Allergic Reaction": {
      title: "Severe Allergic Reaction (Anaphylaxis)",
      category: "medical",
      rating: 5,
      steps: [
        {
          title: "Assess severity",
          content:
            "Look for difficulty breathing, swelling of face/throat, rapid pulse, dizziness, or rash.",
        },
        {
          title: "Use epinephrine auto-injector",
          content:
            "If available and prescribed, help the person use their epinephrine auto-injector (like EpiPen) immediately.",
        },
        {
          title: "Call emergency services",
          content:
            "Even if symptoms improve after epinephrine, medical follow-up is essential.",
        },
        {
          title: "Help position the person",
          content:
            "If breathing is difficult, help them sit up. If they feel faint, have them lie flat with legs elevated.",
        },
        {
          title: "Monitor for changes",
          content:
            "Stay with the person and watch for improvements or worsening of symptoms. Be prepared to administer a second dose of epinephrine if available and symptoms return.",
        },
      ],
      notes:
        "Common triggers include certain foods, insect stings, medications, and latex. A second wave of symptoms can occur 4-8 hours after the initial reaction. Medical observation is important even if symptoms improve.",
      video: true,
      videoId: "bIqNTaRZnhs", // Mayo Clinic: Anaphylaxis Treatment
    },
  };

  const toggleBookmark = (title) => {
    if (bookmarked.includes(title)) {
      setBookmarked(bookmarked.filter((item) => item !== title));
    } else {
      setBookmarked([...bookmarked, title]);
    }
  };

  const filteredGuides = popularGuides.filter((guide) =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedGuide, setSelectedGuide] = useState("CPR");

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return null;

    const Icon = category.icon;
    return <Icon />;
  };

  // YouTube video options
  // YouTube video options
  const youtubeOptions = {
    height: "240", // Reduced height for better fitting
    width: "100%", // Adjust width to fit container without overflow
    playerVars: {
      autoplay: 0, // Auto-play disabled
      rel: 0, // Prevent showing related videos at the end
      modestbranding: 1, // Remove YouTube logo from the player
    },
  };

  // Handle YouTube player errors
  const handlePlayerError = (event) => {
    console.error("YouTube Player Error:", event.data);
    alert("An error occurred while playing the video. Please try again later.");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
              First Aid Guide
            </h1>
            <p className="text-gray-600 mt-2">
              Step-by-step emergency care instructions with illustrations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guide Index Column */}
            <div>
              <Card className="border-none shadow-md mb-6">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search first aid guides..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="all">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      {categories.map((category) => (
                        <TabsTrigger key={category.id} value={category.id}>
                          <category.icon />
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                          {filteredGuides.map((guide) => (
                            <motion.div
                              key={guide.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-3 rounded-md cursor-pointer transition-all ${
                                selectedGuide === guide.title
                                  ? "bg-blue-50 border border-blue-200"
                                  : "bg-white border border-gray-100 hover:border-blue-100"
                              }`}
                              onClick={() => setSelectedGuide(guide.title)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {getCategoryIcon(guide.category)}
                                  <span className="ml-2 font-medium text-gray-800">
                                    {guide.title}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(guide.title);
                                    }}
                                  >
                                    {bookmarked.includes(guide.title) ? (
                                      <BookmarkCheck className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <Bookmark className="h-4 w-4 text-gray-400" />
                                    )}
                                  </Button>
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {categories.map((category) => (
                      <TabsContent
                        key={category.id}
                        value={category.id}
                        className="mt-0"
                      >
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-2">
                            {filteredGuides
                              .filter((guide) => guide.category === category.id)
                              .map((guide) => (
                                <motion.div
                                  key={guide.id}
                                  whileHover={{ scale: 1.02 }}
                                  className={`p-3 rounded-md cursor-pointer transition-all ${
                                    selectedGuide === guide.title
                                      ? "bg-blue-50 border border-blue-200"
                                      : "bg-white border border-gray-100 hover:border-blue-100"
                                  }`}
                                  onClick={() => setSelectedGuide(guide.title)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      {getCategoryIcon(guide.category)}
                                      <span className="ml-2 font-medium text-gray-800">
                                        {guide.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleBookmark(guide.title);
                                        }}
                                      >
                                        {bookmarked.includes(guide.title) ? (
                                          <BookmarkCheck className="h-4 w-4 text-blue-600" />
                                        ) : (
                                          <Bookmark className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Settings Card (unchanged) */}
            </div>

            {/* Main Guide Content Column */}
            <div className="md:col-span-2">
              <Card className="border-none shadow-lg bg-white overflow-hidden">
                {selectedGuide && guidesData[selectedGuide] && (
                  <>
                    <CardHeader className="pb-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(
                              guidesData[selectedGuide].category
                            )}
                            <Badge
                              variant="outline"
                              className={`
                              ${
                                guidesData[selectedGuide].category ===
                                "emergencies"
                                  ? "bg-red-50 text-red-800 border-red-200"
                                  : guidesData[selectedGuide].category ===
                                    "injuries"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : "bg-purple-50 text-purple-800 border-purple-200"
                              }
                            `}
                            >
                              {categories.find(
                                (c) =>
                                  c.id === guidesData[selectedGuide].category
                              )?.name || guidesData[selectedGuide].category}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl font-bold">
                            {guidesData[selectedGuide].title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <ScrollArea className="h-[500px] pr-4">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Step-by-Step Walkthrough */}
                          <div className="mb-6">
                            <h3 className="font-medium text-gray-900 mb-3">
                              Step-by-Step Guide
                            </h3>
                            <div className="space-y-4">
                              {guidesData[selectedGuide].steps.map(
                                (step, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-lg border border-gray-200 p-4"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-medium text-blue-700">
                                          {index + 1}
                                        </span>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-1">
                                          {step.title}
                                        </h4>
                                        <p className="text-gray-700">
                                          {step.content}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </div>

                          {/* YouTube Video Tutorial */}
                          {guidesData[selectedGuide].video &&
                            guidesData[selectedGuide].videoId && (
                              <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-3">
                                  Video Tutorial
                                </h3>
                                <div className="bg-gray-100 rounded-md p-4">
                                  <YouTube
                                    videoId={guidesData[selectedGuide].videoId}
                                    opts={youtubeOptions}
                                    onError={handlePlayerError} // Handle errors
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            )}

                          {/* Notes and Community Tips (unchanged) */}
                        </motion.div>
                      </ScrollArea>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
        {/* <Chatbot /> */}
      </div>
      <Footer />
    </div>
  );
};

export default FirstAidGuide;
