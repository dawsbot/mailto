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
      {children}
      <style jsx global>{`
        body {
          margin: 80px 20px;
        }

        body,
        textarea,
        input {
          font-family: 'Courier Prime', monospace;
        }

        .notbody {
          max-width: 600px;
          margin: auto;
        }
      `}</style>
    </div>
  </div>
);
