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
  getValue() {
    return this.state.copied ? 'Copied 👌' : 'Copy to clipboard';
  }
  render() {
    const { target, children, ariaLabelSuffix, ...rest } = this.props;
    const { copied } = this.state;
    const value = this.getValue(copied);
    const ariaLabel = `${value} ${ariaLabelSuffix}`;
    return (
      <span className={'copyElem ' + copied}>
        <Button
          onClick={() => this.copyNow(target)}
          value={value}
          aria-label={ariaLabel}
          {...rest}
        />
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
