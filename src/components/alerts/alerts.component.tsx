"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAlerts } from "@/state/alerts.state";
import { Cross1Icon } from "@radix-ui/react-icons";

import { Alert } from "@/types/types";

import s from "./alerts.module.css";

const Alert: FC<Alert> = ({ id, title, text, type }) => {
  const { removeAlert } = useAlerts();

  return (
    <motion.li
      className={`${s.alert} ${s[type]}`}
      initial={{ x: 0 }}
      animate={{ x: -400 }}
      exit={{ x: 50 }}
    >
      <div className={s.title}>{title}</div>
      <div className={s.text}>{text}</div>
      <div className={`${s.close} ${s[type]}`} onClick={() => removeAlert(id)}>
        <Cross1Icon />
      </div>
    </motion.li>
  );
};

const Alerts: FC = () => {
  const { alerts } = useAlerts();

  return (
    <ul className={s.container}>
      <AnimatePresence>
        {alerts &&
          alerts.map(({ id, type, title, text }) => (
            <Alert key={id} id={id} type={type} title={title} text={text} />
          ))}
      </AnimatePresence>
    </ul>
  );
};

export default Alerts;
