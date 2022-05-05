/* eslint-disable no-unused-expressions */

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    overflow: hidden;
    background-color: ${(p) => p.theme.colors.background.main};
    color: ${(p) => p.theme.colors.neutral.c100};
    padding: 0;
    margin: 0;
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  * {
    box-sizing: border-box;
  }
  
  html,
  body,
  div#__next {
    height: 100%;
  }

  .output-item-enter {
    opacity: 0;
    transform: translateX(20px);
  }
  .output-item-enter-active {
    opacity: 1;
    transform: translateX(0px);
  }
`;
