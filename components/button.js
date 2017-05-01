export default ({ href }) => (
  <a href={href} target="_blank">
    <button className="email-button" type="button">
      {'Test Email'}
    </button>
    <style jsx>{`
      button {
        margin: 0px 8px;
        background-color: #FD6C6C;
        color: white;
        border-width: 0px;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-family: 'Coming Soon', cursive;
        font-size: 16px;
        transition: box-shadow 0.2s ease-in-out;
      }
      button:hover {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
    `}</style>
  </a>
);
