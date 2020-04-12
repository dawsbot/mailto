import Head from 'next/head';
import GHCorner from 'react-github-corner';

export default ({ children }) => (
  <div>
    <Head>
      <title>{`mailto builder`}</title>
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
        input {
          font-family: 'Courier Prime', monospace;
        }

        .notbody {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-sections {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  </div>
);
