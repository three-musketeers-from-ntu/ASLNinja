import React, { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";

interface Gesture {
    name: string;
    confidence: number;
}

interface HandPoseResult {
    landmarks: number[][];
}

interface GestureEstimatorResult {
    poseData: [string, string, string][];
    gestures: Gesture[];
}
import Webcam from "react-webcam";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { drawHand } from "./handposeutil";
import * as fp from "fingerpose";
import Handsigns from "../components/handsigns";

import { Text, Heading, Image, Container, Box, VStack } from "@chakra-ui/react";

import { model } from "@tensorflow/tfjs";

export const Signpass = [
    {
        alt: "A",
    },
    {
        alt: "B",
    },
    {
        alt: "C",
    },
    {
        alt: "D",
    },
    {
        alt: "E",
    },
    {
        alt: "F",
    },
    {
        alt: "G",
    },
    {
        alt: "H",
    },
    {
        alt: "I",
    },
    {
        alt: "J",
    },
    {
        alt: "K",
    },
    {
        alt: "L",
    },
    {
        alt: "M",
    },
    {
        alt: "N",
    },
    {
        alt: "O",
    },
    {
        alt: "P",
    },
    {
        alt: "Q",
    },
    {
        alt: "R",
    },
    {
        alt: "S",
    },
    {
        alt: "T",
    },
    {
        alt: "U",
    },
    {
        alt: "V",
    },
    {
        alt: "W",
    },
    {
        alt: "X",
    },
    {
        alt: "Y",
    },
    {
        alt: "Z",
    },
];

export default function Cam({
    letterToSign,
    setStatus,
    setConfidence,
    setIsLoading,
}: {
    letterToSign: string;
    setStatus: Dispatch<SetStateAction<boolean>>;
    setConfidence: Dispatch<SetStateAction<number>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [camState, setCamState] = useState("on");

    const [sign, setSign] = useState<string | null>(null);

    let signList:any = [];
    let currentSign = 0;

    let gamestate = "started";

    // let net;

    async function runHandpose() {
        const net = await handpose.load();
        _signList();
        setIsLoading(false);

        setInterval(() => {
            detect(net);
        }, 150);
    }

    function _signList() {
        signList = generateSigns();
    }

    function shuffle(a: any) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function generateSigns() {
        const password = shuffle(Signpass);
        return password;
    }

    async function detect(net: any) {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video?.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = video?.videoWidth ?? 640;
            const videoHeight = video?.videoHeight ?? 480;

            // Set video width
            if (video) {
                video.width = videoWidth;
                video.height = videoHeight;
            }

            // Set canvas height and width
            if (canvasRef.current) {
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
            }

            // Make Detections
            const hand = await net.estimateHands(video);

            if (hand.length > 0) {
                //loading the fingerpose model
                const GE = new fp.GestureEstimator([
                    fp.Gestures.ThumbsUpGesture,
                    Handsigns.aSign,
                    Handsigns.bSign,
                    Handsigns.cSign,
                    Handsigns.dSign,
                    Handsigns.eSign,
                    Handsigns.fSign,
                    Handsigns.gSign,
                    Handsigns.hSign,
                    Handsigns.iSign,
                    Handsigns.jSign,
                    Handsigns.kSign,
                    Handsigns.lSign,
                    Handsigns.mSign,
                    Handsigns.nSign,
                    Handsigns.oSign,
                    Handsigns.pSign,
                    Handsigns.qSign,
                    Handsigns.rSign,
                    Handsigns.sSign,
                    Handsigns.tSign,
                    Handsigns.uSign,
                    Handsigns.vSign,
                    Handsigns.wSign,
                    Handsigns.xSign,
                    Handsigns.ySign,
                    Handsigns.zSign,
                ]);

                const estimatedGestures = await GE.estimate(
                    hand[0].landmarks,
                    6.5
                ) as unknown as GestureEstimatorResult;

                if (
                    estimatedGestures.gestures !== undefined &&
                    estimatedGestures.gestures.length > 0
                ) {
                    const confidence = estimatedGestures.gestures.map(
                        (p) => p.confidence
                    );
                    const maxConfidence = confidence.indexOf(
                        Math.max.apply(undefined, confidence)
                    );

                    const model_overall_confidence =
                        estimatedGestures.gestures[maxConfidence].confidence /
                        9;
                    setConfidence(model_overall_confidence);

                    //setting up game state, looking for thumb emoji
                    gamestate = "played";
                    if (gamestate === "played") {
                        if (
                            signList[currentSign].alt ===
                            estimatedGestures.gestures[maxConfidence].name
                        ) {
                            currentSign++;
                        }
                        setSign(estimatedGestures.gestures[maxConfidence].name);
                        if (
                            letterToSign.toLowerCase() ===
                            estimatedGestures.gestures[
                                maxConfidence
                            ].name.toLowerCase()
                        ) {
                            // setStatus(true)
                        }
                    } else if (gamestate === "finished") {
                        return;
                    }
                }
            }
            // Draw hand lines
            const ctx = canvasRef.current?.getContext("2d", {
                willReadFrequently: true,
            });
            drawHand(hand, ctx);
        }
    }

    useEffect(() => {
        runHandpose();
    }, []);

    return (
        <div className="absolute" style={{ zIndex: 0 }}>
            <Container centerContent maxW="xl" height="20vh" pt="0" pb="0">
                <VStack spacing={4} align="center"></VStack>

                <Box id="webcam-container">
                    {camState === "on" ? (
                        <div className="overflow-hidden rounded-lg">
                            <Webcam id="webcam" ref={webcamRef} />
                        </div>
                    ) : (
                        <div id="webcam"></div>
                    )}

                    {sign ? (
                        <div
                            style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                right: "calc(50% - 50px)",
                                bottom: 100,
                                textAlign: "center",
                            }}
                        >
                            <p id="signLabel">{sign}</p>
                        </div>
                    ) : (
                        " "
                    )}
                </Box>

                <canvas id="gesture-canvas" ref={canvasRef} style={{}} />

                <Box
                    id="singmoji"
                    style={{
                        zIndex: 9,
                        position: "fixed",
                        top: "50px",
                        right: "30px",
                    }}
                ></Box>
            </Container>
        </div>
    );
}
