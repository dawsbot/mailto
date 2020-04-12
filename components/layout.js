import Head from 'next/head';
import GHCorner from 'react-github-corner';

export default ({ children }) => (
  <div>
    <Head>
      <title>{`mailto builder`}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        href="https://fonts.googleapis.com/css?family=Coming+Soon"
        rel="stylesheet"
      />
    </Head>
    <div className="notbody">
      <GHCorner
        href="https://github.com/dawsbot/mailto"
        bannerColor="#FD6C6C"
        size="150px"
      />
      {children}
      <style jsx global>{`
        body {
          margin: 80px 20px;
          font-family: 'Coming Soon', cursive;
        }
        .notbody {
          max-width: 600px;
          margin: auto;
        }
      `}</style>
    </div>
  </div>
);
