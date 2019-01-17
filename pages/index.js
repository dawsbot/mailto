import Layout from '../components/layout';
import ClickToCopy from '../components/click-to-copy';

export default class MailTo extends React.Component {
  parameters = ['to', 'cc', 'bcc', 'subject', 'body'];

  // initialize state to object with empty arrays
  state = {
    hrefCopied: false,
    htmlCopied: false,
    values: this.parameters.reduce((acc, param) => {
      acc[param] = '';
      return acc;
    }, {})
  };

  handleChange = (event, inputName) => {
    this.setState({
      hrefCopied: false,
      htmlCopied: false,
      values: {
        ...this.state.values,
        [inputName]: event.target.value
      }
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
    return this.parameters.map(param => (
      <div key={param}>
        <label htmlFor={param}>{param}: </label>
        {param === 'body' ? (
          <textarea
            id={param}
            value={this.state.value}
            onChange={e => this.handleChange(e, param)}
            className="param-input"
          />
        ) : (
          <input
            id={param}
            type="text"
            value={this.state.value}
            onChange={e => this.handleChange(e, param)}
            className="param-input"
          />
        )}
        <style jsx>{`
          label {
            padding-right: 8px;
            font-size: 14px;
          }
          .param-input {
            margin-bottom: 20px;
            border: none;
            border-bottom: solid 2px #c9c9c9;
            outline: none;
            font-family: 'Coming Soon', cursive;
            font-size: 16px;
            height: 24px;
            width: 100%;
            transition: border 0.3s;
          }
          .param-input:focus {
            transition: border 1s;
            border-color: black;
          }
        `}</style>
      </div>
    ));
  };

  render() {
    const Mailto = this.buildMailto();
    return (
      <Layout>
        <h1>
          Welcome To Mailto{' '}
          <span
            role="img"
            aria-hidden="true"
            aria-label="mailto at lightning speed"
          >
            💌⚡️
          </span>
        </h1>
        <p className="description">
          HTML <code>mailto</code>'s made easy 👌
        </p>
        <div className="inputs">{this.buildInputs()}</div>
        <h1>Use It</h1>
        <div className="center">
          <a
            className="button-link"
            href={Mailto}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open a test email in your default mail client"
          >
            Test Email
            {/*<Button
              value="Test Email"
              aria-label="Open a test email in your default mail client"
            />*/}
          </a>
        </div>
        <br />
        <div>
          HTML href:
          <ClickToCopy
            ariaLabelSuffix="raw HTML mailto string to system clipboard"
            target={Mailto}
            copied={this.state.hrefCopied}
            handleClipBoardCopy={() => this.setState({ hrefCopied: true })}
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
            handleClipBoardCopy={() => this.setState({ htmlCopied: true })}
          >
            <br />
            <code>{`<a href="${Mailto}">Mail Now</a>`}</code>
          </ClickToCopy>
        </div>
        <style jsx>{`
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
          .description {
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
            font-family: 'Coming Soon', cursive;
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
        `}</style>
      </Layout>
    );
  }
}
