export default ({ href, text }) => (
  <a href={href} target="_blank">
    <button className="email-button" type="button">
      {text}
    </button>
    <style jsx>{`
      button {
        margin: 0px 8px;
        background-color: #FD6C6C;
        color: white;
        border-width: 0px;
        border-radius: 3px;
        padding: 3px 15px;
        cursor: pointer;
        font-family: 'Coming Soon', cursive;
        font-size: 14px;
        transition: box-shadow  0.2s ease-in-out;
        outline: none;
        text-transform: capitalize;
        max-height: 27px;
        line-height: 27px;
      }
      button:hover {
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
    `}</style>
  </a>
);
