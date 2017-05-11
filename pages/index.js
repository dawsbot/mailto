import Layout from '../components/layout';
import Button from '../components/button';

export default class MailTo extends React.Component {
  parameters = ['to', 'cc', 'bcc', 'subject', 'body'];

  // initialize state to object with empty arrays
  state = this.parameters.reduce((acc, param) => {
    acc[param] = '';
    return acc;
  }, {});

  handleChange = (event, inputName) => {
    this.setState({ [inputName]: event.target.value });
  };

  buildMailto = () => {
    const { to, ...relevantState } = this.state;
    // empty text fields should not be fed to mailto address
    const validKeys = Object.keys(relevantState).filter(
      param => relevantState[param].length > 0
    );
    const suffix = validKeys
      .map(key => {
        if (this.state[key]) {
          return key + '=' + encodeURIComponent(this.state[key]);
        }
        return '';
      })
      .join('&');
    return `mailto:${to}${suffix && `?${suffix}`}`;
  };

  buildInputs = () => {
    return this.parameters.map(param => (
      <div key={param}>
        <label>{param}: </label>
        {param === 'body'
          ? <textarea
              rows={5}
              value={this.state.value}
              onChange={e => this.handleChange(e, param)}
              className="param-input"
            />
          : <input
              type="text"
              value={this.state.value}
              onChange={e => this.handleChange(e, param)}
              className="param-input"
            />}
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
            transition: border .3s;
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
        <h1>Welcome To Mailto 💌⚡️</h1>
        <p className="description">
          HTML <code>mailto</code>'s made easy️ 👌
        </p>
        <div className="inputs">
          {this.buildInputs()}
        </div>
        <h1>Use It</h1>
        <div className="center">
          <Button href={Mailto} />
        </div>
        <br />
        html href: "<code>
          {Mailto}
        </code>"
        <br />
        Full HTML string: <code>
          {`
          <a href="${Mailto}">Email me</a>
        `}
        </code>
        <style jsx>{`
          .center {
            text-align: center
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
        `}</style>
      </Layout>
    );
  }
}
