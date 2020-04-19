import { useState, useReducer, useMemo } from 'react';
import Head from 'next/head';
import copy from 'copy-to-clipboard';
import {
  FaTrash,
  FaClipboard,
  FaClipboardCheck,
  FaExternalLinkAlt
} from 'react-icons/fa';
import styled from 'styled-components';
import { logEvent } from '../utils/analytics';

import Layout from '../components/layout';

const primaryPink = '#fd6c6c';

const Button = styled.button`
  transition: all 0.3s ease;
  color: white;
  background-color: transparent;
  border: 1px solid white;
  height: 40px;
  display: flex;
  justify-content: space-between;
  :hover {
    cursor: pointer;
    background-color: white;
    color: ${primaryPink};
  }
`;
const parameters = ['to', 'cc', 'bcc', 'subject', 'body'];

const initialState = parameters.reduce((acc, param) => {
  acc[param] = '';
  return acc;
}, {});

const useFormState = () => {
  const reducer = (state, { type, payload }) => {
    switch (type) {
      case 'reset':
        return initialState;
      case 'set':
        return {
          ...state,
          [payload.key]: payload.value
        };
    }
  };
  const [formState, dispatch] = useReducer(reducer, initialState);

  const mailtoHref = useMemo(() => {
    const { to, ...relevantState } = formState;
    // empty text fields should not be fed to mailto address
    const validKeys = Object.keys(relevantState).filter(
      param => relevantState[param].length > 0
    );
    const suffix = validKeys
      .map(key => {
        if (formState[key]) {
          return key + '=' + encodeURIComponent(formState[key]);
        }
        return '';
      })
      .join('&');
    const mailtoHref = `mailto:${to}${suffix && `?${suffix}`}`;
    return mailtoHref;
  }, [formState]);

  return {
    formState,
    setOneFormValue: payload => dispatch({ type: 'set', payload }),
    resetForm: () => dispatch({ type: 'reset' }),

    // computed values
    isFormEdited: parameters.some(
      parameterName => formState[parameterName] !== initialState[parameterName]
    ),
    mailtoHref
  };
};

const MailTo = () => {
  const [copied, setCopied] = useState(false);
  const {
    formState,
    setOneFormValue,
    resetForm,
    isFormEdited,
    mailtoHref
  } = useFormState();

  const handleResetState = () => {
    logEvent('reset', mailtoHref);
    setCopied(false);
    resetForm();
  };

  const handleCopy = () => {
    logEvent('copy-to-clipboard', mailtoHref);
    copy(mailtoHref);
    setCopied(true);
  };

  const handleChange = (event, inputName) => {
    setOneFormValue({ key: inputName, value: event.target.value });
    setCopied(false);
  };

  const buildInputs = () => {
    return parameters.map(param => (
      <div key={param} className="flex-row input-section">
        <label htmlFor={param}>{param}: </label>
        {param === 'body' ? (
          <textarea
            id={param}
            value={formState[param]}
            onChange={e => handleChange(e, param)}
            rows={4}
            className="param-input"
          />
        ) : (
          <input
            id={param}
            type="text"
            value={formState[param]}
            onChange={e => handleChange(e, param)}
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
    ));
  };

  return (
    <>
      <Head>
        <title>Mailto builder</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap"
          rel="stylesheet"
        />

        <meta
          name="description"
          content="Template FULL emails in an html mailto. We do the hard work to encode your to, subject, body, for easy emails using special characters and emojis!"
        />
        <meta
          name="keywords"
          content="mailto,email,web,developer,HTML,CSS,JavaScript,emoji,nextjs,zeit,nowjs"
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
        <section className="top-section">
          <div className="mailto-header">
            <div className="flex-row flex-between" style={{ color: 'white' }}>
              <h1>
                Mailto.now.sh{' '}
                <span
                  role="img"
                  aria-hidden="true"
                  aria-label="mailto at lightning speed"
                >
                  💌⚡️
                </span>
              </h1>
              <p className="description">
                HTML <code>mailto</code>
                {`'s made easy 👌`}
              </p>
            </div>
          </div>

          <div className="input-body">
            <div className="inputs">{buildInputs()}</div>
          </div>
          {isFormEdited && (
            <div className="mailto-header">
              <div className="flex-row flex-between" style={{ color: 'white' }}>
                <div
                  style={{
                    overflow: 'scroll',
                    padding: '4px',
                    backgroundColor: 'white',
                    margin: '6px 24px 6px 0px',
                    borderRadius: '2px',
                    maxHeight: '120px'
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
                    onClick={() => logEvent('open-mail-client', mailtoHref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open a test email in your default mail client"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button>
                      <span style={{ marginRight: '12px' }}>test</span>
                      <FaExternalLinkAlt />
                    </Button>
                  </a>
                  <Button
                    onClick={handleCopy}
                    className="copy-button right-button"
                  >
                    <span
                      style={{
                        marginRight: '12px',
                        fontWeight: 900,
                        fontSize: '18px'
                      }}
                    >
                      {copied ? 'copied' : 'copy'}
                    </span>
                    {copied ? <FaClipboardCheck /> : <FaClipboard />}
                  </Button>
                </div>
              </div>
            </div>
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
          .mailto-header > .flex-row {
            align-items: center;
          }
          div.flex-between {
            justify-content: space-between;
            width: 100%;
          }
          .mailto-header {
            background-color: #fd6c6c;
            padding: 0px 40px;
            display: flex;
            min-height: 70px;
            flex-direction: row;
          }
          section {
            border: 2px solid #fd6c6c;
            border-radius: 8px;
            box-shadow: 0 4px 6px 0 rgba(99, 42, 42, 0.3),
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
              padding: 40px 50px;
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
