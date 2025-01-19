import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

type PlayerScore = {
  username: string;
  score: number;
  email: string;
};

export default function Leaderboard() {
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
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

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const playersRef = collection(firestore, "players");
        const q = query(
          playersRef, 
          where("score", ">", 0), 
          orderBy("score", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        
        const scores: PlayerScore[] = [];
        querySnapshot.forEach((doc) => {
          scores.push({
            username: doc.id, // document ID is the username
            score: doc.data().score,
            email: doc.data().email
          });
        });
        
        setPlayerScores(scores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="relative bg-background_green from-green-300 via-yellow-300 to-pink-300 h-screen flex flex-col justify-center items-center gap-12">
      <div className="z-10 border-2 border-pale_yellow rounded-lg h-screen w-screen m-4 flex flex-col justify-center items-center gap-12 relative">
        {/* Header with back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <img 
              src="back.svg" 
              className="w-12 fill-current text-pale_yellow cursor-pointer hover:opacity-80 transition-opacity" 
              alt="Back to home"
            />
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <img src="logo.png" className="w-32" alt="Logo"/>
        </div>

        {/* Leaderboard Content */}
        <div className="bg-pale_yellow p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
          <Heading as="h1" size="xl" mb={6} textAlign="center" color="light_brown">
            Top 10 Leaderboard 🏆
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Rank</Th>
                  <Th>Player</Th>
                  <Th isNumeric>Score</Th>
                </Tr>
              </Thead>
              <Tbody>
                {playerScores.map((player, index) => (
                  <Tr key={player.username}>
                    <Td fontWeight="bold">{index + 1}</Td>
                    <Td>{player.username}</Td>
                    <Td isNumeric>{player.score}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <img
        src="y.png"
        className="absolute w-48 h-48 z-0 bottom-24 right-24 animate-pulse"
      />
      <img
        src="s.png"
        className="absolute w-48 h-48 z-0 top-24 left-24 animate-pulse"
      />
      <img
        src="l.png"
        className="absolute w-48 h-48 z-1 left-64 top-96 animate-pulse"
      />
      <img
        src="r.png"
        className="absolute w-48 h-48 z-2 top-36 right-64 animate-pulse"
      />
    </div>
  );
}
