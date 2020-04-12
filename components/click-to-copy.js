import copy from 'copy-to-clipboard';
import Button from './button';

export default props => {
  const {
    handleClipBoardCopy,
    target,
    children,
    ariaLabelSuffix,
    copied,
    ...rest
  } = props;
  const value = copied ? 'Copied 👌' : 'Copy to clipboard';
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
};
