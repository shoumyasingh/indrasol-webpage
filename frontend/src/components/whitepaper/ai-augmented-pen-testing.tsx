import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  ChevronRight,
  BookOpen,
  LockKeyhole,
  Shield,
  Cpu,
  RefreshCw,
  Database,
  Mail,
  ArrowRight,
  Share2,
  Download,
  Bookmark as BookmarkIcon,
  User,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../ui/navbar";
import { Footer } from "../ui/footer";


const WhitePaper1 = () => {
  // State for sticky TOC
  const [activeSection, setActiveSection] = useState("abstract");
  const [isTocSticky, setIsTocSticky] = useState(false);

  // You can customize these variables
  const whitepaper = {
    title: "AI-Augmented Penetration Testing: The Future of Offensive Security",
    authors: "Lakshmi Medasani",
    publishDate: "May 2025",
    readTime: "25 min read",
    contactUrl: "/contact",
    coverImage: "/whitepaperImage/scope.png",
    slug: "ai-augmented-penetration-testing",
  };

  // Table of contents structure
  const tableOfContents = [
    { id: "abstract", title: "Abstract" },
    { id: "introduction", title: "Introduction" },
    { id: "decoding", title: "Decoding AI-Augmented Penetration Testing" },
    { id: "promise", title: "The Promise of Intelligent Offense" },
    { id: "navigating", title: "Navigating the Labyrinth" },
    { id: "tools", title: "AI-Powered Tools and Techniques" },
    { id: "roadmap", title: "Roadmap Ahead" },
    { id: "conclusion", title: "Conclusion" },
    { id: "bibliography", title: "Bibliography" },
  ];

  // Related whitepapers - you can customize these
  const relatedPapers = [
    {
      id: "1",
      title:
        "AI-Augmented Penetration Testing: The Future of Offensive Security",
      excerpt:
        "A practical framework for implementing Zero Trust security principles in AI/ML infrastructure, with specific focus on model serving and inference pipelines.",
      category: "Security Architecture",
      authors: "Lakshmi Medasani",
      publishDate: "May 2025",
      image: "/whitepaperImage/scope.png",
      slug: "ai-augmented-penetration-testing",
    },
  ];

  // Handle section tracking for ToC highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Make TOC sticky when scrolling
      const tocElement = document.getElementById("toc-container");
      if (tocElement) {
        const tocPosition = tocElement.getBoundingClientRect().top;
        setIsTocSticky(tocPosition <= 20);
      }

      // Update active section based on scroll position
      const sections = tableOfContents.map((item) =>
        document.getElementById(item.id)
      );
      let currentSection = "abstract";

      sections.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = section.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      {/* Add Navbar at the top of the component */}
      <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      {/* Hero section with image background */}
      <div className="w-full h-64 md:h-96 relative bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {whitepaper.publishDate}
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4 mr-2" />
              {whitepaper.readTime}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {whitepaper.title}
            </h1>
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full">
                <span className="font-medium">By {whitepaper.authors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-8xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <a href="/" className="hover:text-indrasol-blue transition-colors">
              Home
            </a>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <a href="/" className="hover:text-indrasol-blue transition-colors">
              Resources
            </a>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <a
              href="/Resources/whitepaper"
              className="hover:text-indrasol-blue transition-colors"
            >
              White Papers
            </a>
            <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            <span className="text-gray-700 font-medium">
              AI-Augmented Penetration Testing
            </span>
          </div>

          {/* Main content with sidebar layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-2/3 order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-12">
                {/* Table of Contents - Mobile Dropdown */}
                <div className="block lg:hidden p-4 border-b border-gray-100">
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue appearance-none"
                      value={activeSection}
                      onChange={(e) => {
                        const section = e.target.value;
                        document
                          .getElementById(section)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {tableOfContents.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 transform rotate-90" />
                  </div>
                </div>

                {/* Content wrapper with padding */}
                <div className="p-6 md:p-10">
                  {/* Share and Bookmark Bar */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">
                        {whitepaper.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Abstract Section */}
                  <div id="abstract" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Abstract
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <div className="bg-gradient-to-r from-indrasol-blue/10 to-indrasol-blue/5 p-6 rounded-xl border-l-4 border-indrasol-blue mb-8">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          As cyber threats become more sophisticated,
                          organizations face a widening gap between traditional
                          security assessments and the evolving nature of modern
                          attacks. Manual penetration testing has long
                          identified vulnerabilities through targeted techniques
                          and human expertise, but it can be time‑intensive,
                          narrow in scope, and less effective against AI‑driven
                          threats that adapt rapidly. Artificial Intelligence
                          (AI) is transforming both defensive and offensive
                          cybersecurity. Security teams use AI for automated
                          threat detection and anomaly analysis, while malicious
                          actors leverage AI to develop evasive attacks that
                          bypass conventional controls. This dual use of AI
                          emphasizes the need for security strategies that match
                          the speed and adaptability of emerging threats.
                        </p>

                        <p className="text-gray-700 leading-relaxed text-lg">
                          AI‑augmented penetration testing integrates machine
                          learning (ML) and advanced analytics into every phase
                          of the testing lifecycle. Beyond automating routine
                          tasks such as scanning and data collection, it
                          enables:
                        </p>

                        <ul className="space-y-4 mb-6">
                          <li className="flex items-start">
                            <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              1
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                              Scalable Assessment, for processing large volumes
                              of logs and system metrics to identify patterns
                              beyond manual review
                            </p>
                          </li>
                          <li className="flex items-start">
                            <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              2
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                              Traditional Adaptive Attack Simulation, to model
                              complex attack chains that mimic sophisticated
                              adversaries in real time
                            </p>
                          </li>
                          <li className="flex items-start">
                            <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              3
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                              Risk Prioritization to score vulnerabilities based
                              on business impact, compliance requirements, and
                              exploitability.
                            </p>
                          </li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Augmenting human expertise and AI’s capabilities
                          equips organizations to achieve comprehensive
                          coverage, faster testing cycles, and prioritized
                          remediation plans that align with corporate risk
                          appetites. This approach not only improves efficiency
                          but also deepens the real-world adoption in security
                          evaluations. From an executive standpoint,
                          AI‑augmented testing delivers clear business value in
                          several critical areas. Shortened testing cycles drive
                          faster patching, reducing exposure windows and
                          limiting operational disruption. Automated analysis
                          optimizes resource allocation, freeing teams to focus
                          on high‑impact initiatives rather than repetitive
                          tasks. Interactive dashboards supply metrics for
                          budget allocation, resource planning, and board‑level
                          risk discussions. Enhanced visibility into attack
                          surfaces supports proactive decision‑making and
                          strengthens stakeholder confidence in the
                          organization’s security posture. Moreover, advanced
                          analytics can uncover hidden dependencies and
                          configuration weaknesses before they escalate,
                          delivering a compelling return on investment and
                          demonstrating a commitment to operational resilience.
                        </p>

                        <p className="text-gray-700 leading-relaxed text-lg">
                          Successful adoption requires governance, ethical
                          oversight, and data privacy safeguards. Organizations
                          should establish review committees to validate AI
                          outputs, ensure transparent methodologies, and comply
                          with regulatory requirements. Training and
                          change‑management initiatives are essential to equip
                          security teams with the skills to interpret
                          AI‑generated insights and maintain accountability. In
                          summary, integrating AI into offensive security
                          represents a strategic evolution aligned with modern
                          enterprise risk management. By harnessing AI‑driven
                          analytics alongside seasoned testers, businesses can
                          achieve more efficient, accurate, and resilient
                          security assessments. We recommend launching targeted
                          pilot programs, defining clear success metrics, and
                          securing executive sponsorship for a phased rollout.
                          This proactive strategy will position security teams
                          to stay ahead of emerging threats and safeguard
                          critical assets in today’s complex cyber landscape.
                        </p>
                      </div>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/scope.png"
                          alt="The scope of AI-Augmented Penetration Testing"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 1: The scope of AI-Augmented Penetration
                            Testing for Offensive Security
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Introduction Section */}
                  <div id="introduction" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Introduction
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Organizations must continually refine their security
                        practices as cyberattacks grow in frequency and
                        technical sophistication. Traditional penetration
                        testing, where skilled analysts probe networks,
                        applications, and systems for known weaknesses, remains
                        a core component of any proactive security program. Yet
                        it depends heavily on manual effort, repeatable attack
                        templates, and sequential workflows. In today’s
                        environment, these methods can miss subtler or emerging
                        vulnerabilities and struggle to keep pace with agile,
                        automated threats.{" "}
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Artificial intelligence (AI) is reshaping the
                        cybersecurity landscape on two fronts [1], [2]. On
                        defense, AI drives faster threat detection, anomaly
                        analysis, and predictive modeling, helping teams
                        identify unusual patterns in large volumes of log and
                        network data [3]. On offense, malicious actors use AI to
                        generate polymorphic malware, orchestrate adaptive
                        phishing campaigns, and tailor exploits that evade
                        signature‑based defenses [4]–[6]. This dual‑use reality
                        highlights a critical blind spot: while defenders
                        increasingly rely on AI, their testing practices often
                        lag behind the speed and complexity of AI‑powered
                        attacks.{" "}
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        AI‑augmented penetration testing addresses the
                        limitations of traditional methods by integrating
                        intelligent algorithms across the entire testing
                        lifecycle, enhancing the proven value of human expertise
                        [2], [7]. Rather than simply automating scanners or
                        scripting predefined attack sequences, it applies
                        machine learning (ML) and advanced analytics to
                        streamline and strengthen key stages of testing. This
                        includes discovering assets and attack surfaces more
                        efficiently by correlating threat intelligence feeds,
                        asset inventories, and external data sources;
                        identifying unconventional vulnerabilities through
                        anomaly detection and pattern recognition that highlight
                        unexpected behaviors or misconfigurations [7];
                        simulating adaptive, multi-phase attacks using
                        reinforcement learning agents that adjust tactics in
                        real time [2], [8]; prioritizing findings based on data
                        sensitivity, exploit complexity, and business impact
                        rather than relying on static vulnerability counts [7];
                        and streamlining reporting through automated, actionable
                        dashboards that support remediation efforts and
                        continuously improve AI performance over time [7], [9].
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        The reason behind this shift is apparent: AI-powered
                        threats evolve quickly and adapt in ways that
                        traditional testing frameworks cannot emulate [2], [5].
                        By embedding AI into offensive security, organizations
                        gain scale and speed, conducting deeper assessments to
                        expedite and uncover chained or emerging vulnerabilities
                        before attackers can exploit them [7]. The objective
                        role of this is not to replace human testers, but to
                        equip them to effectively handle vulnerabilities [1],
                        [7]. Machine‑driven analysis handles repetitive,
                        data‑intensive tasks, freeing skilled professionals to
                        focus on creative exploit development, context‑aware
                        risk analysis, and strategic planning.
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/Enhancing.png"
                          alt="Enhancing Cybersecurity with AI"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 2: Enhancing Cybersecurity with AI
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Implementing AI‑augmented penetration testing introduces
                        new considerations around governance, ethics, and data
                        privacy [4], [10]. Teams must validate AI outputs,
                        maintain transparent model documentation, and ensure
                        compliance with relevant regulations. Clear oversight
                        structures, from technical review boards to
                        executive‑level governance, help strengthen
                        accountability and trust. Equally important is investing
                        in training and change management so analysts can
                        interpret AI findings, fine‑tune algorithms, and
                        integrate new workflows without disrupting core
                        operations [1], [7].
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        This report offers a practical, in‑depth examination of
                        AI‑augmented penetration testing. We begin by defining
                        its core concepts and principles [1], [7], then explore
                        its concrete benefits, including faster testing cycles,
                        richer insights, and prioritized remediation [7].
                        Ethical considerations, data‑privacy safeguards, and the
                        imperative of human‑machine collaboration are core
                        principles that must be maintained [4], [10]. We also
                        address the challenges and limitations inherent to
                        AI‑driven offense, from potential biases to model
                        accuracy [4], [11]–[13]. Next, we survey real‑world use
                        cases of existing AI‑powered tools [8], [9], [14]–[18],
                        present emerging trends [3], [5], and next‑generation
                        capabilities.
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        By the end of this whitepaper, security leaders,
                        stakeholders, and practitioners will have a clear
                        framework for adopting AI‑augmented penetration testing,
                        including understanding when and where to apply it, how
                        to govern it responsibly [4], [10], and how to measure
                        its impact. The strategic integration of AI into
                        offensive security is a critical step to stay ahead of
                        attackers, who already employ these technologies [5].
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/overview.png"
                          alt="An Overview of the Report Organization"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 3: An Overview of the Report Organization
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        The rest of this paper is organized as follows:
                      </p>

                      <ul className="space-y-4 mb-6">
                        <li className="flex items-start">
                          <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            1
                          </div>
                          <div>
                            <span className="font-semibold">
                              {" "}
                              Decoding AI-Augmented Penetration Testing:{" "}
                            </span>{" "}
                            Defines AI-augmented penetration testing and
                            outlines the core concepts and principles that
                            support the emerging field.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            2
                          </div>
                          <div>
                            <span className="font-semibold">
                              {" "}
                              The Promise of Intelligent Offense:{" "}
                            </span>{" "}
                            Explores the significant advantages that AI brings
                            to penetration testing, such as increased speed and
                            efficiency, improved accuracy, enhanced risk
                            prioritization, and scalability
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            3
                          </div>
                          <div>
                            <span className="font-semibold">
                              {" "}
                              Navigating the Labyrinth:{" "}
                            </span>{" "}
                            Examines the inherent challenges and limitations of
                            using AI in offensive security, including the
                            potential for inaccuracies, the lack of contextual
                            understanding, algorithmic biases, and ethical
                            concerns.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            4
                          </div>
                          <div>
                            <span className="font-semibold">
                              AI-Powered Tools and Techniques in Practice:
                            </span>{" "}
                            Covers current AI tools and techniques used in
                            penetration testing, highlighting their capabilities
                            and use cases.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            5
                          </div>
                          <div>
                            <span className="font-semibold">
                              Roadmap Ahead:
                            </span>{" "}
                            Explores the potential future trajectory of AI in
                            penetration testing, discussing emerging trends,
                            potential advancements, and their implications for
                            cybersecurity.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            6
                          </div>
                          <div>
                            <span className="font-semibold">Conclusion:</span>{" "}
                            Summarizes key insights from the report,
                            highlighting the potential of AI-augmented
                            penetration testing and the need to address its
                            challenges and limitations.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Decoding AI-Augmented Penetration Testing */}
                  <div id="decoding" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <LockKeyhole className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Decoding AI-Augmented Penetration Testing
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        A clear understanding of AI-augmented penetration
                        testing begins with how the field is defined in current
                        research [2], [7]. At its core, this approach identifies
                        security vulnerabilities in machine learning–driven
                        systems and develops defenses against increasingly
                        advanced, automated attacks [2]. Unlike traditional
                        penetration testing, which targets conventional
                        software, this discipline addresses the distinct risks
                        introduced by AI, requiring both cybersecurity expertise
                        and a working knowledge of data-driven models [7]. The
                        process goes beyond detecting current weaknesses, aiming
                        to anticipate future attack strategies as intelligent
                        systems evolve. As these technologies become more
                        embedded in business operations and critical
                        infrastructure, the consequences of a security failure —
                        including data breaches, service disruptions, and
                        unauthorized access — grow more severe. The primary goal
                        of penetration testing in this context is to uncover and
                        address risks before they are exploited [2]. This
                        approach also marks a shift in how security assessments
                        are conducted, as artificial intelligence is not only a
                        target but increasingly a tool for improving the testing
                        process itself [2], [7]. Automated systems can
                        accelerate vulnerability discovery, exploit development,
                        and reporting, enhancing speed and consistency across AI
                        and non-AI targets [7]. Offloading repetitive tasks
                        allows human testers to focus on higher-level analysis
                        and strategy, resulting in a more efficient and thorough
                        assessment process [1], [7].
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/comparison.png"
                          alt="Comparison of AI-Augmented Penetration with Traditional Approach"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 4: Comparison of AI-Augmented Penetration
                            with Traditional Approach
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        Testing the security of AI systems presents challenges
                        that differ from traditional application security, as
                        penetration testers must account for the complexity of
                        ML models, the dynamic nature of their learning
                        processes, and the specific ways these systems handle,
                        process, and store data [7]. This work requires
                        cybersecurity expertise and a solid understanding of AI
                        architectures, algorithms, and potential failure modes
                        [7]. Because AI models continuously adapt to new inputs,
                        static testing methods designed for conventional
                        software are often insufficient for uncovering
                        vulnerabilities in these systems. In addition to being a
                        target, AI enhances penetration testing by efficiently
                        processing and analyzing large volumes of data [7]. AI
                        can identify patterns, anomalies, and correlations that
                        are difficult for human analysts to detect, especially
                        within the limited timeframes typical of security
                        assessments [2], [7]. This added depth allows
                        penetration testers to reveal hidden vulnerabilities and
                        attack paths that manual techniques might miss, offering
                        a more thorough understanding of a system’s security
                        posture.
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        AI-driven tools simulate realistic attack scenarios,
                        replicating real-world tactics, techniques, and
                        procedures, including those targeting AI systems, to
                        help identify defensive gaps and refine mitigation
                        strategies [2]. ML also supports adaptive testing,
                        adjusting strategies based on previous test results and
                        the real-time behavior of target environments, enhancing
                        the detection of new or overlooked vulnerabilities [7].
                        Additionally, AI excels at processing external threat
                        intelligence, enabling testers to incorporate real-time
                        data on emerging vulnerabilities like prompt injection,
                        data poisoning, and model inversion [2], [11], [12].
                        This ensures testing remains aligned with the latest
                        threats. AI also provides context-aware feedback during
                        testing, helping testers assess vulnerabilities
                        concerning the specific system, prioritize risks, and
                        focus remediation efforts [7]. Furthermore, AI reduces
                        false positives by filtering out inaccurate or redundant
                        reports, allowing security teams to concentrate on
                        actual threats and improving testing reliability [7].
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/process.png"
                          alt="AI-Augmented Penetration Testing Process"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 5: AI-Augmented Penetration Testing Process
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        While AI enhances penetration testing, human expertise
                        remains crucial [1], [7]. AI cannot fully grasp the
                        context in which systems operate, and its
                        recommendations still need validation by skilled
                        professionals [7], [13], [13]. Human testers are vital
                        for creating strategies, assessing risks, and responding
                        to complex challenges [1]. AI-augmented penetration
                        testing is still evolving, as the field matures
                        alongside rapid advancements in cybersecurity and AI.
                        The absence of a universally accepted definition
                        reflects its early development [2]. However, a common
                        theme is the hybrid model, combining AI’s automation,
                        speed, and analytical power with human testers' critical
                        thinking and strategic judgment [1], [7]. This approach
                        enables organizations to tackle the evolving challenges
                        of modern cybersecurity more effectively and flexibly.
                      </p>
                    </div>
                  </div>

                  {/* The Promise of Intelligent Offense */}
                  <div id="promise" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <Cpu className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        The Promise of Intelligent Offense
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        AI offers great potential in penetration testing,
                        significantly enhancing speed, efficiency, and accuracy
                        in security assessments [7]. AI algorithms can process
                        vast amounts of data at extraordinary speeds, allowing
                        penetration testers to quickly identify vulnerabilities,
                        thus reducing the time needed for comprehensive testing
                        [7]. Automating repetitive tasks such as reconnaissance,
                        vulnerability scanning, and initial analysis frees human
                        testers to focus on more complex and strategic aspects
                        of the assessment [1], [7]. By accelerating the early
                        stages of testing, AI enables faster identification of
                        vulnerabilities and quicker responses to security
                        weaknesses, enhancing overall efficiency [7], [13],
                        [13].
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/benefits.png"
                          alt="AI in Penetration Testing: Benefits and Applications"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 6: AI in Penetration Testing: Benefits and
                            Applications.
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        In addition to enhancing speed, AI improves the accuracy
                        and depth of vulnerability detection by providing a more
                        thorough analysis than traditional methods, which may
                        overlook complex vulnerabilities in systems and
                        applications [7]. Through advanced algorithms,
                        AI-powered tools excel at identifying elusive threats
                        like zero-day vulnerabilities and advanced persistent
                        threats (APTs), which require nuanced examination [7].
                        Many AI-driven tools feature adaptive learning, enabling
                        continuous testing to identify emerging attack vectors
                        in response to changing environments, discovering
                        vulnerabilities that static models might miss [9].
                        Furthermore, AI strengthens risk prioritization by
                        assessing vulnerabilities' potential impact and
                        exploitability, using machine learning to prioritize
                        risks based on their threat to an organization’s overall
                        security posture [9]. This allows penetration testers to
                        focus on the most critical weaknesses first, ensuring
                        effective allocation of security resources. At the same
                        time, AI tools can also predict the likelihood of a
                        vulnerability being exploited, providing deeper insights
                        for remediation [7].
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Scalability is a key advantage AI brings to penetration
                        testing, especially as organizations expand their IT
                        environments with large networks and cloud
                        infrastructures, which make testing more complex [7]. AI
                        tools are designed to manage vast, interconnected
                        systems, enabling continuous testing rather than
                        periodic assessments, allowing for real-time
                        vulnerability detection and faster remediation, thereby
                        reducing attackers' opportunities [3], [9], [16].
                        Autonomous AI systems provide 24/7 active security
                        assessments, ensuring constant vigilance and quick
                        response to emerging threats [3], [16]. AI also enhances
                        threat intelligence by analyzing diverse data sources to
                        identify patterns and predict potential attack vectors,
                        allowing it to create more realistic and adaptive attack
                        simulations that reflect actual threat actors' tactics
                        [5]. These simulations can replicate sophisticated
                        attacks like adversarial attacks and data poisoning,
                        which target AI systems, providing valuable insights
                        into an organization’s defenses against AI-driven
                        threats [11], [12]. Furthermore, AI strengthens
                        adversary emulation exercises by replicating complex
                        attack strategies, helping organizations better
                        understand their resilience against real-world threats
                        [9].
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        AI also helps reduce false positives, a common challenge
                        in traditional penetration testing. By learning from
                        past assessments, AI-powered tools improve their
                        detection methods, ensuring only legitimate
                        vulnerabilities are flagged, which reduces alert fatigue
                        and allows security teams to focus on critical issues
                        rather than non-relevant findings [7], [9].
                        Additionally, AI generates structured, detailed, and
                        actionable reports, offering tailored insights and
                        recommendations specific to an organization's security
                        infrastructure.. Although the initial investment in
                        AI-powered tools and the expertise required to implement
                        them can be substantial, the long-term cost savings are
                        significant. AI automates many labor-intensive tasks,
                        reducing the reliance on manual testing and making it
                        possible to conduct more frequent assessments within the
                        same budget. This increased efficiency, with improved
                        accuracy, scalability, and cost-effectiveness, makes AI
                        a valuable addition to any organization's cybersecurity
                        strategy, delivering long-term value by saving time and
                        resources while enhancing overall security defenses.
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/cycle.png"
                          alt="AI-Driven Penetration Testing Cycle"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 7: AI-Driven Penetration Testing Cycle.
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Finally, AI offers substantial benefits in penetration
                        testing, including faster testing, improved detection
                        accuracy, more thoughtful risk prioritization, and
                        scalable solutions for complex environments [7]. It
                        enhances threat intelligence, simulates advanced attack
                        techniques, and reduces false positives, contributing to
                        more effective and efficient security assessments. While
                        the initial investment can be high, the potential cost
                        savings and improved security posture make AI-powered
                        penetration testing an essential tool for organizations
                        aiming to stay ahead of evolving cyber threats.
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Despite its transformative potential, integrating AI
                        into offensive security brings several critical
                        challenges and limitations that organizations must
                        address before widespread adoption [4], [10]. A
                        fundamental concern is the reliability of AI-driven
                        tools, which can produce inaccurate or even fabricated
                        results. Language models with memory and search (LLMs),
                        increasingly deployed in AI-augmented testing, are prone
                        to “hallucinations”, generating plausible-sounding but
                        incorrect information [13]. More generally, automated
                        tools may yield false positives, in which benign
                        behaviors are flagged as vulnerabilities, and false
                        negatives, where genuine security flaws go undetected.
                        False positives waste precious time and resources as
                        security teams chase phantom issues. In contrast, false
                        negatives leave critical weaknesses unaddressed,
                        undermining trust in the testing process and potentially
                        exposing organizations to undetected threats [13].
                      </p>
                    </div>
                  </div>

                  {/* Navigating the Labyrinth */}
                  <div id="navigating" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Navigating the Labyrinth:
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Another significant limitation is AI’s lack of nuanced
                        contextual understanding [13], [15]. While ML models
                        excel at pattern recognition and data processing, they
                        struggle to grasp the complex business logic and
                        operational context that form the backbone of many
                        real-world applications. AI tools may identify syntactic
                        or low-level issues in code or network traffic but fail
                        to recognize vulnerabilities stemming from flawed
                        workflows, misconfigurations, or unique proprietary
                        systems. As a result, human penetration testers remain
                        vital for interpreting AI-generated findings, validating
                        their relevance, and conducting deep-dive analyses in
                        complex or novel scenarios. Expert testers apply
                        creative problem-solving and strategic judgment,
                        abilities that AI, in its current state, cannot
                        replicate to prioritize remediation and tailor solutions
                        to an organization’s specific environment [15].
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Algorithmic bias presents another challenge as AI models
                        trained on skewed or incomplete datasets can distort
                        testing results, leading to overlooked vulnerabilities
                        or excessive false alarms [4], [12]. For example,
                        underrepresented technologies in training data might
                        cause AI tools to miss critical issues, while familiar
                        patterns could trigger unnecessary alerts. In LLM-based
                        tools, this bias might favor certain vulnerability
                        classes or discriminate against specific platforms or
                        architectures [13], [15]. Addressing these risks
                        requires well-curated data, regular model audits, and
                        diverse, up-to-date threat intelligence to ensure fair
                        and comprehensive coverage [4].
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/limitations.png"
                          alt="Challenges and Limitations of AI in Offensive Security"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 8: Challenges and Limitations of AI in
                            Offensive Security.
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Developing, acquiring, and deploying AI-powered
                        penetration testing tools requires significant financial
                        and organizational investment. Custom models demand
                        expert engineering and time, while commercial solutions
                        can be expensive, and open-source tools require skilled
                        in-house teams for setup and tuning. These costs often
                        put advanced AI tools out of reach for smaller
                        organizations, leaving them dependent on manual testing.
                        Moreover, using AI tools effectively demands specialists
                        with expertise in cybersecurity and artificial
                        intelligence, a skill set that is often scarce, adding
                        another layer of complexity to adoption and
                        implementation.
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Ethical and governance challenges are central to the
                        adoption of AI in offensive security, as the same
                        technologies designed to strengthen defenses can just as
                        easily be repurposed for malicious use [10]. Autonomous
                        AI systems capable of probing networks and identifying
                        vulnerabilities risk falling into the wrong hands,
                        enabling cybercriminals to launch highly automated and
                        adaptive attacks [5], [16]. Adversaries are already
                        using AI to craft convincing deepfakes, create malware
                        that can evade detection, and manipulate the training
                        data of defensive models through poisoning or
                        adversarial inputs [6], [11], [12]. This dual-use
                        dilemma blurs the line between ethical hacking and
                        cybercrime, highlighting the need for clear policy
                        guidelines, strong ethical frameworks, and strict access
                        controls to prevent misuse [10]. At the same time, the
                        evolving nature of adversarial AI requires constant
                        monitoring, regular retraining, and the deployment of
                        defensive strategies capable of countering AI-driven
                        attack techniques [6], [11]. Without continuous human
                        oversight and rigorous safeguards, AI-powered security
                        tools risk becoming liabilities rather than assets in
                        the ongoing arms race against increasingly sophisticated
                        attackers [10].
                      </p>

                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        Given these challenges, AI in offensive security is best
                        understood as an augmentation tool rather than a
                        replacement for human expertise. The risks of inaccurate
                        outputs [13], contextual blind spots, algorithmic bias
                        [11], [12], high costs, ethical dilemmas [4], [10], and
                        adversarial manipulation [11], [12] all underscore the
                        irreplaceable value of skilled human testers.
                        Professionals bring the critical thinking, creativity,
                        and domain knowledge needed to validate AI findings,
                        assess their real-world significance, and craft
                        effective remediation strategies. While AI excels at
                        automating repetitive tasks, analyzing large data sets,
                        and flagging potential issues at scale, it lacks the
                        nuanced understanding and adaptive reasoning required to
                        navigate complex and evolving security environments
                        [13], [15]. Ultimately, a hybrid model that blends AI’s
                        computational power with human insight offers the most
                        resilient and responsible approach to penetration
                        testing [10]. Organizations looking to adopt AI must
                        confront its limitations head-on through thoughtful tool
                        selection, ethical governance [4], and continuous human
                        oversight, ensuring that these powerful technologies
                        strengthen, not compromise, their security posture in an
                        increasingly dynamic threat landscape.
                      </p>
                    </div>
                  </div>

                  {/* AI-Powered Tools and Techniques */}
                  <div id="tools" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <Database className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        AI-Powered Tools and Techniques in Practice
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        The field of AI‑augmented penetration testing has
                        rapidly expanded to include a rich ecosystem of
                        specialized tools that automate and enhance nearly every
                        security assessment phase. Among open‑source offerings,
                        Nebula is an AI‑driven assistant that translates
                        natural‑language commands into actions for established
                        hacking frameworks, automating reconnaissance,
                        note‑taking, and vulnerability analysis [1]. DeepExploit
                        uses reinforcement learning to master the exploitation
                        phase, iteratively improving its attack strategies
                        against identified weaknesses [8]. PentestGPT, built on
                        GPT-4, guides testers through complex scenarios and can
                        even solve intermediate security puzzles, demonstrating
                        the reasoning power of large language models [15].
                        Meanwhile, the NSA’s Autonomous Penetration Testing
                        (APT) platform, launched in 2024, shows the growing
                        strategic importance of AI in cyber defense by offering
                        organizations a way to continuously and autonomously
                        probe their networks [16].
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        Commercial platforms are similarly advancing the state
                        of the art. Astra Pentest provides ongoing vulnerability
                        scanning that mimics real‑world attacker behavior across
                        diverse environments [9], [17]. At the same time, Workik
                        AI integrates with tools like Metasploit and Burp Suite
                        to streamline security audits, threat analysis, and risk
                        mitigation. PlexTrac focuses on reporting and
                        threat‑exposure management, turning raw test data into
                        structured insights that help teams prioritize
                        remediations. Skanda from CISO Global combines AI and
                        machine learning for on‑demand security assessments, and
                        FireCompass leverages an “agentic AI” model to perform
                        continuous red‑teaming and attack‑surface management.
                        AI‑exploits (from Protect AI) offers a curated
                        repository of real‑world attacks against AI frameworks,
                        educating testers on vulnerabilities unique to
                        machine‑learning infrastructures.
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        In addition, a growing roster of tools applies AI to
                        niche offensive‑security tasks. HackerGPT (WhiteHack
                        Labs) uses a blend of ReAct and retrieval‑augmented
                        generation to identify and exploit application flaws
                        autonomously. IBM Watson for Cybersecurity harnesses NLP
                        to sift through vast threat‑intelligence feeds, aiding
                        detection and prevention. PassGAN uses GANs to generate
                        realistic password lists, outperforming brute‑force and
                        dictionary attacks in many scenarios [18]. Other
                        noteworthy solutions include SentinelAI, PhishBrain,
                        CipherCore, DarkTrace Antigena, VulnGPT, ZeroDay
                        Sentinel, HackRay, and Cortex XDR for activities ranging
                        from social‑engineering simulations [6], [19] to
                        cryptographic analysis. Tools like ImmuniWeb AI Pentest,
                        Pentera, Cybereason AI Hunting Engine, Recon‑NG, Burp
                        Suite AI Edition, Maltego AI, and XploitGPT further
                        illustrate the breadth of AI’s integration, covering
                        vulnerability hunting, adversary emulation,
                        reconnaissance, and code analysis.
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        Underpinning these tools is a suite of machine‑learning
                        techniques tailored to offensive security. Supervised
                        and unsupervised learning models analyze historical and
                        real‑time data, flagging anomalous network traffic,
                        system behavior, and code patterns that might indicate
                        vulnerabilities [7]. NLP enables AI to process and
                        summarize large volumes of text‑based inputs—security
                        logs, threat reports, and source code comments—and even
                        draft human‑readable findings [15]. Deep learning
                        architectures extend these capabilities, detecting
                        sophisticated, previously unseen threats by modeling
                        complex relationships within multidimensional datasets
                        and, in some cases, automating exploit generation
                        against identified weaknesses [8], [18].
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        Generative Adversarial Networks (GANs) have opened new
                        frontiers in password‑guessing and payload generation.
                        Beyond PassGAN’s password lists [18], GANs can
                        synthesize evasive malware variants and phishing content
                        that better mimic legitimate traffic, challenging
                        conventional signature‑based defenses. As DeepExploit
                        and SentinelAI demonstrate, reinforcement learning
                        frames penetration testing as a dynamic game: tools
                        learn optimal attack paths through reward‑based
                        feedback, adapting to defensive countermeasures in real
                        time [8]. Adversarial machine learning further stresses
                        AI models themselves by crafting inputs designed to
                        mislead or corrupt them, exposing blind spots in
                        semantic understanding and model robustness [11], [12].
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        Fuzzing, a long‑standing technique of feeding malformed
                        or random data to software, has also been revolutionized
                        by AI [5], [20]. Instead of purely random inputs,
                        intelligent fuzzers use learned models to target code
                        paths most likely to harbor vulnerabilities,
                        dramatically improving efficiency [20]. Looking ahead,
                        autonomous AI agents powered by LLMs promise to
                        orchestrate entire testing campaigns: they will plan
                        tasks, invoke diverse tools, parse results, and interact
                        with their environments to discover and exploit
                        weaknesses—all with minimal human intervention [5],
                        [20].
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        This rapidly evolving landscape of AI‑powered tools,
                        ranging from community‑driven open‑source projects [1]
                        to enterprise‑grade commercial platforms [9], [17],
                        highlights both the ingenuity of the security community
                        and the urgency of emerging threats. As these solutions
                        mature, organizations must carefully evaluate which
                        tools align with their risk profiles, integration
                        requirements, and resource constraints. By pairing these
                        automated capabilities with skilled human oversight,
                        validating findings, guiding strategic decisions, and
                        contextualizing results, security teams can harness AI’s
                        full potential to deliver continuous, comprehensive, and
                        adaptive penetration testing in an era of
                        ever-increasing complexity.
                      </p>
                    </div>
                  </div>

                  {/* Roadmap Ahead */}
                  <div id="roadmap" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <RefreshCw className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Roadmap Ahead
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        The field of AI‑augmented penetration testing is set to
                        evolve rapidly as both AI capabilities and cyber threats
                        advance in complexity[3], [5]. One of the most striking
                        developments will be the rise of truly autonomous
                        testing platforms [3], [16]. Rather than relying on
                        scripted playbooks or human‑driven orchestration,
                        next‑generation tools will leverage sophisticated
                        decision‑making algorithms to plan, execute, and
                        validate comprehensive security assessments with minimal
                        human oversight. These platforms will continuously adapt
                        their strategies, probing for novel weak points,
                        validating exploits in real time, and dynamically
                        refining their approach based on measured outcomes [3].
                        By shouldering the bulk of repetitive tasks and initial
                        exploit validation, autonomous systems will free
                        security teams to focus on strategic planning and
                        remediation, while enabling organizations to run
                        frequent, large‑scale assessments across diverse
                        environments [16].
                      </p>

                      <p className="text-gray-700 leading-relaxed mt-8 text-lg">
                        A second key trend will be the tighter integration of AI
                        with complementary technologies, most notably
                        blockchain, cloud, and IoT [16]. In decentralized
                        systems, for example, AI can monitor immutable ledgers
                        for anomalous transaction patterns or smart‑contract
                        vulnerabilities, automatically flagging inconsistencies
                        that human auditors might miss. Within cloud
                        environments, AI agents will sift through vast telemetry
                        streams, correlating network flows, configuration drift,
                        and access logs to uncover stealthy attack paths. And as
                        IoT deployments balloon, machine‑learning models will
                        become essential for parsing the torrent of
                        device‑generated data, identifying compromised endpoints
                        or firmware flaws long before they can be weaponized. By
                        marrying AI’s analytical throughput with the unique
                        properties of each platform, security teams will gain
                        deeper, more context‑rich insights into their evolving
                        threat surface.
                      </p>

                      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="/whitepaperImage/roadmap.png"
                          alt="Road Map of AI-Augmented Penetration Testing"
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm italic">
                            Figure 9: Road Map of AI-Augmented Penetration
                            Testing.
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mt-8 text-lg">
                        Social engineering simulations will also see a step
                        change in authenticity and efficacy [6], [19]. Today’s
                        tools can craft generic phishing templates. Still,
                        tomorrow’s AI engines will analyze individual behaviors,
                        preferences, and communication histories to generate
                        highly tailored attack vectors. This includes everything
                        from spoofed email exchanges mimicking a colleague’s
                        writing style to convincing voice‑synthesized vishing
                        calls [6]. These simulations will stress-test technical
                        controls and probe organizational culture and human
                        decision‑making. By delivering hyper‑personalized
                        scenarios, AI will expose subtle gaps in user awareness
                        programs and help drive targeted training interventions
                        that significantly reduce an organization’s “human
                        attack surface”.
                      </p>

                      <p className="text-gray-700 leading-relaxed mt-8 text-lg">
                        As AI grows more prolific in every facet of IT, there is
                        an equally urgent need to subject AI models to rigorous
                        security scrutiny [2], [11], [12]. Future AI‑centric
                        testing tools will specialize in probing
                        machine‑learning pipelines for prompt‑injection flaws,
                        data‑poisoning vectors, model‑inversion risks, and
                        backdoor insertion attacks. Advanced algorithms will
                        emulate adversarial tactics, subtly perturbing inputs to
                        measure a model’s robustness, or reverse-engineering
                        gradients to reveal sensitive training data. By treating
                        AI systems as first‑class targets, rather than opaque
                        black boxes, security engineers can harden these models
                        against the threats they were once powerless to detect.
                      </p>

                      <p className="text-gray-700 leading-relaxed mt-8 text-lg">
                        Finally, the real‑time detection of zero‑day exploits
                        and the deepening collaboration between AI and human
                        experts will define the field’s maturation [3]. AI’s
                        ability to ingest and correlate massive volumes of
                        telemetry means it can spot the earliest deviations from
                        baseline behavior, potentially flagging an unknown
                        exploit within minutes of its first deployment. Yet, the
                        full promise of AI will only be realized through a
                        hybrid model: machine‑driven analysis accelerating
                        initial triage, followed by human investigation to
                        interpret high‑risk anomalies and craft resilient
                        remediation plans [10]. Seamless interfaces—AI
                        assistants that annotate findings, suggest hypotheses,
                        and guide manual testing—will blur the lines between
                        automated and expert‑led workflows [1]. In this
                        symbiosis, organizations will gain both the scale
                        afforded by AI and the strategic insight provided by
                        seasoned professionals, ensuring that as threats become
                        more sophisticated, defenses grow even more agile.
                      </p>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div id="conclusion" className="scroll-mt-24 mb-12">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Conclusion
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        AI‑augmented penetration testing marks a pivotal shift
                        in cybersecurity by combining the raw computational
                        power of ML with the strategic insight of experienced
                        testers. These tools automate repetitive tasks,
                        scanning, data analysis, and report generation, while
                        uncovering complex vulnerabilities and simulating
                        sophisticated attack scenarios at a speed and scale that
                        manual methods cannot match. By continuously processing
                        vast telemetry streams, intelligently prioritizing
                        risks, and adapting their strategies in real time,
                        AI‑driven platforms enable organizations to conduct more
                        frequent and comprehensive assessments. The result is a
                        sharper, more proactive security posture: critical
                        weaknesses are identified and remediated before
                        adversaries can exploit them, and human testers can
                        focus their creativity and expertise on the
                        highest‑value tasks.
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        TAt the same time, integrating AI into offensive
                        security introduces new considerations. Automated tools
                        can produce false positives and negatives, misinterpret
                        nuanced business logic, and perpetuate biases inherited
                        from their training data. Ethical and governance issues,
                        ranging from dual-use risk to adversarial manipulation,
                        demand clear policies and rigorous oversight. Moreover,
                        developing, deploying, and maintaining sophisticated AI
                        systems requires significant investment and specialized
                        skills, underscoring the importance of human‑machine
                        collaboration rather than wholesale automation.
                      </p>

                      <p className="text-gray-700 leading-relaxed text-lg">
                        Looking ahead, the future of AI‑augmented penetration
                        testing lies in truly autonomous platforms that
                        dynamically adapt their approaches, the fusion of AI
                        with emerging technologies like IoT and blockchain, and
                        the advancement of self‑testing frameworks that probe AI
                        models for data‑poisoning, prompt‑injection, and other
                        AI‑specific attacks. Most importantly, a hybrid model,
                        where AI accelerates routine discovery and humans
                        exercise judgment, context, and ethical consideration,
                        will remain the gold standard. By embracing AI’s
                        capabilities while acknowledging its limits, security
                        teams can build a resilient, adaptive defense strategy
                        that stays one step ahead of ever‑evolving cyber
                        threats.
                      </p>
                    </div>
                  </div>

                  {/* Bibliography Section */}
                  <div id="bibliography" className="scroll-mt-24 mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Bibliography
                      </h2>
                    </div>

                    <div className="pl-0 md:pl-16">
                      <div className="space-y-4 text-sm text-gray-700">
                        <p className="pl-8 indent-hanging">
                          [1] "AI-Powered Penetration Testing: Nebula in Focus
                          and How It Stacks Up Against the Rest," Beryllium.
                          Accessed: Apr. 23, 2025. [Online]. Available:{" "}
                          <a
                            href="https://www.berylliumsec.com/blog/ai-powered-penetration-testing"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.berylliumsec.com/blog/ai-powered-penetration-testing
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [2] "AI Penetration Testing: Navigating the New
                          Frontier." Accessed: Apr. 23, 2025. [Online].
                          Available:{" "}
                          <a
                            href="https://www.cybernx.com/ai-penetration-testing-navigating-the-new-frontier/"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.cybernx.com/ai-penetration-testing-navigating-the-new-frontier/
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [3] C. R. Team, "The Future of AI Data Security:
                          Trends to Watch in 2025," CyberProof. Accessed: Apr.
                          23, 2025. [Online]. Available:{" "}
                          <a
                            href="https://www.cyberproof.com/blog/the-future-of-ai-data-security-trends-to-watch-in-2025/"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.cyberproof.com/blog/the-future-of-ai-data-security-trends-to-watch-in-2025/
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [4] "Ethical Challenges in AI- Safeguard Privacy &
                          Managing Offensive Security," RSA Conference.
                          Accessed: Apr. 23, 2025. [Online]. Available:{" "}
                          <a
                            href="http://www.rsaconference.com/library/blog/ethical-challenges-in-ai-safeguard-privacy-managing-offensive-security"
                            className="text-indrasol-blue hover:underline"
                          >
                            http://www.rsaconference.com/library/blog/ethical-challenges-in-ai-safeguard-privacy-managing-offensive-security
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [5] F. Cyber, "How will AI change Cyber Operations |
                          Fusion Cyber News." Accessed: Apr. 23, 2025. [Online].
                          Available:{" "}
                          <a
                            href="https://www.fusioncyber.co/news-feed/ai-impact-cyber-operations"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.fusioncyber.co/news-feed/ai-impact-cyber-operations
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [6] K. Labs, "How Hackers Use Agentic AI for Social
                          Engineering & Phishing - Keepnet," Keepnet Labs.
                          Accessed: Apr. 23, 2025. [Online]. Available:{" "}
                          <a
                            href="https://keepnetlabs.com/blog/how-hackers-use-agentic-ai-to-advance-social-engineering"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://keepnetlabs.com/blog/how-hackers-use-agentic-ai-to-advance-social-engineering
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [7] "Introducing AI Penetration Testing | @Bugcrowd."
                          Accessed: Apr. 23, 2025. [Online]. Available:{" "}
                          <a
                            href="https://www.bugcrowd.com/blog/introducing-ai-penetration-testing/"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.bugcrowd.com/blog/introducing-ai-penetration-testing/
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [8] A. AlMajali, L. Al-Abed, K. M. Ahmad Yousef, B. J.
                          Mohd, Z. Samamah, and A. Abu Shhadeh, "Automated
                          Vulnerability Exploitation Using Deep Reinforcement
                          Learning," Appl. Sci., vol. 14, no. 20, Art. no. 20,
                          Jan. 2024, doi: 10.3390/app14209331.
                        </p>

                        <p className="pl-8 indent-hanging">
                          [9] "Unbiased Astra Pentest Review: Features, Pricing
                          & Flaws." Accessed: Apr. 23, 2025. [Online].
                          Available:{" "}
                          <a
                            href="https://www.uprootsecurity.com/blog/astra-pentest-review"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.uprootsecurity.com/blog/astra-pentest-review
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [10] C. Owen-Jackson, "Navigating the ethics of AI in
                          cybersecurity | IBM." Accessed: Apr. 23, 2025.
                          [Online]. Available:{" "}
                          <a
                            href="https://www.ibm.com/think/insights/navigating-ethics-ai-cybersecurity"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.ibm.com/think/insights/navigating-ethics-ai-cybersecurity
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [11] T. Thomas, A. P. Vijayaraghavan, and S. Emmanuel,
                          "Adversarial Machine Learning in Cybersecurity," in
                          Machine Learning Approaches in Cyber Security
                          Analytics, T. Thomas, A. P. Vijayaraghavan, and S.
                          Emmanuel, Eds., Singapore: Springer, 2020, pp.
                          185–200. doi: 10.1007/978-981-15-1706-8_10.
                        </p>

                        <p className="pl-8 indent-hanging">
                          [12] I. Rosenberg, A. Shabtai, Y. Elovici, and L.
                          Rokach, "Adversarial Machine Learning Attacks and
                          Defense Methods in the Cyber Security Domain," ACM
                          Comput. Surv., vol. 54, no. 5, pp. 1–36, Jun. 2022,
                          doi: 10.1145/3453158.
                        </p>

                        <p className="pl-8 indent-hanging">
                          [13] G. Jennifer, "AI hallucinations can pose a risk
                          to your cybersecurity | IBM." Accessed: Apr. 23, 2025.
                          [Online]. Available:{" "}
                          <a
                            href="https://www.ibm.com/think/insights/ai-hallucinations-pose-risk-cybersecurity"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.ibm.com/think/insights/ai-hallucinations-pose-risk-cybersecurity
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [14] berylliumsec/nebula. (Apr. 24, 2025). Python.
                          berylliumsec. Accessed: Apr. 23, 2025. [Online].
                          Available:{" "}
                          <a
                            href="https://github.com/berylliumsec/nebula"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://github.com/berylliumsec/nebula
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [15] A. L. Martínez, A. Cano, and A. Ruiz-Martínez,
                          "Generative Artificial Intelligence-Supported
                          Pentesting: A Comparison between Claude Opus, GPT-4,
                          and Copilot," Jan. 12, 2025, arXiv: arXiv:2501.06963.
                          doi: 10.48550/arXiv.2501.06963.
                        </p>

                        <p className="pl-8 indent-hanging">
                          [16] "NSA CAPT Program for DIB Suppliers,"
                          Horizon3.ai. Accessed: Apr. 23, 2025. [Online].
                          Available:{" "}
                          <a
                            href="https://horizon3.ai/nsa-capt-program-for-dib-suppliers/"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://horizon3.ai/nsa-capt-program-for-dib-suppliers/
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [17] "Astra Security Raises Funding to Simplify
                          Cybersecurity With AI-Driven Pentesting." Accessed:
                          Apr. 23, 2025. [Online]. Available:{" "}
                          <a
                            href="https://www.businesswire.com/news/home/20250205502953/en/Astra-Security-Raises-Funding-to-Simplify-Cybersecurity-With-AI-Driven-Pentesting"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.businesswire.com/news/home/20250205502953/en/Astra-Security-Raises-Funding-to-Simplify-Cybersecurity-With-AI-Driven-Pentesting
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [18] B. Hitaj, P. Gasti, G. Ateniese, and F.
                          Perez-Cruz, "PassGAN: A Deep Learning Approach for
                          Password Guessing," Feb. 14, 2019, arXiv:
                          arXiv:1709.00440. doi: 10.48550/arXiv.1709.00440.
                        </p>

                        <p className="pl-8 indent-hanging">
                          [19] Arsen, "Arsen Introduces AI-Powered Phishing
                          Tests to Improve Social Engineering Resilience,"
                          GlobeNewswire News Room. Accessed: Apr. 23, 2025.
                          [Online]. Available:{" "}
                          <a
                            href="https://www.globenewswire.com/news-release/2025/03/24/3047714/0/en/Arsen-Introduces-AI-Powered-Phishing-Tests-to-Improve-Social-Engineering-Resilience.html"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.globenewswire.com/news-release/2025/03/24/3047714/0/en/Arsen-Introduces-AI-Powered-Phishing-Tests-to-Improve-Social-Engineering-Resilience.html
                          </a>
                        </p>

                        <p className="pl-8 indent-hanging">
                          [20] "What Is Fuzz Testing and How Does It Work? |
                          Black Duck." Accessed: Apr. 23, 2025. [Online].
                          Available:{" "}
                          <a
                            href="https://www.blackduck.com/glossary/what-is-fuzz-testing.html"
                            className="text-indrasol-blue hover:underline"
                          >
                            https://www.blackduck.com/glossary/what-is-fuzz-testing.html
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact us section */}
                  <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 rounded-xl p-8 shadow-xl mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                      <div className="md:col-span-3 space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                          Need more information?
                        </h3>
                        <p className="text-white/90">
                          Our team of AI security experts can provide custom
                          guidance on implementing AI-augmented penetration
                          testing in your organization. Contact us today to
                          schedule a consultation.
                        </p>
                      </div>
                      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                        <Link
                          to="/contact"
                          className="px-6 py-3 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium flex-1 text-center shadow-lg"
                        >
                          Request a Consultation
                        </Link>

                        <Link
                          to="/Resources/whitepaper"
                          className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium flex-1 text-center"
                        >
                          Explore Resources
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4 order-1 lg:order-2">
              {/* Author Information Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 p-4">
                  <h3 className="text-white font-bold text-lg">
                    White Paper Details
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-indrasol-blue/20 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-indrasol-blue" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Authors</div>
                      <div className="font-medium text-indrasol-blue">
                        {whitepaper.authors}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 border-t border-gray-100 pt-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Published
                        </div>
                        <div className="text-gray-600">
                          {whitepaper.publishDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Reading Time
                        </div>
                        <div className="text-gray-600">
                          {whitepaper.readTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookmarkIcon className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Category
                        </div>
                        <div className="text-gray-600">Security Research</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table of Contents Card - Desktop */}
              <div
                id="toc-container"
                className={`hidden lg:block sticky top-4 transition-all duration-300 ${
                  isTocSticky ? "bg-white rounded-2xl shadow-md" : ""
                }`}
              >
                <div
                  className={`p-6 ${
                    isTocSticky ? "" : "bg-white rounded-2xl shadow-md"
                  }`}
                >
                  <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`flex items-center py-2 px-3 rounded-lg text-sm transition-colors ${
                          activeSection === item.id
                            ? "bg-indrasol-blue text-white font-medium"
                            : "hover:bg-indrasol-blue/10 text-gray-700"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(item.id)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <ChevronRight
                          className={`h-4 w-4 mr-2 ${
                            activeSection === item.id
                              ? "text-white"
                              : "text-indrasol-blue"
                          }`}
                        />
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Related white papers section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Related White Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col group"
                >
                  <a
                    href={`/components/whitepaper/${paper.slug}`}
                    className="block"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                      <img
                        src={paper.image}
                        alt={paper.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-indrasol-blue/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {paper.category}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {paper.publishDate}
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                        {paper.excerpt}
                      </p>
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600 line-clamp-1">
                          By {paper.authors}
                        </div>
                        <div className="text-indrasol-blue font-medium flex items-center hover:underline">
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Back to whitepapers button */}
            <div className="text-center mt-16">
              <a
                href="/Resources/whitepaper"
                className="inline-flex items-center px-8 py-4 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors font-medium"
              >
                View All White Papers
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default WhitePaper1;
