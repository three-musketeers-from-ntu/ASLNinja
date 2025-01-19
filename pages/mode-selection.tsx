import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Button, VStack, Heading, Box } from "@chakra-ui/react";
import Link from "next/link";

export default function ModeSelection() {
  const router = useRouter();

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative bg-background_green from-green-300 via-yellow-300 to-pink-300 h-screen flex flex-col justify-center items-center">
      <div className="z-10 border-2 border-pale_yellow rounded-lg h-screen w-screen m-4 flex flex-col justify-center items-center relative">
        {/* Header with back button and logo */}
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

        {/* Mode Selection Box */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto px-20 py-16 bg-pale_yellow border-4 border-light_brown rounded-lg shadow-md min-w-[400px]">
            <Heading size="lg" className="text-dark_brown text- mb-8 text-center">Select Game Mode</Heading>
            <VStack spacing={8}>
              <Button
                size="lg"
                colorScheme="green"
                className="w-64 h-16 text-xl"
                onClick={() => router.push('/game?mode=practice')}
              >
                Practice Mode
              </Button>
              <Button
                size="lg"
                colorScheme="yellow"
                className="w-64 h-16 text-xl"
                onClick={() => router.push('/game?mode=timed')}
              >
                Timed Mode
              </Button>
            </VStack>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
