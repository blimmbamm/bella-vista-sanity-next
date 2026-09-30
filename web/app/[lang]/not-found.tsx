import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Diese Seite gibt es leider nicht.</h1>
      <p className={styles.subtitle}>This page does not exist.</p>
      <Link href="/" className={styles.link}>
        Startseite · Home
      </Link>
    </div>
  );
}
