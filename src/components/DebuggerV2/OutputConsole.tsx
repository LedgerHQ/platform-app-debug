import styled from "styled-components";
import { Text } from "@ledgerhq/react-ui";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Result } from "./types";
import { useEffect, useRef } from "react";

const ConsoleContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: scroll;
`;

const OutputContainer = styled.div`
  overflow-wrap: anywhere;
  font-size: 11px;
  padding: 12px 0px;
  transition: opacity 100ms ease-out, transform 150ms ease-out;
  display: flex;
  flex-direction: column;

  &:last-child {
    padding-bottom: 0px;
  }
`;

const CodeContainer = styled.pre`
  padding: 18px;
  background-color: #1d1f21;
  color: white;
  overflow-x: auto;
  user-select: text;
  font-family: monospace;
  font-size: 11px;
`;

type Props = {
  results: Result[];
};

function formatDistance(date: Date, baseDate: Date): string {
  const diffTime = Math.abs(date.getTime() - baseDate.getTime());

  const value =
    diffTime > 1000 ? [diffTime / 1000, "seconds"] : [diffTime, "milliseconds"];

  return `${value[0]} ${value[1]}`;
}

export function OutputConsole({ results }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [results]);
  return (
    <ConsoleContainer ref={scrollRef}>
      <TransitionGroup className="output-list">
        {results.map((result) => {
          return (
            <CSSTransition
              key={result.uuid}
              timeout={200}
              classNames="output-item"
            >
              <OutputContainer>
                <div
                  style={{
                    marginBottom: 4,
                  }}
                >
                  <Text
                    fontSize="11px"
                    color={
                      result.status === "SUCCESS"
                        ? "palette.success.c80"
                        : result.status === "PENDING"
                        ? "palette.warning.c80"
                        : "palette.error.c80"
                    }
                  >
                    {result.methodId}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="palette.neutral.c70"
                    marginLeft="6px"
                  >
                    ~{formatDistance(result.respondedAt, result.queriedAt)}
                  </Text>
                </div>
                <CodeContainer>
                  {result.status === "SUCCESS"
                    ? JSON.stringify(result.data, null, 4)
                    : result.status === "PENDING"
                    ? "[...]"
                    : String(result.error)}
                </CodeContainer>
              </OutputContainer>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </ConsoleContainer>
  );
}
