import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Link from "next/link";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const toast = useToast();
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

  const handleAuth = async (action: "signin" | "signup") => {
    if (action === "signup" && !username) {
      toast({
        title: "Error",
        description: "Please enter a username",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (action === "signin") {
        await signIn(email, password);
      } else {
        // Sign up the user
        await signUp(email, password);

        // Create a new player document with the username
        await setDoc(doc(firestore, "players", username), {
          score: 0,
          email: email,
        });
      }

      toast({
        title: "Success",
        description:
          action === "signin"
            ? "Signed in successfully!"
            : "Account created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/"); // Redirect to home page after successful auth
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background_green">
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

      <div className="bg-pale_yellow p-8 rounded-lg shadow-lg w-2/5">
        <Heading mb={6} textAlign="center">
          Welcome
        </Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb="0">
            <Tab
              _selected={{ color: "white", bg: "#252927" }}
              _hover={{ color: "white", bg: "#252927" }}
            >
              Sign In
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#252927" }}
              _hover={{ color: "white", bg: "#252927" }}
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            {/* Sign In Panel */}
            <TabPanel className="bg-background_green rounded-b-md">
              <Stack spacing={10}>
                <FormControl id="email">
                  <FormLabel className="text-norm_white">
                    Email address
                  </FormLabel>
                  <Input
                    className="text-norm_white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel className="text-norm_white">Password</FormLabel>
                  <Input
                    className="text-norm_white"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button
                  className="!bg-light_brown !text-norm_white hover:!bg-dark_brown"
                  isLoading={isLoading}
                  onClick={() => handleAuth("signin")}
                >
                  Sign In
                </Button>
              </Stack>
            </TabPanel>

            {/* Sign Up Panel */}
            <TabPanel className="bg-background_green">
              <Stack spacing={10}>
                <FormControl id="username-signup">
                  <FormLabel className="text-norm_white">Username</FormLabel>
                  <Input
                    className="text-norm_white"
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl id="email-signup">
                  <FormLabel className="text-norm_white">
                    Email address
                  </FormLabel>
                  <Input
                    className="text-norm_white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password-signup">
                  <FormLabel className="text-norm_white">Password</FormLabel>
                  <Input
                    className="text-norm_white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button
                  className="!bg-light_brown !text-norm_white hover:!bg-dark_brown"
                  isLoading={isLoading}
                  onClick={() => handleAuth("signup")}
                >
                  Sign Up
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
