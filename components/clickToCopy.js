import copy from 'copy-to-clipboard';
import Button from './button';

export default class ClickToCopy extends React.Component {
  state = {
    copied: false
  };
  copyNow = t => {
    copy(t);
    this.setState({
      copied: true
    });
  };
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
        <span onClick={() => this.copyNow(target)}>
          <Button text={copied ? 'copied 👌' : 'copy'} />
        </span>
        {children}
        <style jsx>{`
            .copyElem.true{
                color: rgba(0,0,0,0.4);
            }
            `}</style>
      </span>
    );
  }
}
