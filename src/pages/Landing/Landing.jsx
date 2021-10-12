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
import { colors } from "../../constants/colors";
import { randomImages } from "../../constants/images";

export const randomCoords = (min, max) => anime.random(min, max);

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
    translateX: () => randomCoords(-800, 800),
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

function LandingButton({ value }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  switch (value) {
    case "signIn":
      return (
        <ButtonLg
          label="Let's Begin"
          icon={<FcGoogle />}
          callback={() => {
            signIn();
          }}
        />
      );
    case "home":
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
      setStepButton("home");
    }
  }, [isLoggedIn]);

  return (
    <Flex
      bg="url(/images/landingPage.webp)"
      bgSize="contain"
      bgPos="center"
      w="100vw"
      h="100vh"
      pos="relative"
    >
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
        {[...Array(100)].map((_, i) => (
          <Box
            className="frame"
            key={i}
            w="3vw"
            h="3vw"
            maxW="20px"
            maxH="20px"
            minW="5px"
            minH="5px"
            bg={colors[randomCoords(0, colors.length)]}
            bgImage={randomImages[randomCoords(0, randomImages.length)]}
            bgSize="cover"
            bgPos="center"
            bgRepeat="no-repeat"
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
        mx={{ base: "0", sm: "1rem" }}
        bgGradient="radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 0%, rgba(100,100,100,0.2) 100%)"
      >
        <Stack
          pos="relative"
          zIndex="1"
          flexDir="column"
          align="center"
          justify="center"
          textAlign="center"
          spacing={[4, 4, 6, 8, 12]}
          p={{ base: "2rem 0rem", md: "4rem 0rem" }}
          rounded="2xl"
          w="full"
          maxW="1300px"
          bg="transparent"
          overflow="hidden"
        >
          <Box
            bg="url(/images/landingPage.webp)"
            backgroundSize="1000px"
            backgroundPosition="right"
            pos="absolute"
            top="0"
            left="100"
            w="100%"
            h="100%"
            filter="blur(15px)"
            zIndex="-1"
          />
          <Box
            bg="url(/images/landingPage.webp)"
            backgroundSize="cover"
            backgroundPosition="center"
            pos="absolute"
            bottom="0px"
            left="-100px"
            w="100%"
            h="100%"
            filter="blur(15px)"
            zIndex="-1"
          />
          <Box
            bg="url(/images/overlay.png)"
            backgroundSize="cover"
            backgroundPosition="center"
            bgRepeat="repeat"
            pos="absolute"
            top="50%"
            left="0"
            w="100%"
            h="100%"
            filter="blur(0px)"
            zIndex="-1"
          />
          <Box
            bg="url(/images/overlay.png)"
            backgroundSize="cover"
            backgroundPosition="center"
            bgRepeat="repeat"
            pos="absolute"
            top="-50%"
            left="0"
            w="100%"
            h="100%"
            filter="blur(0px)"
            zIndex="-1"
          />
          <Heading
            className="ml10"
            textAlign="center"
            color="whiteAlpha.900"
            fontSize={["3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"]}
            textShadow="0px 0px 10px rgba(0,0,0,0.2), 0px 0px 10px rgba(0,0,0,0.2)"
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
            w="full"
            py={[
              "1.5rem",
              "2.5rem",
              "2.5rem",
              "2.5rem",
              "2.5rem",
              "2.5rem",
              "2.5rem",
            ]}
            overflow="hidden"
          >
            <Box
              bg="url(/images/landingPage.webp)"
              backgroundSize="contain"
              backgroundPosition="right"
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              filter="blur(15px)"
              zIndex="-1"
            />
            <Box
              bg="url(/images/landingPage.webp)"
              backgroundSize="cover"
              backgroundPosition="center"
              pos="absolute"
              top="-100px"
              left="-100px"
              w="100%"
              h="100%"
              filter="blur(15px)"
              zIndex="-1"
            />
            {"Join the revolution".split("").map((letter, i) => (
              <chakra.span
                textShadow="0px 0px 10px rgba(0,0,0,0.2), 0px 0px 10px rgba(0,0,0,0.2)"
                pos="relative"
                top="-3px"
                className="letter"
                key={i}
              >
                {letter}
              </chakra.span>
            ))}
          </Heading>
          <LandingButton value={stepButton} />
        </Stack>
        <Image
          pos="absolute"
          bottom="10px"
          src={"/images/logo.png"}
          alt="logo"
          opacity="0.8"
          w="230px"
        />
      </Stack>
    </Flex>
  );
}
