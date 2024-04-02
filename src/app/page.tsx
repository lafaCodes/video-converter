import Image from "next/image";
import styles from "./page.module.css";
import Ffmpeg from "./ffmeg";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by uploading your media & click&nbsp;
          <code className={styles.code}>"convert"</code>
        </p>
        <div>
          <a
            href="https://lafacodes.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/lafa.codes_.svg"
              alt="lafa.codes_"
              className={styles.vercelLogo}
              width={50}
              height={50}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        {/* Video Editor Code */}
        <Ffmpeg />
      
      </div>

      <div className={styles.center}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about getting started with Gif Maker.</p>
        </a>
      </div>
    </main>
  );
}
