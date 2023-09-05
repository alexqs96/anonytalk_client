import { AlexDev, GithubLogo, LinkedinLogo } from "./Icons"

const Social = () => {
  return (
    <div className="flex items-center w-fit gap-1.5 reveal border border-black/5 bg-white shadow dark:bg-slate-700 dark:border-white/5 py-2 px-3 rounded-xl">
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
  )
}

export default Social