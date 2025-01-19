import React from "react";
import { P5CanvasInstance, SketchProps, type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

type LetterKey = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 
                 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';

type ComponentProps = {
    letterToSign: string;
    success: boolean;
    gameStarted: boolean;
    gameDone: boolean;
    isWinner: boolean;
    difficulty: string;
    onLetterDropped: () => void;
};

type MySketchProps = SketchProps & ComponentProps;
  
function sketch(p5: P5CanvasInstance<MySketchProps>) {
    let currentProps: MySketchProps;
    let backgroundImage = p5.loadImage("/playfield.png");
    let letterImages: Record<LetterKey, any> = {
        "a": p5.loadImage("/letter/a.png"),
        "b": p5.loadImage("/letter/b.png"),
        "c": p5.loadImage("/letter/c.png"),
        "d": p5.loadImage("/letter/d.png"),
        "e": p5.loadImage("/letter/e.png"),
        "f": p5.loadImage("/letter/f.png"),
        "g": p5.loadImage("/letter/g.png"),
        "h": p5.loadImage("/letter/h.png"),
        "i": p5.loadImage("/letter/i.png"),
        "j": p5.loadImage("/letter/j.png"),
        "k": p5.loadImage("/letter/k.png"),
        "l": p5.loadImage("/letter/l.png"),
        "m": p5.loadImage("/letter/m.png"),
        "n": p5.loadImage("/letter/n.png"),
        "o": p5.loadImage("/letter/o.png"),
        "p": p5.loadImage("/letter/p.png"),
        "q": p5.loadImage("/letter/q.png"),
        "r": p5.loadImage("/letter/r.png"),
        "s": p5.loadImage("/letter/s.png"),
        "t": p5.loadImage("/letter/t.png"),
        "u": p5.loadImage("/letter/u.png"),
        "v": p5.loadImage("/letter/v.png"),
        "w": p5.loadImage("/letter/w.png"),
        "x": p5.loadImage("/letter/x.png"),
        "y": p5.loadImage("/letter/y.png"),
        "z": p5.loadImage("/letter/z.png"),
    } as const;
    
    let letterTopHalfImages: Record<LetterKey, any> = {
        "a": p5.loadImage("/letter-tophalf/a.png"),
        "b": p5.loadImage("/letter-tophalf/b.png"),
        "c": p5.loadImage("/letter-tophalf/c.png"),
        "d": p5.loadImage("/letter-tophalf/d.png"),
        "e": p5.loadImage("/letter-tophalf/e.png"),
        "f": p5.loadImage("/letter-tophalf/f.png"),
        "g": p5.loadImage("/letter-tophalf/g.png"),
        "h": p5.loadImage("/letter-tophalf/h.png"),
        "i": p5.loadImage("/letter-tophalf/i.png"),
        "j": p5.loadImage("/letter-tophalf/j.png"),
        "k": p5.loadImage("/letter-tophalf/k.png"),
        "l": p5.loadImage("/letter-tophalf/l.png"),
        "m": p5.loadImage("/letter-tophalf/m.png"),
        "n": p5.loadImage("/letter-tophalf/n.png"),
        "o": p5.loadImage("/letter-tophalf/o.png"),
        "p": p5.loadImage("/letter-tophalf/p.png"),
        "q": p5.loadImage("/letter-tophalf/q.png"),
        "r": p5.loadImage("/letter-tophalf/r.png"),
        "s": p5.loadImage("/letter-tophalf/s.png"),
        "t": p5.loadImage("/letter-tophalf/t.png"),
        "u": p5.loadImage("/letter-tophalf/u.png"),
        "v": p5.loadImage("/letter-tophalf/v.png"),
        "w": p5.loadImage("/letter-tophalf/w.png"),
        "x": p5.loadImage("/letter-tophalf/x.png"),
        "y": p5.loadImage("/letter-tophalf/y.png"),
        "z": p5.loadImage("/letter-tophalf/z.png"),
    } as const;

    let letterBottomHalfImages: Record<LetterKey, any> = {
        "a": p5.loadImage("/letter-bottomhalf/a.png"),
        "b": p5.loadImage("/letter-bottomhalf/b.png"),
        "c": p5.loadImage("/letter-bottomhalf/c.png"),
        "d": p5.loadImage("/letter-bottomhalf/d.png"),
        "e": p5.loadImage("/letter-bottomhalf/e.png"),
        "f": p5.loadImage("/letter-bottomhalf/f.png"),
        "g": p5.loadImage("/letter-bottomhalf/g.png"),
        "h": p5.loadImage("/letter-bottomhalf/h.png"),
        "i": p5.loadImage("/letter-bottomhalf/i.png"),
        "j": p5.loadImage("/letter-bottomhalf/j.png"),
        "k": p5.loadImage("/letter-bottomhalf/k.png"),
        "l": p5.loadImage("/letter-bottomhalf/l.png"),
        "m": p5.loadImage("/letter-bottomhalf/m.png"),
        "n": p5.loadImage("/letter-bottomhalf/n.png"),
        "o": p5.loadImage("/letter-bottomhalf/o.png"),
        "p": p5.loadImage("/letter-bottomhalf/p.png"),
        "q": p5.loadImage("/letter-bottomhalf/q.png"),
        "r": p5.loadImage("/letter-bottomhalf/r.png"),
        "s": p5.loadImage("/letter-bottomhalf/s.png"),
        "t": p5.loadImage("/letter-bottomhalf/t.png"),
        "u": p5.loadImage("/letter-bottomhalf/u.png"),
        "v": p5.loadImage("/letter-bottomhalf/v.png"),
        "w": p5.loadImage("/letter-bottomhalf/w.png"),
        "x": p5.loadImage("/letter-bottomhalf/x.png"),
        "y": p5.loadImage("/letter-bottomhalf/y.png"),
        "z": p5.loadImage("/letter-bottomhalf/z.png"),
    } as const;

    let splatterImage = p5.loadImage("/splatter.png");
    let splatterHues: Record<LetterKey, number> = {
        "a": 260,
        "b": 48,
        "c": 0,
        "d": 147,
        "e": 180,
        "f": 123,
        "g": 75,
        "h": 336,
        "i": 214,
        "j": 134,
        "k": 48,
        "l": 126,
        "m": 175,
        "n": 123,
        "o": 36,
        "p": 173,
        "q": 13,
        "r": 280,
        "s": 120,
        "t": 214,
        "u": 180,
        "v": 300,
        "w": 240,
        "x": 0,
        "y": 60,
        "z": 48,
    } as const;

    let getReadyImage = p5.loadImage("/get_ready.png");
    let goImage = p5.loadImage("/go.png");
    let winImage = p5.loadImage("/you_win.png");
    
    p5.setup = () => {
        p5.createCanvas(1000, 600)
        p5.textSize(92);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textFont("monospace");
    };

    p5.frameRate(60);
    
    let letterToSign = "";
    let letterX = 0;
    let letterY = 0;
    let letterXVelocity = 0;
    let letterYVelocity = 0;
    let baseSpeed = 1; // Base speed multiplier
    let letterRotation = 0;
    let letterRotationVelocity = 0;
    let shattered = false;
    let hasReachedPeak = false;

    let fragmentX = 0;
    let fragmentY = 0;
    let fragmentXVelocity = 0;
    let fragmentYVelocity = 0;
    let fragmentRotation = 0;
    let fragmentRotationVelocity = 0;

    let shatterAnimation = 0;
    let shatterX = 0;
    let shatterY = 0;

    let gameStartedAnimation = 0;

    let gameStarted = false;
    let gameDone = false;
    let isWinner = false;

    const PEAK_HEIGHT = p5.height * 0.3; // Stop rising at 30% from top of screen
    const BASE_GRAVITY = 0.2; // Increased base gravity
    const BASE_INITIAL_VELOCITY = -12; // Adjusted initial velocity

    p5.updateWithProps = (props: MySketchProps) => {
        currentProps = props;
        if (props.letterToSign && letterToSign !== props.letterToSign) {
            letterToSign = props.letterToSign.toLowerCase() as LetterKey;
            let newXVelocity = p5.random(-2, 2); // Reduced horizontal movement
            letterX = (p5.width / 2) - (newXVelocity * p5.width / 8);
            letterY = p5.height;
            letterXVelocity = newXVelocity;
            hasReachedPeak = false;

            // Adjust speed based on difficulty
            if (props.difficulty === "easy") {
                baseSpeed = 0.6;
            } else if (props.difficulty === "medium") {
                baseSpeed = 1;
            } else if (props.difficulty === "hard") {
                baseSpeed = 1.6;
            }
            
            letterYVelocity = BASE_INITIAL_VELOCITY * baseSpeed;
            letterRotation = 0;
            letterRotationVelocity = p5.random(-0.001, 0.001);
        }

        if (props.gameStarted !== undefined) {
            if (props.gameStarted && !gameStarted) {
                gameStartedAnimation = 200;
            }
            gameStarted = props.gameStarted;
        }

        if (props.gameDone !== undefined) {
            gameDone = props.gameDone;
        }

        if (props.isWinner !== undefined) {
            isWinner = props.isWinner;
        }

        if (props.success !== undefined) {
            shattered = props.success;

            if (shattered) {
                fragmentX = letterX;
                fragmentY = letterY;
                fragmentXVelocity = letterXVelocity + p5.random(-3, 3);
                fragmentYVelocity = letterYVelocity + p5.random(-2, 2);
                fragmentRotation = letterRotation;
                fragmentRotationVelocity = letterRotationVelocity + p5.random(-0.01, 0.01);

                letterXVelocity += p5.random(-3, 3);
                letterYVelocity += p5.random(-2, 2);
                letterRotationVelocity += p5.random(-0.01, 0.01);

                shatterAnimation = 200;
                shatterX = letterX;
                shatterY = letterY;
            }
        }
    };

    function drawLetter(letter: LetterKey, x: number, y: number, rotation: number, justTopHalf: boolean = false, justBottomHalf: boolean = false) {
        p5.push();
        p5.translate(x, y);
        p5.rotate(rotation);
        let image = letterImages[letter];

        if (image === undefined) {
            p5.text(letterToSign, 0, 0);
        }
        else if (justTopHalf) {
            image = letterTopHalfImages[letter];
            p5.image(image, 0, 25, 100, 50);
        }
        else if (justBottomHalf) {
            image = letterBottomHalfImages[letter];
            p5.image(image, 0, 75, 100, 50);
        }
        else {
            p5.image(image, 0, 0, 100, 100);
        }

        p5.pop();
    }

    p5.draw = () => {
        // Update letter position
        letterX += letterXVelocity;
        letterY += letterYVelocity;

        // Check if letter has fallen off screen
        if (letterY > p5.height + 100) { // Add buffer for letter height
            currentProps.onLetterDropped();
        }

        // Check if letter has reached peak height
        if (letterY <= PEAK_HEIGHT && !hasReachedPeak) {
            hasReachedPeak = true;
            letterYVelocity = 0; // Stop upward movement
        }

        // Apply gravity after reaching peak
        if (hasReachedPeak) {
            letterYVelocity += BASE_GRAVITY * baseSpeed;
        }

        letterRotation += letterRotationVelocity;

        // Keep letter within horizontal bounds
        if (letterX < 100 || letterX > p5.width - 100) {
            letterXVelocity *= -0.8; // Bounce off edges with reduced velocity
        }

        if (shattered) {
            fragmentX += fragmentXVelocity;
            fragmentY += fragmentYVelocity;
            fragmentYVelocity += BASE_GRAVITY * baseSpeed;
            fragmentRotation += fragmentRotationVelocity;
        }

        p5.imageMode(p5.CORNER);
        p5.image(backgroundImage, 0, 0, p5.width, p5.height);
        p5.imageMode(p5.CENTER);
        
        p5.background(0, 255, 0, p5.max(shatterAnimation - 120, 0));
        
        if (shatterAnimation > 0) {
            shatterAnimation -= 1;
        }

        p5.pop();
        p5.tint(splatterHues[letterToSign as LetterKey], 255, 255, shatterAnimation);
        p5.image(splatterImage, shatterX, shatterY, 200, 200);
        p5.tint(255, 255, 255, 255);
        p5.push();

        p5.push();
        p5.translate(p5.width / 2, p5.height / 2);
        
        if (gameStartedAnimation > 0) {
            gameStartedAnimation -= 1;
            p5.tint(255, 255, 255, gameStartedAnimation);
            p5.image(goImage, 0, 0, 500, 350);
            p5.tint(255, 255, 255, 255);
        }
        
        if (gameDone && isWinner) {
            p5.rotate(p5.sin(p5.frameCount / 15) * 0.05);
            p5.image(winImage, 0, 0, 1080, 500);
        }

        if (!gameStarted) {
            p5.rotate(p5.sin(p5.frameCount / 15) * 0.05);
            p5.image(getReadyImage, 0, 0, 1080, 500);
        }

        p5.pop();

        if (shattered) {
            drawLetter(letterToSign as LetterKey, fragmentX, fragmentY, fragmentRotation, true, false);
            drawLetter(letterToSign as LetterKey, letterX, letterY, letterRotation, false, true);
        } else {
            drawLetter(letterToSign as LetterKey, letterX, letterY, letterRotation);
        }
    };
}

export default function Page(props: ComponentProps) {
    return (
        <NextReactP5Wrapper 
            sketch={sketch} 
            letterToSign={props.letterToSign} 
            success={props.success} 
            gameStarted={props.gameStarted} 
            gameDone={props.gameDone} 
            isWinner={true} 
            difficulty={props.difficulty}
            onLetterDropped={props.onLetterDropped}
        />
    );
}
