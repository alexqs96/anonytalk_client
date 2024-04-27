import { AlexDev, GithubLogo, LinkedinLogo } from "./Icons";

export default function Social({ className }: { className?: string }) {
  return (
    <div className={"nav-items" + (className ? " " + className : "")}>
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
        href="https://alexqs96.vercel.app"
        target="_blank"
        rel="noreferrer noopener"
        title="Portfolio"
      >
        <AlexDev />
      </a>
    </div>
  );
};

