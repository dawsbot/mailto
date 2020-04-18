import { useState, useReducer, useCallback, useMemo } from 'react';
import copy from 'copy-to-clipboard';
import { FaTrash, FaClipboard, FaClipboardCheck } from 'react-icons/fa';

import Layout from '../components/layout';

const parameters = ['to', 'cc', 'bcc', 'subject', 'body'];

const initialState = parameters.reduce((acc, param) => {
  acc[param] = '';
  return acc;
}, {});

const useFormState = () => {
  const reducer = (state, { type, payload }) => {
    console.log('dispatching ', payload);
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

  const mailtoHref = useMemo(
    () => {
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
    },
    [formState]
  );

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
  console.log('formState.to: ', formState.to);

  const handleResetState = () => {
    setCopied(false);
    resetForm();
  };

  const handleCopy = () => {
    copy(buildMailto());
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

  console.log('mailtoHref: ', mailtoHref);
  return (
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
          {/* {isFormEdited && ( */}
          <>
            <div className="center">
              <a
                className="button-link"
                href={mailtoHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open a test email in your default mail client"
              >
                "{mailtoHref}"" Test Email
              </a>
            </div>
            <br />
          </>
          {/* )} */}
        </div>
        {isFormEdited && (
          <div className="mailto-header">
            <div className="flex-row flex-between" style={{ color: 'white' }}>
              <code style={{ overflow: 'scroll', marginRight: '24px' }}>
                {Mailto}
              </code>
              <div className="buttons-wrapper">
                <div onClick={handleResetState} className="trash-button">
                  <span style={{ marginRight: '12px' }}>reset </span>
                  <FaTrash />
                </div>
                <div onClick={handleCopy} className="trash-button">
                  <span style={{ marginRight: '12px' }}>
                    {state.copied ? 'copied' : 'copy'}
                  </span>
                  {state.copied ? <FaClipboardCheck /> : <FaClipboard />}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* global styles */}
      <style jsx global>{`
        .buttons-wrapper {
          display: flex;
          // flex-direction: column;
        }
        .trash-button {
          width: 80px;
          display: flex;
          justify-content: space-between;
          border: 1px solid white;
          padding: 10px 18px;
          border-radius: 3px;
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
        .button-link {
          margin: 0px 8px;
          background-color: #fd6c6c;
          color: white;
          border-width: 0px;
          border-radius: 3px;
          padding: 3px 15px;
          cursor: pointer;
          font-size: 14px;
          transition: box-shadow 0.2s ease-in-out;
          outline: none;
          text-transform: capitalize;
          max-height: 27px;
          line-height: 27px;
        }
        .button-link:hover {
          box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        div.flex-row {
          display: flex;
          flex-direction: row;
        }
        .mailto-header > .flex-row {
          align-items: center;
          justiyf-content: center;
        }
        div.flex-between {
          justify-content: space-between;
          width: 100%;
        }
        .mailto-header {
          background-color: #fd6c6c;
          height: 70px;
          padding: 0px 40px;
          display: flex;
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
            width: 50vw;
            max-width: 1000px;
          }

          .input-body {
            padding: 40px 50px;
          }
        }

        code {
          background-color: black;
          color: white;
          padding: 2px 8px;
        }
      `}</style>
    </Layout>
  );
};

export default MailTo;
