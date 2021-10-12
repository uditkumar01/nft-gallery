import { Button, Text, chakra } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export function ButtonLg({ icon, label, callback, ...props }) {
  const navigate = useNavigate();
  return (
    <Button
      rounded="full"
      pos="relative"
      fontSize={["2xl", "2xl", "3xl", "3xl", "4xl", "4xl", "5xl"]}
      outlineColor="white"
      p={[
        "1.9rem 2.4rem",
        "1.9rem 2.4rem",
        "2.5rem 3rem",
        "2.5rem 3rem",
        "2.5rem 3rem",
        "2.5rem 3rem",
        "3rem 3.5rem",
      ]}
      bg="rgba(255, 255, 255, 1)"
      color="blackAlpha.700"
      transition="all 0.3s"
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      _hover={{
        bg: "rgb(255, 255, 255, 0.8)",
        color: "black",
        boxShadow:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 10px rgba(0, 0, 0, 0.14), 0px 0px 0px 10px rgba(0, 0, 0, 0.12)",
      }}
      onClick={() => callback && callback()}
      {...props}
    >
      <Text pos="relative" fontWeight="400" top="-2px">
        {label}
      </Text>
      <chakra.span
        pos="absolute"
        h="200px"
        w="200px"
        zIndex="-1"
        className="bubble"
        bgGradient="radial-gradient(circle, rgba(255, 255, 255,0.5) 0%, rgba(255, 2555, 255,0.5) 0%, rgba(0,0,0,0.3) 100%)"
        borderRadius="50%"
      ></chakra.span>
    </Button>
  );
}
