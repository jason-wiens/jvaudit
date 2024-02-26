import React, { FC } from "react";
import Link from "next/link";

import s from "./logo.module.css";

type LogoProps = {
  classes?: string;
  link?: boolean;
  variant?: "light" | "dark" | "white";
};

const Logo: FC<LogoProps> = ({
  classes = "text-normal",
  link = true,
  variant = "dark",
}) => {
  return (
    <>
      {link ? (
        <Link href="/" className={s.text}>
          <span className={`${s.jv} ${s[variant]}`}>jv</span>
          <span className={`${s.audit} ${s[variant]}`}>Audit</span>
        </Link>
      ) : (
        <div className={s.text}>
          <span className={`${s.jv} ${s[variant]}`}>jv</span>
          <span className={`${s.audit} ${s[variant]}`}>Audit</span>
        </div>
      )}
    </>
  );
};

export default Logo;
