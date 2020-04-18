import { useState } from 'react';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';

import Layout from '../components/layout';
import { FaTrash, FaClipboard, FaClipboardCheck } from 'react-icons/fa';

const parameters = ['to', 'cc', 'bcc', 'subject', 'body'];

// const initialState = {
//   copied: false,
//   values: parameters.reduce((acc, param) => {
//     acc[param] = '';
//     return acc;
//   }, {})
// };

const MailTo = () => {
  const [copied, setCopied] = useState(false);
  // state = initialState;
  const router = useRouter();

  useEffect(() => {
    const { asPath } = router;
    try {
      if (asPath.startsWith('/#')) {
        const encodedStringValues = asPath.replace('/#', '');
        const formValues = JSON.parse(decodeURIComponent(encodedStringValues));

        return window.setTimeout(() => setState({ values: formValues }), 500);
      }
    } catch (err) {
      // error parsing url-encoded string. reset to
      router.replace('/');
    }
  });

  const handleResetState = () => {
    setCopied(false);
    // TODO: reset form state
    router.replace('/');
  };

  const handleCopy = () => {
    copy(buildMailto());
    setCopied(true);
  };

  const handleChange = (event, inputName) => {
    const values = {
      ...state.values,
      [inputName]: event.target.value
    };
    if (isEdited(values)) {
      router.replace(`/#${encodeURIComponent(JSON.stringify(values))}`);
    } else {
      router.replace('/');
    }
    setCopied(false);

    // TODO: set new  form state
    //  setState({
    //   copied: false,
    //   values
    // });
  };

  const buildMailto = () => {
    const { to, ...relevantState } = state.values;
    // empty text fields should not be fed to mailto address
    const validKeys = Object.keys(relevantState).filter(
      param => relevantState[param].length > 0
    );
    const suffix = validKeys
      .map(key => {
        if (state.values[key]) {
          return key + '=' + encodeURIComponent(state.values[key]);
        }
        return '';
      })
      .join('&');
    return `mailto:${to}${suffix && `?${suffix}`}`;
  };

  const buildInputs = () => {
    return parameters.map(param => (
      <div key={param} className="flex-row input-section">
        <label htmlFor={param}>{param}: </label>
        {param === 'body' ? (
          <textarea
            id={param}
            value={state.values[param]}
            onChange={e => handleChange(e, param)}
            rows={4}
            className="param-input"
          />
        ) : (
          <input
            id={param}
            type="text"
            value={state.values[param]}
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

  const isEdited = values =>
    parameters.some(
      parameterName =>
        values[parameterName] !== initialState.values[parameterName]
    );

  const Mailto = buildMailto();
  const isEdited = isEdited(state.values);
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
          {isEdited && (
            <>
              <div className="center">
                <a
                  className="button-link"
                  href={Mailto}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open a test email in your default mail client"
                >
                  Test Email
                </a>
              </div>
              <br />
            </>
          )}
        </div>
        {isEdited && (
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
