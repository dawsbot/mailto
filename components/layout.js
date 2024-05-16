import { useEffect } from "react";
import GHCorner from "react-github-corner";
import styled from "styled-components";
import { FaWrench } from "react-icons/fa";

import { initGA, logPageView } from "../utils/analytics";

const Footer = styled.footer`
  padding-top: 120px;
`;

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 8vw;
`;

const Wrench = styled(FaWrench)`
  transition: transform 0.5s ease-in-out;
  ${Footer}:hover & {
    transform: rotate(-270deg);
  }
`;

export default ({ children }) => {
  useEffect(() => {
    /* eslint-disable */
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    /* eslint-enable */
    logPageView();
  }, []);
  return (
    <OuterWrapper>
      <GHCorner
        href="https://github.com/dawsbot/mailto"
        bannerColor="#FD6C6C"
        size={"calc(14vw + 20px)"}
      />
      {children}
      <style jsx global>{`
        body {
          margin: 0;
        }

        body,
        textarea,
        button,
        input {
          font-family: "Courier Prime", monospace;
          font-size: 16px;
        }

        .page-sections {
          width: 100%;
        }

        // Hightlight color
        // https://stackoverflow.com/questions/2258647/changing-the-highlight-color-when-selecting-text-in-an-html-text-input
        /*** Works on common browsers ***/
        ::selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        /*** Mozilla based browsers ***/
        ::-moz-selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        /***For Other Browsers ***/
        ::-o-selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        ::-ms-selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        /*** For Webkit ***/
        ::-webkit-selection {
          background-color: #352e7e;
          color: #fff;
        }
      `}</style>
      <Footer>
        <a
          href="https://github.com/dawsbot"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#fd6c6c" }}
        >
          <Wrench /> Built by Dawson
        </a>
      </Footer>
    </OuterWrapper>
  );
};
