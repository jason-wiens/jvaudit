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
    <div className="w-full h-screen bg-primary-900 relative flex items-center justify-center">
      <div className="w-full fixed top-0 left-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex justify-between py-8 mb-16">
            <div className="text-4xl font-bold">
              <Logo variant="white" />
            </div>
            <ul className="flex items-center gap-8">
              <li>
                <Button asChild variant="ghost">
                  <Link
                    href={AppRoutes.LoginPage()}
                    className="text-white flex gap-2"
                  >
                    <span className="text-accent-500 font-normal">
                      (Beta Users)
                    </span>{" "}
                    Log In
                  </Link>
                </Button>
              </li>
              <li>
                <Subscribe>
                  <Button variant="secondary">Contact Us</Button>
                </Subscribe>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex gap-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex flex-col items-start text-zinc-100">
          <div className="text-6xl leading-none mb-8">
            Modern workflow
            <br /> for <span className="text-accent-500">
              Joint Venture
            </span>{" "}
            Audits
          </div>
          <div className="w-full mb-16">
            <div className="w-1/3 h-[1px] bg-zinc-100 mb-8"></div>
            <h3 className="text-xl lg:text-3xl mb-8">
              Status:{" "}
              <span className="text-secondary-500">Beta Testing (MVP)</span>
            </h3>
            <p className="mb-4">
              jvAudit.io was purpose built for joint venture audit management.
              We wanted to develop a platform to organize all audit documents
              and facilitate communication between stakeholders for the purpose
              of executing and resolving audits with greater efficiency. With
              security and privacy at the center, jvAudit.io manages:
            </p>
            <ul className="list-disc ml-8 lg:ml-16 mb-4">
              <li>Audit Creation</li>
              <li>Audit Preperation</li>
              <li>IR Submission</li>
              <li>IR Resolution</li>
              <li>Document Transfers / Handling</li>
              <li>Audit Reporting</li>
              <li>Exception Response & Rebuttals</li>
              <li>Audit Resolutions</li>
              <li>Metric tracking and dashboards</li>
            </ul>
            <p>
              jvAudit.io was developed by auditors with decades of practical
              experience. Each feature was carefully crafted for industry
              standards and best practices. With letters of intent from some of
              the largest producers in western Canada, jvAudit.io is scheduled
              for enterprise release Q4 2024.
            </p>
          </div>
          <Subscribe>
            <Button variant="accent">
              Subscribe to get updates on our progress
            </Button>
          </Subscribe>
        </div>
        <div className="flex-1 relative">
          <div className="relateive w-full">
            <Image
              src={imgIRs}
              alt="Screen shot of the Information Request Dashboard"
              className="w-[55%] absolute bottom-32 left-0 z-10 shadow-light5"
            />
            <Image
              src={imgIR}
              alt="Screen shot of the Information Request form"
              className="w-[55%] absolute bottom-16 right-0 shadow-light5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
