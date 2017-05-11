import Head from 'next/head';
import GHCorner from 'react-github-corner';

export default ({ children }) => (
  <div>
    <Head>
      <title>{`💌⚡️ HTML mailto's made easy️`}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <style>{`
        body {
          margin: 70px 20px;
          font-family: 'Coming Soon', cursive;
        }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css?family=Coming+Soon"
        rel="stylesheet"
      />
      <GHCorner
        href="https://github.com/dawsbot/mailto"
        bannerColor="#FD6C6C"
        height="80px"
        width="80px"
      />
    </Head>
    <div className="notbody">
      {children}
      <style jsx>{`
        .notbody {
          max-width: 600px;
          margin: auto;
        }
      `}</style>
    </div>
  </div>
);
