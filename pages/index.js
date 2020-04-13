import { withRouter } from 'next/router';

import Layout from '../components/layout';
import ClickToCopy from '../components/click-to-copy';

const parameters = ['to', 'cc', 'bcc', 'subject', 'body'];

const initialState = {
  hrefCopied: false,
  htmlCopied: false,
  values: parameters.reduce((acc, param) => {
    acc[param] = '';
    return acc;
  }, {})
};

class MailTo extends React.Component {
  state = initialState;

  componentDidMount() {
    const asPath = this.props.router.asPath;
    try {
      if (asPath.startsWith('/#')) {
        const encodedStringValues = asPath.replace('/#', '');
        const formValues = JSON.parse(decodeURIComponent(encodedStringValues));

        return window.setTimeout(
          () => this.setState({ values: formValues }),
          500
        );
      }
    } catch (err) {
      this.props.router.replace('/');
    }
  }

  handleChange = (event, inputName) => {
    const values = {
      ...this.state.values,
      [inputName]: event.target.value
    };
    this.props.router.replace(
      `/#${encodeURIComponent(JSON.stringify(values))}`
    );
    this.setState({
      hrefCopied: false,
      htmlCopied: false,
      values
    });
  };

  buildMailto = () => {
    const { to, ...relevantState } = this.state.values;
    // empty text fields should not be fed to mailto address
    const validKeys = Object.keys(relevantState).filter(
      param => relevantState[param].length > 0
    );
    const suffix = validKeys
      .map(key => {
        if (this.state.values[key]) {
          return key + '=' + encodeURIComponent(this.state.values[key]);
        }
        return '';
      })
      .join('&');
    return `mailto:${to}${suffix && `?${suffix}`}`;
  };

  buildInputs = () => {
    return parameters.map(param => (
      <div key={param} className="flex-row input-section">
        <label htmlFor={param}>{param}: </label>
        {param === 'body' ? (
          <textarea
            id={param}
            value={this.state.value}
            onChange={e => this.handleChange(e, param)}
            rows={4}
            className="param-input"
          />
        ) : (
          <input
            id={param}
            type="text"
            value={this.state.values[param]}
            onChange={e => this.handleChange(e, param)}
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

  render() {
    const Mailto = this.buildMailto();
    const isEdited = parameters.some(
      parameterName =>
        this.state.values[parameterName] !== initialState.values[parameterName]
    );
    return (
      <Layout>
        <section className="top-section">
          <div className="mailto-header">
            <div className="flex-row flex-between">
              <h1 style={{ marginRight: '40px', color: 'white' }}>
                Mailto{' '}
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
            <div className="inputs">{this.buildInputs()}</div>
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
                <div>
                  HTML href:
                  <ClickToCopy
                    ariaLabelSuffix="raw HTML mailto string to system clipboard"
                    target={Mailto}
                    copied={this.state.hrefCopied}
                    handleClipBoardCopy={() =>
                      this.setState({ hrefCopied: true, htmlCopied: false })
                    }
                  >
                    <br />
                    <code>{Mailto}</code>
                  </ClickToCopy>
                </div>
                <br />
                <div>
                  Full HTML string:
                  <ClickToCopy
                    aria-label="Copy raw HTML anchor tag string to system clipboard. This is the mailto string wrapped inside an anchor tag"
                    target={`<a href="${Mailto}">Mail Now</a>`}
                    copied={this.state.htmlCopied}
                    handleClipBoardCopy={() =>
                      this.setState({ htmlCopied: true, hrefCopied: false })
                    }
                  >
                    <br />
                    <code>{`<a href="${Mailto}">Mail Now</a>`}</code>
                  </ClickToCopy>
                </div>
              </>
            )}
          </div>
        </section>
        {/* global styles */}
        <style jsx global>{`
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
          }
          div.flex-between {
            justify-content: space-between;
          }
          .mailto-header {
            background-color: #fd6c6c;
            margin: 0px;
            padding: 10px 40px;
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
          p.description {
            color: white;
          }

          code {
            background-color: black;
            color: white;
            padding: 2px 8px;
          }
        `}</style>
      </Layout>
    );
  }
}

export default withRouter(MailTo);
