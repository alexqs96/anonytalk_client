import { AlexDev, GithubLogo, LinkedinLogo } from "./Icons";

const Social = () => {
  return (
    <div className="nav-items">
      <a
        href="https://github.com/alexqs96"
        target="_blank"
        rel="noreferrer noopener"
        title="Github"
      >
        <GithubLogo />
      </a>

      <a
        href="https://www.linkedin.com/in/alexander-mamani"
        target="_blank"
        rel="noreferrer noopener"
        title="Linkedin"
      >
        <LinkedinLogo />
      </a>

      <a
        href="https://alexdev.com.ar"
        target="_blank"
        rel="noreferrer noopener"
        title="Portfolio"
      >
        <AlexDev />
      </a>
    </div>
  );
};

export default Social;
