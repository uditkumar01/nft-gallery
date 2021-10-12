import { useBoolean, useBreakpointValue } from "@chakra-ui/react";
import { useEffect } from "react";
export const useMobileMenuState = () => {
  const [isOpen, actions] = useBoolean();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    if (isMobile === false) {
      actions.off();
    }
  }, [isMobile, actions]);

  return { isOpen, ...actions };
};
