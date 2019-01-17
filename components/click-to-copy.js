import copy from 'copy-to-clipboard';
import Button from './button';

export default class ClickToCopy extends React.Component {
  getValue() {
    return this.props.copied ? 'Copied 👌' : 'Copy to clipboard';
  }
  render() {
    const {
      handleClipBoardCopy,
      target,
      children,
      ariaLabelSuffix,
      copied,
      ...rest
    } = this.props;
    const value = this.getValue(copied);
    const ariaLabel = `${value} ${ariaLabelSuffix}`;
    return (
      <span className={'copyElem ' + copied}>
        <Button
          onClick={() => copy(target) && handleClipBoardCopy()}
          value={value}
          aria-label={ariaLabel}
          {...rest}
        />
        {children}
        <style jsx>{`
          .copyElem.true {
            color: rgba(0, 0, 0, 0.4);
          }
        `}</style>
      </span>
    );
  }
}
