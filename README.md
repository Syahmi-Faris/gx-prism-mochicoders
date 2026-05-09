# GX Prism Prototype Proposal

## One-Line Pitch

**GX Prism transforms GXBank into an AI-powered financial resilience system that captures spending effortlessly, detects risky behaviour, intervenes before impulse spending, and rebuilds healthier money habits automatically.**

---

# Overview

GX Prism is an AI-powered financial resilience ecosystem designed for Malaysian youth. Instead of functioning as a traditional expense tracker, GX Prism acts as an active financial behaviour assistant integrated with GXBank.

The system helps users:

* Capture spending effortlessly
* Detect risky financial behaviour
* Prevent impulsive spending
* Reduce BNPL dependency
* Automate savings and financial recovery
* Build healthier long-term money habits

GX Prism combines AI, behavioural economics, and automation to help users build financial resilience before debt problems become serious.

---

# Target Users

GX Prism is designed for:

* Malaysian tertiary students
* Fresh graduates
* Interns
* Early-career workers
* Users with allowance, scholarship, salary, or part-time income
* Users struggling with:

  * Manual expense tracking
  * Impulse spending
  * BNPL dependency
  * Inconsistent saving habits

These users often understand the importance of financial management but need a system that reduces friction and guides them at critical decision moments.

---

# Problem Statement

The case study focuses on how GXBank can help Malaysian youth build financial resilience and prevent debt accumulation using:

* AI
* Behavioural economics
* Automated habit-building

GX Prism addresses three major problems:

## 1. Tracking Friction

Users stop recording expenses because manual input becomes tiring.

## 2. Invisible Spending Patterns

Users often fail to realize how repeated small spending habits create long-term financial instability.

## 3. Delayed Regret

Most financial apps only show spending insights after money has already been spent.

---

# Solution Architecture

GX Prism solves these problems through:

* Effortless spending capture
* AI spending pattern detection
* Real-time impulse intervention
* Automated savings and recovery systems
* Gamified financial reinforcement

---

# Core Features

## 1. Smart Capture

### Purpose

Most finance apps fail because users eventually stop manually recording expenses.

GX Prism removes this friction by making spending capture nearly effortless.

### Features

#### GXBank Auto Sync

* GXBank transactions are automatically logged.
* No manual tracking required.

#### Screenshot Extraction

Users can upload screenshots from:

* Touch 'n Go
* ShopeePay
* Other bank apps
* E-wallet transaction histories

AI extracts:

* Merchant
* Amount
* Date
* Category

#### Voice Log

Users can record expenses naturally.

Example:

```text
“RM8 for nasi lemak”
```

The app converts speech into structured financial data.

#### Quick Cash Input

For offline spending, users can quickly input:

* Amount
* Spending category

### Benefits

* Reduces manual effort
* Improves consistency in tracking
* Maintains accurate spending records
* Works well for busy or less disciplined users

---

## 2. Behaviour Intelligence + Impulse Intercept

### Purpose

GX Prism does not only analyze past spending.

It proactively detects risky financial behaviour and intervenes before users regret financial decisions.

### AI Behaviour Detection

The system identifies patterns such as:

* Late-night food delivery spikes
* Repeated BNPL purchases
* Exam-week overspending
* Luxury purchases with low balance
* Unusual spending spikes

### Example Insight

```text
“Your spending increases by 27% during assessment week.”
```

### Impulse Intercept

When risky behaviour is detected, GX Prism activates an intervention flow.

Example:

A user attempts a Shopee BNPL-related payment.

GX Prism warns:

```text
“This purchase may reduce your weekly essentials budget by RM38.”
```

The user can then:

* Pause the purchase
* Delay the decision
* Redirect money into Recovery Pocket
* Continue anyway

### Benefits

* Prevents impulsive spending
* Reduces BNPL dependency
* Protects essentials budget
* Encourages mindful financial decisions

---

## 3. Auto-Rebuild + Reinforcement

### Purpose

After risky spending is detected or avoided, GX Prism helps users rebuild financial stability automatically.

### Auto-Rebuild System

#### Payday Split

Income or allowance is automatically divided into:

* Essentials
* Daily Spend
* Savings
* Emergency Buffer
* Recovery Pocket

#### Recovery Pocket

Money saved from:

* Cancelled impulse purchases
* BNPL recovery actions

is redirected into a protected savings pocket.

#### Automated Saving Rules

Supported automation includes:

* Round-up savings
* Weekly reserve transfers
* Salary-triggered savings

### Reinforcement System

GX Prism motivates users through:

* Resilience streaks
* Cheat day tokens
* Badges
* Milestone rewards
* Cashback or savings bonus simulations

### Benefits

* Makes good financial habits automatic
* Encourages consistency
* Builds emergency savings gradually
* Rewards healthy financial behaviour

---

# Final Prototype Flow

```text
Smart Capture
      ↓
Behaviour Intelligence
      ↓
Impulse Intercept
      ↓
Auto-Rebuild
      ↓
Reinforcement
```

### Flow Description

1. Smart Capture collects spending data from GXBank, screenshots, voice logs, and cash input.
2. Behaviour Intelligence analyzes spending patterns.
3. Impulse Intercept pauses risky spending before regret happens.
4. Auto-Rebuild redirects money into savings and structured pockets.
5. Reinforcement rewards healthy financial discipline.

---

# Overall Benefits

## User Benefits

GX Prism helps users:

* Track expenses with minimal effort
* Understand spending behaviour clearly
* Avoid impulsive purchases
* Reduce BNPL dependency
* Protect essential spending
* Build emergency savings
* Develop long-term financial discipline
* Enjoy guilt-free spending when financially safe

## GXBank Benefits

GX Prism strengthens GXBank by transforming it from:

```text
Passive Transaction App
            ↓
Proactive Financial Resilience Ecosystem
```

This increases:

* User engagement
* Financial wellness adoption
* Long-term customer trust
* Youth retention within the GXBank ecosystem

---

# Key Innovation

Unlike traditional budgeting apps that only show historical spending data, GX Prism:

* Detects risky behaviour proactively
* Intervenes before harmful financial decisions occur
* Automatically rebuilds financial stability
* Reinforces positive financial habits continuously

GX Prism focuses on prevention, recovery, and behavioural change rather than simple transaction tracking.

---

# Conclusion

GX Prism reimagines digital banking as a behavioural financial assistant for Malaysian youth.

By combining AI-powered spending intelligence, proactive intervention, automated rebuilding systems, and gamified reinforcement, GX Prism helps users develop sustainable financial resilience with minimal friction.

The platform transforms GXBank into a smarter, more human-centered financial ecosystem built for the next generation.
