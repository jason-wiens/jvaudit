"use client";

import React, { FC, useState } from "react";
// import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { Logo } from "@components/logo";
// import { InputText, SubmitButton, FormWithRecaptcha } from "../forms";

// import { subscribe } from "../../data/actions/subscribe/subscribe.action";

// import { RECAPTCHA_SITE_KEY } from "../../constants";

import s from "./subscribe.module.css";

type FormData = {
  email: string;
};

const Subscribe: FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "" });
  const [error, setError] = useState<string>("");
  const [waiting, setWaiting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // TODO: Refactor Below for new useForm hook

  const handleSubmit = async (token: string) => {
    // setWaiting(true);
    // const subscribeResults = await subscribe({ ...formData, token });
    // const { status, data, errors } = subscribeResults;
    // if (status === "error") {
    //   if (errors.email) setError(errors.email);
    //   if (errors.general) setError(errors.general);
    //   setWaiting(false);
    //   return;
    // }
    // setSuccess(data.success);
    // setWaiting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ email: e.target.value });
  };

  return (
    <div className="mt-32 w-full flex flex-col justify-center items-center bg-gray-100 p-16">
      <div className="mb-8 text-center">
        <span className="font-bold">
          <Logo />
        </span>{" "}
        is currently in closed beta for invite only.
        <br />
        To follow our progress or to get on the beta waitlist please subscribe
        below:
      </div>
      {success ? (
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-500">
            Thank you!
          </div>
          <div className="">We will be in touch soon.</div>
        </div>
      ) : (
        // <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY!}>
        //   <FormWithRecaptcha
        //     onSubmit={handleSubmit}
        //     className="flex gap-16 justify-between items-start w-full max-w-xl"
        //   >
        //     <InputText
        //       name="email"
        //       value={formData.email}
        //       placeholder="Email Address"
        //       onChange={handleChange}
        //       disabled={waiting}
        //       error={error}
        //     />
        //     <SubmitButton busy={waiting} color="accent">
        //       Subscribe
        //     </SubmitButton>
        //   </FormWithRecaptcha>
        // </GoogleReCaptchaProvider>
        <p>Form Here</p>
      )}
    </div>
  );
};

export default Subscribe;
