# sales_content.py



async def get_sales_content():
    return [

        # ────────── SecureTrack ──────────
        {
            "title": "SecureTrack Vision",
            "content": "SecureTrack will let teams model their cloud and application architecture in plain English, then auto-map it to SOC 2, NIST, and ISO controls. Imagine knowing your compliance gaps before writing a single line of code.",
            "category": "SecureTrack",
            "type": "benefit",
            "intent_stage": "awareness",
            "persona": "CTO"
        },
        {
            "title": "SecureTrack Early-Access CTA",
            "content": "We’re opening a limited early-access cohort for SaaS companies that want architecture-first compliance. Would you like to reserve a spot on the wait-list?",
            "category": "SecureTrack",
            "type": "cta",
            "intent_stage": "consideration",
            "persona": "Founder"
        },
        {
            "title": "SecureTrack FAQ – Setup Time",
            "content": "Pilot users integrate SecureTrack by pointing it at their IaC repo or Architecture Decision Records. No agents, no sidecars – you get insights the same day.",
            "category": "SecureTrack",
            "type": "faq",
            "intent_stage": "consideration",
            "persona": "DevOps Lead"
        },

        # ────────── BizRadar ──────────
        {
            "title": "BizRadar Opportunity Teaser",
            "content": "BizRadar continuously watches government and freelance portals, matching new RFPs to your keywords and past wins. Think of it as a radar that beeps only when a perfect-fit contract appears.",
            "category": "BizRadar",
            "type": "benefit",
            "intent_stage": "awareness",
            "persona": "Sales Director"
        },
        {
            "title": "BizRadar Wait-List CTA",
            "content": "Beta seats are limited. Would you like priority access to the private launch and a personalised onboarding walkthrough?",
            "category": "BizRadar",
            "type": "cta",
            "intent_stage": "decision",
            "persona": "BD Manager"
        },
        {
            "title": "BizRadar FAQ – Data Sources",
            "content": "At launch, BizRadar will aggregate federal, state, and top freelance marketplaces, with AI filters so you don’t drown in noise. New sources are added every month.",
            "category": "BizRadar",
            "type": "faq",
            "intent_stage": "consideration",
            "persona": "Consultant"
        },

        # ────────── AI Security Services ──────────
        {
            "title": "AI Security Value",
            "content": "Our AI Security practice stress-tests LLM prompts, guards against jailbreaks, and embeds robust audit trails – so you can ship GenAI features with confidence.",
            "category": "AI Security",
            "type": "benefit",
            "intent_stage": "awareness",
            "persona": "Head of Product"
        },
        {
            "title": "AI Security Engagement CTA",
            "content": "Want a 30-minute design review of your GPT-powered feature? Our AI-red-team will highlight top three risks and quick wins.",
            "category": "AI Security",
            "type": "cta",
            "intent_stage": "decision",
            "persona": "CISO"
        },

        # ────────── Cloud Engineering Services ──────────
        {
            "title": "Cloud Engineering Snapshot",
            "content": "We architect cloud landing zones that balance speed and guardrails – automated IAM, cost lenses, and zero-trust defaults baked in.",
            "category": "Cloud Engineering",
            "type": "benefit",
            "intent_stage": "awareness",
            "persona": "Cloud Architect"
        },
        {
            "title": "Cloud Eng. FAQ – Multi-Cloud",
            "content": "Our blueprints cover AWS, Azure, and GCP. A single Terraform stack can spin up compliant baselines in whichever provider you prefer.",
            "category": "Cloud Engineering",
            "type": "faq",
            "intent_stage": "consideration",
            "persona": "DevOps Lead"
        },

        # ────────── Application Security Services ──────────
        {
            "title": "AppSec Pen-Test Pitch",
            "content": "Our pentesters simulate real attackers, then pair with your devs to fix root causes – not just patch symptoms.",
            "category": "Application Security",
            "type": "benefit",
            "intent_stage": "awareness",
            "persona": "Engineering Manager"
        },
        {
            "title": "AppSec CTA – Free Scoping Call",
            "content": "Curious how your web/API stack would fare? Book a free 20-minute scoping call and get a risk snapshot.",
            "category": "Application Security",
            "type": "cta",
            "intent_stage": "decision",
            "persona": "Founder"
        },

        # ────────── Data Engineering Services ──────────
        {
            "title": "Data Eng. Modernisation",
            "content": "We migrate legacy ETL to event-driven pipelines and optimise lakehouse costs, unlocking near-real-time analytics for business teams.",
            "category": "Data Engineering",
            "type": "benefit",
            "intent_stage": "awareness",
            "persona": "Analytics Lead"
        },
        {
            "title": "Data Eng. FAQ – Tools",
            "content": "Our stack includes Snowflake, Databricks, Kafka, and dbt – but we start with your goals, not tool hype.",
            "category": "Data Engineering",
            "type": "faq",
            "intent_stage": "consideration",
            "persona": "Data Engineer"
        }
    ]
