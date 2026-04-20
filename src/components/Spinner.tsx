import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: string;
}

export const Spinner = ({ size = "1.3em" }: SpinnerProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.spinner}
    style={{ width: size, height: size }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
