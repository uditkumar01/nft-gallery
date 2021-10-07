import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { IoIosHappy } from "react-icons/io";
import "./EmojiPallet.css";

export function EmojiPallet({ onEmojiClick }) {
  function removeEmojiDescription() {
    // get element's attributes by class name emoji-group
    const emojiDescription =
      document.getElementsByClassName("content-wrapper")[0];
    emojiDescription.setAttribute("data-name", "");
  }

  return (
    <Popover placement="top-start" bg="red">
      <PopoverTrigger>
        <IconButton
          rounded="full"
          color="yellow.400"
          size="sm"
          bg="gray.600"
          _hover={{ bg: "blue.600" }}
          aria-label="emoji-icon"
        >
          <IoIosHappy fontSize="1.4rem" />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent w="280px" padding="0" margin="0" borderColor="gray.600">
        <PopoverArrow bg="gray.500" />
        <PopoverBody
          as="button"
          d="flex"
          justifyContent="center"
          padding="0"
          margin="0"
          onMouseMove={removeEmojiDescription}
        >
          <EmojiPicker
            preload={false}
            pickerStyle={{ width: "100%" }}
            groupNames={{
              smileys_people: "",
              animals_nature: "",
              food_drink: "",
              travel_places: "",
              activities: "",
              objects: "",
              symbols: "",
              flags: "",
              recently_used: "",
            }}
            onEmojiClick={onEmojiClick}
            groupVisibility={false}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
