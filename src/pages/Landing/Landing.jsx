import {
  Box,
  chakra,
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import anime from "animejs";
import { useEffect, useState } from "react";
import { genres } from "./genres";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../context/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { ButtonLg } from "../../components";

const randomCoords = (min, max) => anime.random(min, max);

function animateFrames() {
  anime
    .timeline({ loop: false })
    .add({
      targets: ".ml10 .letter",
      rotateY: [-90, 0],
      opacity: [0, 1],
      duration: 1300,
      delay: (el, i) => 45 * i,
    })
    .add({
      targets: ".ml10",
      opacity: 1,
      duration: 1000,
      easing: "easeOutBack",
      delay: 1000,
    })
    .add({
      targets: ".ml16 .letter",
      translateY: [-100, 0],
      translateX: -140,
      easing: "easeOutBack",
      opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      duration: 1400,
      delay: (el, i) => 30 * i,
    })
    .add({
      targets: ".ml16",
      translateX: 0,
      opacity: 1,
      duration: 1000,
      easing: "easeOutBack",
      delay: 1000,
    });
  anime({
    targets: ".frame",
    translateX: () => randomCoords(-1000, 1000),
    translateY: () => randomCoords(-500, 500),
    scale: [0, () => randomCoords(1, 4)],
    easing: "easeOutSine",
    duration: () => randomCoords(1000, 6000),
    delay: anime.stagger(100),
    direction: "alternate",
    loop: true,
  });
  anime({
    targets: ".bubble",
    scale: ["0.8", "1.4"],
    opacity: ["1", 0],
    easing: "easeOutCubic",
    duration: 1500,
    loop: true,
  });
}

// const SolanaSvg = ({ h }) => (
//   <svg
//     width={(97 / 84) * h}
//     height={h}
//     viewBox="0 0 96 84"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <g clip-path="url(#clip0)">
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M17.368 64.052C17.669 63.7209 18.0359 63.4563 18.445 63.2752C18.8541 63.094 19.2966 63.0003 19.744 63L93.056 63.06C93.3682 63.0606 93.6735 63.1519 93.9349 63.3228C94.1962 63.4936 94.4023 63.7367 94.5281 64.0224C94.6539 64.3081 94.694 64.6242 94.6436 64.9323C94.5932 65.2404 94.4544 65.5273 94.244 65.758L78.632 82.948C78.3308 83.2793 77.9637 83.5441 77.5542 83.7252C77.1447 83.9064 76.7018 84 76.254 84L2.94405 83.94C2.63185 83.9394 2.32654 83.8481 2.06523 83.6772C1.80391 83.5064 1.59783 83.2634 1.47202 82.9776C1.3462 82.6919 1.30607 82.3758 1.35649 82.0677C1.40691 81.7596 1.54572 81.4727 1.75605 81.242L17.368 64.052ZM94.244 49.742C94.4544 49.9727 94.5932 50.2596 94.6436 50.5677C94.694 50.8758 94.6539 51.1919 94.5281 51.4776C94.4023 51.7634 94.1962 52.0064 93.9349 52.1772C93.6735 52.3481 93.3682 52.4394 93.056 52.44L19.746 52.5C19.2983 52.5 18.8554 52.4064 18.4459 52.2252C18.0364 52.0441 17.6693 51.7793 17.368 51.448L1.75605 34.248C1.54572 34.0173 1.40691 33.7304 1.35649 33.4223C1.30607 33.1142 1.3462 32.7981 1.47202 32.5124C1.59783 32.2266 1.80391 31.9836 2.06523 31.8128C2.32654 31.6419 2.63185 31.5506 2.94405 31.55L76.256 31.49C76.7035 31.4903 77.146 31.584 77.5551 31.7652C77.9642 31.9463 78.3311 32.2109 78.632 32.542L94.244 49.742ZM17.368 1.052C17.669 0.720916 18.0359 0.456328 18.445 0.275176C18.8541 0.0940234 19.2966 0.000298083 19.744 0L93.056 0.06C93.3682 0.0606347 93.6735 0.151917 93.9349 0.322758C94.1962 0.493599 94.4023 0.736647 94.5281 1.02238C94.6539 1.30811 94.694 1.62423 94.6436 1.93234C94.5932 2.24044 94.4544 2.52728 94.244 2.758L78.632 19.948C78.3308 20.2793 77.9637 20.5441 77.5542 20.7252C77.1447 20.9064 76.7018 21 76.254 21L2.94405 20.94C2.63185 20.9394 2.32654 20.8481 2.06523 20.6772C1.80391 20.5064 1.59783 20.2634 1.47202 19.9776C1.3462 19.6919 1.30607 19.3758 1.35649 19.0677C1.40691 18.7596 1.54572 18.4727 1.75605 18.242L17.368 1.052Z"
//         fill="url(#paint0_linear)"
//       />
//     </g>
//     <defs>
//       <linearGradient
//         id="paint0_linear"
//         x1="4.16805"
//         y1="85.832"
//         x2="91.8321"
//         y2="-1.832"
//         gradientUnits="userSpaceOnUse"
//       >
//         <stop stop-color="#9945FF" />
//         <stop offset="0.2" stopColor="#7962E7" />
//         <stop offset="1" stopColor="#00D18C" />
//       </linearGradient>
//       <clipPath id="clip0">
//         <rect width="96" height="84" fill="white" />
//       </clipPath>
//     </defs>
//   </svg>
// );

function LandingButton({ value }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  switch (value) {
    case "signIn":
      return (
        <ButtonLg
          label="Let's Begin"
          callback={() => {
            signIn();
          }}
        />
      );
    case "wallet":
      return (
        <ButtonLg
          label="Connect Wallet"
          callback={() => {
            console.log("wallet connecting...");
          }}
        />
      );
    case "cred":
      return (
        <ButtonLg
          label="Go to Home"
          callback={() => {
            navigate("/home");
          }}
        />
      );
    default:
      return null;
  }
}

export default function Home() {
  const {
    authState: { isLoggedIn },
  } = useAuth();
  const [stepButton, setStepButton] = useState("signIn");
  useEffect(() => {
    animateFrames();
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      setStepButton("wallet");
    } else {
      setStepButton("signIn");
    }
  }, [isLoggedIn]);

  return (
    <Flex bg="#171923" w="100vw" h="100vh" pos="relative">
      <Flex
        overflow="hidden"
        maxW="100vw"
        maxH="100vh"
        w="100%"
        h="100%"
        align="center"
        justify="center"
        pos="absolute"
        zIndex="0"
      >
        {[...Array(200)].map((_, i) => (
          <Box
            className="frame"
            bgImage={`https://source.unsplash.com/1600x900/?${
              genres[randomCoords(0, genres.length)]
            }`}
          ></Box>
        ))}
      </Flex>
      <Stack
        w="full"
        h="full"
        pos="relative"
        zIndex="1"
        flexDir="column"
        align="center"
        justify="center"
        textAlign="center"
        spacing={[4, 4, 6, 8, 12]}
        bgGradient="radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 0%, rgba(100,100,100,0.3) 100%)"
      >
        <Heading
          className="ml10"
          textAlign="center"
          color="whiteAlpha.900"
          fontSize={["3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"]}
        >
          {"NFT SOCIAL NETWORK".split("").map((letter, i) => (
            <chakra.span fontWeight="bold" className="letter" key={i}>
              {letter}
            </chakra.span>
          ))}
        </Heading>
        <Heading
          className="ml16"
          textAlign="center"
          color="whiteAlpha.900"
          fontSize={["2xl", "3xl", "4xl", "4xl", "5xl", "5xl", "6xl"]}
          fontWeight="semibold"
          pb={["3rem", "5rem", "5rem", "5rem", "5rem", "5rem", "5rem"]}
        >
          {"Join the revolution".split("").map((letter, i) => (
            <chakra.span className="letter" key={i}>
              {letter}
            </chakra.span>
          ))}
        </Heading>
        <LandingButton value={stepButton} />
        <Image
          pos="absolute"
          bottom="10px"
          src={"/images/logo.png"}
          alt="logo"
          opacity="0.5"
          w="230px"
        />
      </Stack>
    </Flex>
  );
}