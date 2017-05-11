import copy from 'copy-to-clipboard';

export default class ClickToCopy extends React.Component {
  constructor() {
    super();
    this.state = {
      copied: false
    };
  }
  copyNow(t) {
    copy(t);
    this.setState({
      copied: true
    });
  }
  componentWillReceiveProps() {
    this.setState({
      copied: false
    });
  }
  render() {
    const { target, children } = this.props;
    const { copied } = this.state;
    return (
      <span className={'copyElem ' + copied}>
        <span className="copyBtn" onClick={() => this.copyNow(target)}>
          {copied ? 'copied!' : 'copy'}
        </span>
        {children}
        <style jsx>{`
            .copyBtn {
                opacity: 0.7;
                font-family: 'Open Sans', 'Helvetica', 'Sans';
                font-size: 0.7rem;
                margin: auto 5px;
                padding: 0px 5px;
                border: 1px dotted rgba(0,0,0,0.7);
                border-radius: 3px;
                text-align: center;
                cursor: pointer;
                transition: .1s all ease-in-out;
            }
            .copyBtn:hover {
                transition: 0s all;
                opacity: 0.8;
                border: 1px solid rgba(0,0,0,0.8);
            }
            .copyBtn:active {
                opacity: 1;
            }
            .copyElem.true .copyBtn{
                border: 1px solid #FD6C6C;
                color: white;
                background-color: #FD6C6C;
            }
            .copyElem.true{
                color: rgba(0,0,0,0.4);
            }
            `}</style>
      </span>
    );
  }
}
