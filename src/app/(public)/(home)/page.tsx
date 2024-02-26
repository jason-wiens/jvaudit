import React from "react";
import Link from "next/link";
import Image from "next/image";
// import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { Logo } from "@components/logo";
import { Subscribe } from "@components/subscribe";

import { AppRoutes } from "@lib/routes.app";
import { Button } from "@/components/ui/button";

import imgIRs from "@public/images/screen-shot-irs.png";
import imgIR from "@public/images/screen-shot-ir.png";

const HomePage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full flex justify-between py-8 mb-16">
        <div className="text-4xl font-bold">
          <Logo />
        </div>
        <ul className="flex items-center gap-8">
          <li>
            <Button asChild variant="ghost">
              <Link href={AppRoutes.ContactUsPage}>Contact Sales</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost">
              <Link href={AppRoutes.LoginPage}>Log In</Link>
            </Button>
          </li>
          <li>
            <Button asChild>
              <Link href={AppRoutes.LoginPage}>Get Started</Link>
            </Button>
          </li>
        </ul>
      </div>
      <div className="w-full flex gap-16">
        <div className="flex-1 flex py-16 flex-col items-start">
          <div className="text-6xl leading-none mb-8">
            Modern workflow
            <br /> for <span className="text-accent-500">
              Joint Venture
            </span>{" "}
            Audits
          </div>
          <div className="w-full mb-28">
            <div className="w-1/3 h-[1px] bg-primary-500 mb-8"></div>
            <div className="text-xl">
              From audit preperation to fieldwork to report submission,
              jvAudit.io organizes your audit work and communication securly so
              all stakeholders remain engaged for faster audit resolutions.
            </div>
          </div>
          <Button asChild>
            <Link href={AppRoutes.LoginPage}>Get Started</Link>
          </Button>
        </div>
        <div className="flex-1 relative">
          <Image
            src={imgIRs}
            alt="Screen shot of the Information Request Dashboard"
            className="w-[55%] absolute bottom-32 left-0 z-10 shadow-md"
          />
          <Image
            src={imgIR}
            alt="Screen shot of the Information Request form"
            className="w-[55%] absolute bottom-16 right-0 shadow-md"
          />
        </div>
      </div>
      <Subscribe />
    </div>
  );
};

export default HomePage;
