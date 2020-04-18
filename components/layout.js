import Head from 'next/head';
import GHCorner from 'react-github-corner';

export default ({ children }) => (
  <div>
    <Head>
      <title>{`Mailto builder`}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap"
        rel="stylesheet"
      />

      <meta
        name="description"
        content="Template FULL emails in an html mailto. We make special characters and emojis simple!"
      />
      <meta
        name="keywords"
        content="mailto,web,developer,HTML,CSS,JavaScript"
      />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
    <div className="notbody">
      <GHCorner
        href="https://github.com/dawsbot/mailto"
        bannerColor="#FD6C6C"
        size="160px"
      />
      <div className="page-sections">{children}</div>
      <style jsx global>{`
        body {
          margin: 100px 8vw;
        }

        body,
        textarea,
        button,
        input {
          font-family: 'Courier Prime', monospace;
          font-size: 16px;
        }

        .notbody {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-sections {
          display: flex;
          justify-content: center;
        }

        // Hightlight color
        // https://stackoverflow.com/questions/2258647/changing-the-highlight-color-when-selecting-text-in-an-html-text-input
        /*** Works on common browsers ***/
        ::selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        /*** Mozilla based browsers ***/
        ::-moz-selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        /***For Other Browsers ***/
        ::-o-selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        ::-ms-selection {
          background-color: #fd6c6c;
          color: #fff;
        }

        /*** For Webkit ***/
        ::-webkit-selection {
          background-color: #352e7e;
          color: #fff;
        }
      `}</style>
    </div>
  </div>
);
