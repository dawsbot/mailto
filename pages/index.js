import { useState, useReducer, useMemo, useEffect, useRef } from "react";
import { emailSeemsValid } from "email-seems-valid";
import Head from "next/head";
import { useRouter } from "next/router";
import copy from "copy-to-clipboard";
import {
  FaTrash,
  FaClipboard,
  FaClipboardCheck,
  FaExternalLinkAlt,
} from "react-icons/fa";
import styled from "styled-components";
import { logEvent } from "../utils/analytics";
import { buildMailtoHref, parameters } from "../utils/buildMailtoHref";

import Layout from "../components/layout";

const primaryPink = "#fd6c6c";
const metaTitle = "Mailto | The mailto encoder";
const metaDescription =
  "Encode full emails as a mailto. We do the hard work to url encode your subject and body for emails with special characters and emojis. Just paste the result in your html anchor element!";
const metaImage = "https://mailto.vercel.app/demo.png";

const Button = styled.button`
  transition: all 0.3s ease;
  color: white;
  background-color: transparent;
  border: 1px solid white;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  :hover {
    cursor: pointer;
    background-color: white;
    color: ${primaryPink};
  }
`;

const WindowTopAndBottom = styled.div`
  background-color: ${primaryPink};
  padding: 16px 40px;
  display: flex;
  min-height: 70px;
  flex-direction: row;
  align-items: center;
  color: white;
  justify-content: space-between;
  @media only screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;
const initialState = parameters.reduce((acc, param) => {
  acc[param] = "";
  return acc;
}, {});

const useFormState = () => {
  const reducer = (state, { type, payload }) => {
    if (type === "reset") {
      return initialState;
    } else if (type === "set") {
      const { key } = payload;
      let { value } = payload;
      if (key === "to") {
        value = value.replace(/\s/g, "");
      }
      return {
        ...state,
        [key]: value,
      };
    } else if (type === "hydrate") {
      return {
        ...state,
        ...payload,
      };
    }
  };
  const [formState, dispatch] = useReducer(reducer, initialState);

  const mailtoHref = useMemo(() => buildMailtoHref(formState), [formState]);

  return {
    formState,
    setOneFormValue: (payload) => dispatch({ type: "set", payload }),
    resetForm: () => dispatch({ type: "reset" }),
    hydrateForm: (payload) => dispatch({ type: "hydrate", payload }),

    // computed values
    isFormEdited: parameters.some(
      (parameterName) =>
        formState[parameterName] !== initialState[parameterName],
    ),
    mailtoHref,
  };
};

// Syncs form state with the URL query string so a pre-filled form can be
// shared as a link: reads ?to=&cc=&bcc=&subject=&body= once on load to
// pre-fill, then mirrors edits back into the URL (debounced, shallow
// replace so typing never navigates or spams the history stack).
const useShareableUrl = (formState, hydrateForm) => {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const hasHydratedFromUrl = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasHydratedFromUrl.current) {
      return;
    }
    hasHydratedFromUrl.current = true;
    const fromQuery = {};
    parameters.forEach((param) => {
      const value = router.query[param];
      if (typeof value === "string" && value.length > 0) {
        // mirror the same whitespace-stripping the "to" input applies
        fromQuery[param] = param === "to" ? value.replace(/\s/g, "") : value;
      }
    });
    if (Object.keys(fromQuery).length > 0) {
      hydrateForm(fromQuery);
    }
  }, [router.isReady, router.query, hydrateForm]);

  useEffect(() => {
    // don't overwrite the query string before it has been read on load
    if (!hasHydratedFromUrl.current) {
      return;
    }
    const timeout = setTimeout(() => {
      const query = {};
      parameters.forEach((param) => {
        if (formState[param]) {
          query[param] = formState[param];
        }
      });
      routerRef.current.replace(
        { pathname: routerRef.current.pathname, query },
        undefined,
        { shallow: true },
      );
    }, 250);
    return () => clearTimeout(timeout);
  }, [formState]);
};

const IsToValidWarning = ({ to }) => {
  if (to.length > 0) {
    const invalidEmails = to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 4 && !emailSeemsValid(email));
    if (invalidEmails.length > 0) {
      return invalidEmails.map((email) => {
        return (
          <p
            key={email}
            style={{ color: "#fd6c6c", marginTop: "0px", marginBottom: "26px" }}
          >{`"${email}" is not a valid email address`}</p>
        );
      });
    }
  }
  return null;
};

const MailTo = () => {
  const [copied, setCopied] = useState(false);
  const {
    formState,
    setOneFormValue,
    resetForm,
    hydrateForm,
    isFormEdited,
    mailtoHref,
  } = useFormState();
  useShareableUrl(formState, hydrateForm);

  const handleResetState = () => {
    logEvent("reset", mailtoHref);
    setCopied(false);
    resetForm();
  };

  const handleCopy = () => {
    logEvent("copy-to-clipboard", mailtoHref);
    copy(mailtoHref);
    setCopied(true);
  };

  const handleChange = (event, inputName) => {
    setOneFormValue({ key: inputName, value: event.target.value });
    setCopied(false);
  };

  const encodeInputs = () => {
    return parameters.map((param) => (
      <span key={param}>
        <div className="flex-row input-section">
          <label htmlFor={param}>{param}: </label>
          {param === "body" ? (
            <textarea
              id={param}
              value={formState[param]}
              onChange={(e) => handleChange(e, param)}
              rows={4}
              className="param-input"
            />
          ) : (
            <input
              id={param}
              type="text"
              value={formState[param]}
              onChange={(e) => handleChange(e, param)}
              className="param-input"
            />
          )}
          <style jsx>{`
            .input-section {
              margin: 8px 0px;
            }
            label {
              padding-right: 8px;
              font-size: 16px;
              font-weight: bold;
            }
            input.param-input {
              height: 24px;
            }
            .param-input {
              margin-bottom: 20px;
              border: none;
              border-bottom: solid 2px #c9c9c9;
              outline: none;
              font-size: 16px;
              width: 100%;
              transition: border 0.3s;
              -webkit-appearance: none;
            }
            .param-input:focus {
              transition: border 1s;
              border-color: black;
            }
            textarea.param-input {
              border: solid 2px #c9c9c9;
              border-radius: 3px;
              padding: 10px;
            }
          `}</style>
        </div>
        {param === "to" && isFormEdited && (
          <IsToValidWarning to={formState.to} />
        )}
      </span>
    ));
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={metaDescription} />

        <meta
          name="keywords"
          content="mailto,email,web,developer,HTML,CSS,JavaScript,emoji,nextjs,zeit,nowjs"
        />

        {/* <!-- Google / Search Engine Tags --> */}
        <meta itemProp="name" content={metaTitle} />
        <meta itemProp="description" content={metaDescription} />
        <meta itemProp="image" content={metaImage} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://mailto.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />

        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap"
          rel="stylesheet"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Layout>
        <section style={{ width: "100%" }}>
          <WindowTopAndBottom>
            <h1>
              Mailto.vercel.app{" "}
              <span
                role="img"
                aria-hidden="true"
                aria-label="mailto at lightning speed"
              >
                💌⚡️
              </span>
            </h1>
            <p className="description">
              The <code>mailto</code> encoder
            </p>
          </WindowTopAndBottom>

          <div className="input-body">
            <div className="inputs">{encodeInputs()}</div>
          </div>
          {isFormEdited && (
            <WindowTopAndBottom>
              <div
                style={{
                  overflow: "scroll",
                  padding: "4px",
                  backgroundColor: "white",
                  margin: "6px 24px 6px 0px",
                  borderRadius: "2px",
                  maxHeight: "120px",
                  maxWidth: "70vw",
                }}
              >
                <code>{mailtoHref}</code>
              </div>

              <div className="buttons-wrapper">
                <Button onClick={handleResetState} className="left-button">
                  <FaTrash />
                </Button>
                <a
                  href={mailtoHref}
                  onClick={() => logEvent("open-mail-client", mailtoHref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open a test email in your default mail client"
                  style={{ textDecoration: "none" }}
                >
                  <Button>
                    <span style={{ marginRight: "12px" }}>test</span>
                    <FaExternalLinkAlt />
                  </Button>
                </a>
                <Button
                  onClick={handleCopy}
                  className="copy-button right-button"
                >
                  <span
                    style={{
                      marginRight: "12px",
                      fontWeight: 900,
                      fontSize: "18px",
                    }}
                  >
                    {copied ? "copied" : "copy"}
                  </span>
                  {copied ? <FaClipboardCheck /> : <FaClipboard />}
                </Button>
              </div>
            </WindowTopAndBottom>
          )}
        </section>
        <style jsx global>{`
          .buttons-wrapper {
            display: flex;
          }
          .left-button {
            width: 40px;
            border-radius: 14px 0 0 14px;
            padding-left: 12px;
          }
          .copy-button {
            box-sizing: border-box;
            width: 112px;
          }
          .right-button {
            border-radius: 0 14px 14px 0;
            padding-right: 12px;
          }
          .center {
            text-align: center;
          }
          .inputs {
            width: 100%;
          }
          h1 {
            margin-bottom: 0px;
            margin-top: 0px;
          }
          code {
            word-wrap: break-word;
          }
          div.flex-row {
            display: flex;
            flex-direction: row;
          }
          section {
            border: 2px solid #fd6c6c;
            border-radius: 8px;
            box-shadow:
              0 4px 6px 0 rgba(99, 42, 42, 0.3),
              0 6px 20px 0 rgba(99, 42, 42, 0.3);
          }
          .input-body {
            padding: 30px 30px;
          }

          // desktop and bigger special styles
          @media only screen and (min-width: 1000px) {
            section {
              width: 60vw;
              max-width: 1000px;
            }

            .input-body {
              padding: 40px 5vw;
            }
          }

          code {
            color: black;
            padding: 2px 8px;
          }
        `}</style>
      </Layout>
    </>
  );
};

export default MailTo;
