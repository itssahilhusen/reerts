"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { CreditUsageGuide } from "./CreditUsageGuide";

interface PricingProps {
  onOpenTrial: (planName?: string) => void;
}

export function Pricing({ onOpenTrial }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      id: "creator",
      name: "Creator",
      description: "For creators & founders starting their automated distribution journey.",
      priceMonthly: 29,
      priceYearly: 20,
      yearlyBilledTotal: 240,
      yearlySaved: 108,
      popular: false,
      features: [
        "1 Workspace Seat",
        "5 Connected Social Accounts",
        "150 AI Generation Credits / mo",
        "AI Carousel Generator (PDF / Image)",
        "Single Brand Voice Profile",
        "Unified Calendar & Multi-channel Queue",
        "Standard Analytics & Reach Tracking",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      description: "For high-velocity founders and operators seeking maximum viral growth.",
      priceMonthly: 79,
      priceYearly: 55,
      yearlyBilledTotal: 660,
      yearlySaved: 288,
      popular: true,
      features: [
        "3 Workspace Seats",
        "15 Connected Social Accounts",
        "600 AI Generation Credits / mo",
        "Unlimited Carousel Generation",
        "Multiple Brand Voice Personas",
        "Comment-to-DM Auto-responder",
        "Competitor Radar & Content Remixer",
        "AI Viral Hook Scorer",
        "Priority Support",
      ],
    },
    {
      id: "agency",
      name: "Agency",
      description: "For marketing agencies managing distribution for multiple clients.",
      priceMonthly: 149,
      priceYearly: 104,
      yearlyBilledTotal: 1248,
      yearlySaved: 540,
      popular: false,
      features: [
        "Unlimited Team Members",
        "50 Connected Client Accounts",
        "2,500 AI Generation Credits / mo",
        "Passwordless Client OAuth Invites",
        "Whitelabel Client Portals & Reports",
        "Custom API & Webhook Access",
        "Dedicated Success Manager",
        "SLA & Priority Queue Processing",
      ],
    },
  ];

  return (
    <section id="pricing" className="border-t border-border px-4 py-20 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Image
              src="/images/logos/logo-light-svg.svg"
              alt="reerts"
              width={32}
              height={32}
              className="rounded-md dark:hidden"
            />
            <Image
              src="/images/logos/logo-dark-svg.svg"
              alt="reerts"
              width={32}
              height={32}
              className="rounded-md hidden dark:block"
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            All plans include a 7-day full feature trial. No credit card required upfront.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center rounded-full border border-border bg-card p-1 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Yearly - 30%</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                billingCycle === "yearly" ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}>
                Save 30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-card p-6 sm:p-8 transition-all shadow-sm ${
                  plan.popular
                    ? "border-primary ring-2 ring-primary/20 shadow-xl md:-translate-y-2"
                    : "border-border hover:border-border/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-foreground sm:text-5xl">${price}</span>
                      <span className="text-sm font-medium text-muted-foreground">/mo</span>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Billed <s className="font-bold">${plan.priceMonthly * 12}</s> ${plan.yearlyBilledTotal} yearly (Save ${plan.yearlySaved})
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenTrial(plan.name)}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-semibold transition-all shadow-xs ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    Start 7-day free trial
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="mt-8 space-y-3 pt-6 border-t border-border">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">What's included:</p>
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 text-center">
                  <span className="text-[11px] text-muted-foreground">Cancel anytime with 1 click</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credit Usage Guide Accordion Section */}
        <CreditUsageGuide />
      </div>
    </section>
  );
}
