import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const controls = useAnimation();
  const bounceControls = useAnimation();
  const { user, logout } = useAuth();
  const router = useRouter();

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


  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };


  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.email) {
        try {
          const playersRef = collection(firestore, "players");
          const q = query(playersRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setUsername(querySnapshot.docs[0].id);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <div className="relative bg-background_green from-green-300 via-yellow-300 to-pink-300 h-screen flex flex-col justify-center items-center gap-12">
      <div className="z-10 border-2 border-pale_yellow rounded-lg h-screen w-screen m-4 flex flex-col justify-center items-center gap-12 relative">
        {/* Auth Status */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          {user ? (
            <>
              <span className="text-pale_yellow">{username && `Welcome, ${username}`}</span>
              <Button
                  className="!bg-light_brown !text-norm_white hover:!bg-dark_brown"
                  size="sm"
                onClick={async () => {
                  await logout();
                  router.push("/auth");
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
            className="!bg-light_brown !text-norm_white hover:!bg-dark_brown"
            size="sm"
              onClick={() => router.push("/auth")}
            >
              Sign In
            </Button>
          )}
        </div>
        <img src="logo.gif" alt="logo" className="w-[800px]" />
        <div className="flex flex-col items-center gap-8">
          <Link href="/mode-selection">
            <motion.button
              className="w-64 bg-pale_yellow text-background_green font-bold py-4 px-8 rounded-full text-2xl hover:bg-opacity-90 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game
            </motion.button>
          </Link>
          <Link href="/leaderboard">
            <motion.button
              className="w-64 bg-pale_yellow text-background_green font-bold py-4 px-8 rounded-full text-2xl hover:bg-opacity-90 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Leaderboard
            </motion.button>
          </Link>
        </div>
        <div className="flex w-full justify-center items-center gap-12">
          <motion.img
            src="a.png"
            className="w-28"
            variants={variants}
          />
          <motion.img
            src="s.png"
            className="w-28"
            variants={variants}
          />
          <motion.img
            src="l.png"
            className="w-28"
            variants={variants}
          />
          <motion.img
            src="v.png"
            className="w-24 ml-24 animate-slowest animate-bounce "
            variants={variants}
          />
        </div>
      </div>
    </div>
  );
}
