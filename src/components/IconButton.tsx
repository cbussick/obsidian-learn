import { ReactNode } from "react";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  label: string;
  icon: ReactNode;
}

export const IconButton = ({ label, icon }: IconButtonProps) => (
  <div className={styles.iconButton}>
    <p>{label}</p>
    {icon}
  </div>
);
