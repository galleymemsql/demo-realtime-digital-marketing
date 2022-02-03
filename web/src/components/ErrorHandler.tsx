import { SQLError } from "@/data/client";
import { RepeatIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Code,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import dedent from "ts-dedent";

type State = {
  error?: Error;
};

export class ErrorBoundary extends React.Component<unknown, State> {
  state: State = {};

  constructor() {
    super(undefined);
    this.handlePromiseRejection = this.handlePromiseRejection.bind(this);
  }

  componentDidMount() {
    window.addEventListener("unhandledrejection", this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "unhandledrejection",
      this.handlePromiseRejection
    );
  }

  handlePromiseRejection(ev: PromiseRejectionEvent) {
    this.setState({ error: ev.reason });
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      let info;
      if (error instanceof SQLError) {
        info = (
          <>
            <Text textAlign="center">
              An error occurred while running the following query:
            </Text>
            <Code display="block" whiteSpace={["inherit", "pre"]} p={6}>
              {dedent(error.sql)}
            </Code>
          </>
        );
      }

      return (
        <Center my={10}>
          <Stack gap={4} maxW="container.md">
            <Center>
              <WarningTwoIcon boxSize={20} color="red" />
            </Center>
            <Heading size="xl" textAlign="center">
              {error.message}
            </Heading>
            {info}
            <HStack justify="center" gap={4}>
              <Button
                onClick={() => this.setState({ error: undefined })}
                size="sm"
              >
                Dismiss Error
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                colorScheme="blue"
                leftIcon={<RepeatIcon />}
              >
                Reload
              </Button>
            </HStack>
          </Stack>
        </Center>
      );
    }

    return this.props.children;
  }
}
