import Image from "next/image";
import { Inter } from "next/font/google";
import GameWindow from "@/components/GameWindow";
import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import random, { RNG } from "random";
import seedrandom from "seedrandom";
import Cam from "@/components/Cam";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  onSnapshot,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { string } from "prop-types";
import { useToast, Spinner, Center, VStack, Text, Button, Box, ButtonGroup } from "@chakra-ui/react";
import { useAuth } from '@/context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

random.use(seedrandom("coSign6") as unknown as RNG);

// const goodLetters = "abcdhilopr";
const goodLetters = "abcdefghijklmnopqrstuvwxyz";

export default function Game() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [letterToSign, setLetterToSign] = useState("");
  const [success, setSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [confidenceForThisLetter, setConfidenceForThisLetter] = useState(0);
  const [gameDone, setGameDone] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [topScore, setTopScore] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [hasScored, setHasScored] = useState(false);
  const [username, setUsername] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const mode = router.query.mode as string;
  const toast = useToast();

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  let ender;

  async function beginGame() {
    setTimeLeft(selectedDuration + 3);
    setGameStarted(true);
    setCurrentScore(0);
    setHasScored(false);
    let randomLetter = goodLetters[random.int(0, goodLetters.length - 1)];
    setLetterToSign(randomLetter);
  }


  useEffect(() => {
    const funky = async () => {
      setIsLoading(false);
    };
    funky();
  }, []);

  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (checkInterval.current) {
      clearInterval(checkInterval.current);
    }

    checkInterval.current = setInterval(() => {
      let currLetter = document.getElementById("signLabel");
      let expected = document.getElementById("expected");
      let conf = document.getElementById("confidence");

      if (
        !success &&
        !hasScored &&
        currLetter?.innerHTML.toLowerCase() ===
          expected?.innerHTML.toLowerCase()
      ) {
        setSuccess(true);
        setConfidenceForThisLetter(Number(conf?.innerHTML));
        setCurrentScore((prev) => prev + 1);
        setHasScored(true);
      }
    }, 1000);

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [success, hasScored, letterToSign]);

  useEffect(() => {
    if (!gameStarted) return;

    if (timeLeft <= 3) {
      setGameDone(true);
    }

    if (timeLeft === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const getUsernameByEmail = async (email: string) => {
    try {
      const playersRef = collection(firestore, "players");
      const q = query(playersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const username = querySnapshot.docs[0].id;
        setUsername(username);
        return username;
      }
      return null;
    } catch (error) {
      console.error("Error getting username:", error);
      return null;
    }
  };

  const getUserHighScore = async (username: string) => {
    try {
      const playerRef = doc(firestore, "players", username);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const score = playerDoc.data().score || 0;
        setTopScore(score);
      }
    } catch (error) {
      console.error("Error getting user's high score:", error);
    }
  };

  const updateHighScore = async (username: string, newScore: number) => {
    try {
      const playerRef = doc(firestore, "players", username);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const currentHighScore = playerDoc.data().score || 0;
        
        if (newScore > currentHighScore) {
          await updateDoc(playerRef, {
            score: newScore
          });
          toast({
            title: "New High Score!",
            description: `Your score of ${newScore} is a new personal best!`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating high score:", error);
    }
  };

  // Add useEffect to get username when component mounts
  useEffect(() => {
    if (user?.email) {
      getUsernameByEmail(user.email).then((username) => {
        if (username) {
          getUserHighScore(username);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (timeLeft === 0 && gameStarted) {
      setGameDone(true);
      
      // Update high score if user is logged in and we have their username
      if (user?.email && username && mode !== "practice") {
        updateHighScore(username, currentScore);
      }
    }
  }, [timeLeft, gameStarted]);

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 justify-center bg-background_green">
      <div className={`${isLoading ? "hidden" : ""}`}>
        <Cam
          letterToSign={letterToSign}
          setStatus={setSuccess}
          setConfidence={setConfidence}
          setIsLoading={setIsLoading}
        />
      </div>

      {isLoading && (
        <Center className="min-h-screen w-full bg-black z-100">
          <VStack spacing={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#A8937E"
              size="xl"
            />
            <Text color="#A8937E" fontSize="xl" fontWeight="medium">
              Game Loading...
            </Text>
          </VStack>
        </Center>
      )}
      <div
        className="flex justify-between w-screen px-8 items-center align-center pt-4"
        style={{ position: "relative", zIndex: 10 }}
      >
        <Link href="/mode-selection">
          <img
            src="back.svg"
            className="w-12 fill-current text-pale_yellow cursor-pointer hover:opacity-80 transition-opacity"
            alt="Back to mode selection"
          />
        </Link>
        <div className="flex gap-2">
          <img src="logo.png" className="w-32"></img>
        </div>
        <div></div>
      </div>
      <div className="flex gap-4">
        <div className="mx-auto px-12 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md flex flex-col items-center">
          <p className="text-4xl font-bold text-center mt-4 text-light_brown">
            {timeLeft > 3
              ? `${Math.floor((timeLeft - 3) / 60)}:${String(
                  (timeLeft - 3) % 60
                ).padStart(2, "0")}`
              : timeLeft > 0
              ? timeLeft
              : ""}
          </p>

          <p id="confidence" className="text-xs text-green-500 invisible">
            {confidence}
          </p>
          <p className="text-xs invisible">{confidenceForThisLetter}</p>
          <p id="expected" className="text-xs invisible">
            {letterToSign}
          </p>

          {mode == "practice" ? (
            <div>
              {mode == "practice" && letterToSign != "" && (
                <div className="justify-center flex">
                  <img src={`asl/${letterToSign}.png`} className="w-full max-w-lg" />
                </div>
              )}
            </div>
          ) : (
            <>
            {/* Current Score Section - Only show when game has started */}
            {gameStarted && (
              <>
                <div className="mt-4 mb-2">
                  <h3 className="text-2xl font-semibold text-light_brown">
                    Current Score: {currentScore}
                  </h3>
                </div>
                {gameDone && (
                  <button
                    className="w-full text-lg font-semibold z-50 border-2 border-light_brown text-center bg-blue-500 text-white py-3 px-8 rounded-md mt-6 mb-4 font-sans hover:bg-green-500 hover:border-green-600 transition-all"
                    onClick={() => router.push('/leaderboard')}
                  >
                    Go to Leaderboard
                  </button>
                )}
              </>
            )}

              {/* Settings sections - Only show before game starts */}
              {!gameStarted && (
                <div className="space-y-8">
                  {/* Top Score Section */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-light_brown mb-2">
                      Your High Score: {topScore}
                    </h3>
                  </div>

                  {/* Difficulty Section */}
                  <div className="flex flex-col items-center gap-4 mt-4 mb-8 w-full">
                    <h3 className="text-2xl font-semibold text-light_brown">
                      Difficulty
                    </h3>
                    <div className="flex flex-col gap-3 w-full">
                      <button
                        className={`px-6 py-2 rounded-md border-2 text-lg transition-all ${
                          difficulty === "easy"
                            ? "bg-[#A8937E] !text-white border-[#A8937E]"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                        onClick={() => {
                          setDifficulty("easy");
                        }}
                      >
                        Easy
                      </button>
                      <button
                        className={`px-6 py-2 rounded-md border-2 text-lg transition-all ${
                          difficulty === "medium"
                            ? "bg-[#A8937E] text-white border-[#A8937E]"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                        onClick={() => {
                          setDifficulty("medium");
                        }}
                      >
                        Medium
                      </button>
                      <button
                        className={`px-6 py-2 rounded-md border-2 text-lg transition-all ${
                          difficulty === "hard"
                            ? "bg-[#A8937E] text-white border-[#A8937E]"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                        onClick={() => {
                          setDifficulty("hard");
                        }}
                      >
                        Hard
                      </button>
                    </div>
                  </div>

                  {/* Game Duration Section */}
                  <div className="flex flex-col gap-4 mt-4 w-full">
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-xl font-semibold">
                        Game Duration (seconds):
                      </label>
                      <select
                        value={selectedDuration}
                        onChange={(e) =>
                          setSelectedDuration(Number(e.target.value))
                        }
                        className="w-full px-4 py-2 rounded-md border-2 border-light_brown bg-white text-lg"
                      >
                        <option value={30}>30 seconds</option>
                        <option value={60}>60 seconds</option>
                        <option value={90}>90 seconds</option>
                        <option value={120}>120 seconds</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Start button - Only show before game starts */}
          {!gameStarted && (
            <button
              className="w-full text-lg font-semibold z-50 border-2 border-light_brown text-center bg-blue-500 text-white py-3 px-8 rounded-md mt-6 mb-4 font-sans hover:bg-green-500 hover:border-green-600 transition-all"
              onClick={() => {
                if (mode !== "practice") {
                  if (!difficulty) {
                    toast({
                      title: "Select Difficulty",
                      description: "Please select a difficulty level before starting",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                      position: "bottom",
                    });
                    return;
                  }
                }
                beginGame();
              }}
            >
              Start
            </button>
          )}
        </div>
        <div className="mx-auto p-4 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md">
          <GameWindow
            letterToSign={letterToSign}
            success={success}
            gameStarted={gameStarted}
            gameDone={gameDone}
            isWinner={isWinner}
            difficulty={difficulty || "easy"}
            onLetterDropped={() => {
              if (gameStarted && !gameDone) {
                let randomLetter = letterToSign;
                while (randomLetter === letterToSign) {
                  randomLetter = goodLetters[random.int(0, goodLetters.length - 1)];
                }
                setLetterToSign(randomLetter);
                setSuccess(false);
                setHasScored(false);
              }
            }}
          />
        </div>
      </div>
      <a
        href="https://en.wikipedia.org/wiki/American_manual_alphabet"
        className=" font-bold text-pale_yellow flex justify-center items-center gap-2 pb-8"
      >
        <img src="resources.svg" className="w-6" />
        <div className="hover:underline ">Learn more about ASL</div>
      </a>
    </div>
  );
}
