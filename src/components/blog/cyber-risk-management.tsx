import React from "react";
import { Calendar, Clock, ArrowRight, ChevronRight, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";

// Types for blog posts
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

// Sample data (would typically come from an API or CMS)
const sampleBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Cyber Risk Management",
    excerpt:
      "Demystifying Secure Architecture Review of Generative AI-Based Products and Services.",
    coverImage: "/blog-images/blog1.png",
    category: "Cybersecurity",
    author: "Satish Govindappa",
    publishDate: "April 18, 2025",
    readTime: "8 min read",
    slug: "cyber-risk-management",
    featured: true,
  },
  {
    id: "2",
    title: "Implementing RAG Systems for Enhanced Threat Detection",
    excerpt:
      "A practical guide to implementing Retrieval-Augmented Generation for more effective cybersecurity threat analysis.",
    coverImage: "/blog-images/rag-threat-detection.jpg",
    category: "Machine Learning",
    author: "Maya Patel",
    publishDate: "April 10, 2025",
    readTime: "10 min read",
    slug: "rag-threat-detection",
    featured: true,
  },
  {
    id: "3",
    title: "Zero Trust Architecture: Beyond the Buzzword",
    excerpt:
      "Practical strategies for implementing genuine zero trust architecture in modern enterprise networks.",
    coverImage: "/blog-images/zero-trust.jpg",
    category: "Security Architecture",
    author: "James Wilson",
    publishDate: "April 5, 2025",
    readTime: "7 min read",
    slug: "zero-trust-architecture-guide",
  },
  {
    id: "4",
    title: "The Hidden Dangers of Prompt Injection in LLMs",
    excerpt:
      "Understanding and mitigating prompt injection attacks in large language model applications.",
    coverImage: "/blog-images/prompt-injection.jpg",
    category: "AI Security",
    author: "Dr. Alex Chen",
    publishDate: "March 28, 2025",
    readTime: "6 min read",
    slug: "prompt-injection-dangers",
  },
];

// Regular blog post card component
const BlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to blog detail page
  const handleCardClick = () => {
    navigate(`/blog/${blog.slug}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-5 w-5 text-indrasol-blue" />
          </div>
        </div>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {blog.publishDate}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {blog.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <span className="text-xs text-gray-700">{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {blog.readTime}
            </span>
            <span className="text-indrasol-blue text-xs font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Read{" "}
              <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Detail Page component
const CyberBlogDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  // In a real implementation, you would fetch the blog data based on the slug
  const blog = sampleBlogs.find((blog) => blog.slug === slug) || sampleBlogs[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-32 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-indrasol-blue">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/blogs2" className="hover:text-indrasol-blue">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-700">{blog.title}</span>
            </div>

            {/* Header section */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-indrasol-blue/10 text-indrasol-blue text-sm font-semibold px-4 py-1 rounded-full">
                  {blog.category}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {blog.publishDate}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {blog.readTime}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              {/* Author section - simplified */}
              <div className="flex items-center mb-8">
                <div>
                  <div className="font-bold text-gray-900">{blog.author}</div>
                </div>
              </div>
            </div>

            {/* Featured image */}
            <div className="rounded-xl overflow-hidden mb-8">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>

            {/* Blog content - placeholder */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {blog.excerpt}
              </p>
              <h2>Abstract</h2>
              <p className="mb-4">
                In the era of transformative technologies, Generative AI (GenAI)
                has emerged as a powerful force, redefining how we interact with
                data and information. It has unlocked the potential for
                innovation across various domains, from content generation to
                problem-solving. However, harnessing the capabilities of GenAI
                comes with the responsibility of ensuring the security and
                integrity of the applications built upon it. ​
              </p>
              <p className="mb-4">
                ​This blog delves into the crucial process of conducting a
                secure architecture review for GenAI-based applications. It
                explores the evolving landscape of GenAI technology, the
                standards that govern it, and the threats that challenge its
                secure implementation. Moreover, it outlines a systematic
                approach to performing architecture reviews, providing insights
                into engagement initiation, information gathering, risk
                analysis, and more.
              </p>
              <h2>Scope</h2>
              <p className="mb-4">
                The scope of this blog is to provide a comprehensive guide to
                conducting secure architecture reviews for applications powered
                by GenAI. In an era where AI-driven innovations are reshaping
                industries and enhancing human capabilities, it is paramount to
                ensure that the development and deployment of GenAI-based
                applications adhere to the highest standards of security and
                integrity.
              </p>
              <h2>Overview</h2>
              <p className="mb-4">
                Our journey begins with a foundational understanding of the
                GenAI landscape, distinguishing it from conventional AI-based
                applications. We delve into the unique challenges and risks
                associated with GenAI, presenting real-world examples and
                highlighting the critical need for rigorous security measures.
              </p>
              <h3>
                The subsequent sections of this blog are structured as follows:
              </h3>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/overview.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
                {/* <p className="text-sm text-gray-500 italic text-center py-2 bg-gray-50">
                  Figure 1: Overview of GenAI Security Framework and Review
                  Process
                </p> */}
              </div>
              <h2>Introduction</h2>
              <p className="mb-4">
                In today's fast-paced business landscape, the demand for
                AI-based applications, particularly GenAI, has surged. These
                applications hold immense potential, capable of accelerating
                processes by up to tenfold. However, they bring with them a
                substantial risk—the potential leakage of sensitive company
                information. This risk arises from their unique capability of
                self-learning, which can accidently expose critical data.
              </p>
              <h2>Problem Statement</h2>
              <p className="mb-4">
                The core issue we're confronting revolves around this dilemma.
                On one hand, there's a compelling need for AI applications to
                drive efficiency and innovation. On the other hand, ensuring the
                security of sensitive data is paramount. We find ourselves in
                need of a robust evaluation methodology, standards, and
                processes to safely integrate Gen AI applications into our
                organizations. ​
              </p>
              <p>
                Today, we embark on a journey to explore precisely how we can
                strike the right balance between harnessing the power of AI and
                safeguarding our vital information.
              </p>
              <h2>Understanding GenAI</h2>
              {/* <p className="mb-4">
                Generative AI (GenAI) represents a significant evolution in
                artificial intelligence technology. Understanding its core
                components is essential for effective security architecture
                reviews:
              </p> */}
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Key Differences between GenAI and AI-Based Applications:
                  </span>{" "}
                  GenAI distinguishes itself from traditional AI-based
                  applications in several fundamental ways:
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Purpose:</span> Traditional AI
                  applications simulate human intelligence to perform specific
                  tasks, such as recommendation systems or automation. In
                  contrast, GenAI goes beyond tasks; it generates data it was
                  trained on.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Output:</span> Traditional AI
                  provides logical responses based on patterns and data. GenAI,
                  on the other hand, generates novel content, be it text,
                  images, or other forms of data.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Data Usage:</span> Traditional
                  AI leverages data to make informed decisions or
                  recommendations. GenAI, however, can inadvertently expose
                  sensitive data, making data privacy a critical concern.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Application Areas: </span>{" "}
                  Traditional AI is commonly found in recommendation systems,
                  process automation, and data analysis. GenAI excels in
                  creative tasks like text and image generation, content
                  creation, and even mimicking human-like conversations.
                </li>
              </ul>
              <h2>Categories of GenAI Models</h2>
              <p className="mb-4">
                GenAI models encompass a variety of applications, each tailored
                to specific use cases. These models can typically be categorized
                into three main groups:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Consumer Model:</span> These
                  models are harnessed by third-party GenAI applications, such
                  as browser or email plugins. They aim to elevate user
                  experiences by enhancing various functionalities. For example,
                  autocomplete features in emails or content suggestions in
                  writing applications.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Internal Model:</span> This
                  category involves the utilization of private GenAI models
                  within an organization for internal purposes. For instance,
                  organizations employ private GPTs (Generative Pre-trained
                  Transformers) to safeguard their data and ensure security
                  while leveraging the power of GenAI.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Customer Model:</span>{" "}
                  Businesses leverage this category to offer tailored services
                  to their customers. It involves the deployment of in-house
                  Large Language Models (LLMs) to provide personalized
                  interactions and solutions. Examples include chatbots that
                  assist customers or AI-generated content on e-commerce
                  websites. ​ Understanding these categories is crucial for
                  assessing the security implications of GenAI applications, as
                  each category presents unique challenges and risks.
                </li>
              </ul>
              <h2>Threats</h2>
              <p className="mb-4">
                In the realm of AI-based products and services, understanding
                the potential threats is paramount to effective security. Here,
                we explore some of the key threats organizations may face:
              </p>
              {/* <blockquote className="border-l-4 border-indrasol-blue pl-4 italic text-gray-700">
                The security landscape is constantly evolving, and our
                approaches must evolve with it. Static security models are no
                longer sufficient in today's dynamic threat environment.
              </blockquote> */}
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Input Manipulation:</span>{" "}
                  Imagine interacting with a chatbot or AI-driven system.
                  Changing your words or asking tricky questions can lead to
                  incorrect or harmful responses. For instance, a medical
                  chatbot might misinterpret a health query, potentially
                  providing inaccurate medical advice.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Adversarial Attacks:</span>{" "}
                  Adversarial attacks target AI models, particularly in areas
                  like image recognition and facial identification. Small
                  changes to input data, such as adding glasses or makeup, can
                  deceive AI systems into not recognizing individuals. This can
                  have serious implications for security, privacy, and access
                  control.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Data Poisoning Attack:</span>{" "}
                  This type of attack involves maliciously manipulating the data
                  used to train AI models. By introducing false or misleading
                  data into the training dataset, attackers can compromise the
                  accuracy and reliability of AI systems. This can lead to
                  biased predictions or compromised decision-making.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Model Inversion Attack:</span>{" "}
                  Attackers may attempt to reverse-engineer AI models to obtain
                  sensitive information. By analyzing the model's output, they
                  may gain insights into confidential data, potentially leading
                  to privacy breaches or intellectual property theft.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Transfer Learning Attack:{" "}
                  </span>{" "}
                  In this scenario, an attacker manipulates an AI model by
                  transferring knowledge gained from one domain to another. This
                  can result in the AI system producing incorrect or harmful
                  outcomes when applied to new tasks. ​ Understanding these
                  threats is critical, as they have far-reaching implications
                  for the security, privacy, and integrity of AI-based products
                  and services. To mitigate these risks effectively,
                  organizations must employ robust security measures and stay
                  vigilant in the face of evolving threats.
                </li>
              </ul>
              <h2>Challenges</h2>
              <p className="mb-4">
                The landscape of GenAI presents organizations with unique
                challenges that demand careful consideration:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Information Leakage:</span>{" "}
                  GenAI models, when not appropriately controlled, have the
                  potential to generate outputs that inadvertently leak
                  sensitive information. For instance, a GenAI model trained on
                  financial data could inadvertently produce reports containing
                  confidential financial details, risking data exposure.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Privacy Concerns:</span>{" "}
                  Consider an AI-driven healthcare application that generates
                  patient diagnoses based on medical records. Privacy concerns
                  arise regarding unauthorized access to personal health
                  information, necessitating strict controls to safeguard
                  sensitive data.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Legal Concerns:</span> The use
                  of AI in generating legal documents or providing legal advice
                  introduces complexities in determining liability in cases of
                  errors or misleading content. Legal ambiguities may arise, and
                  organizations must navigate this landscape carefully.
                </li>
              </ul>
              <h2>Solution</h2>
              <p className="mb-4">
                Now that we have a comprehensive understanding of the challenges
                and threats associated with AI-based products and services,
                let's explore effective solutions and strategies to address
                these concerns.
              </p>
              <h3>Security Architecture Review Methodology</h3>
              <p>
                The GenAI architecture review methodology comprises five key
                steps: ​ Intake Process: Begin by initiating the intake process,
                where you gather essential information about the AI application
                under review
              </p>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/SecurityArchitecture.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
              </div>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Threat Modeling:</span>{" "}
                  Identify potential threats and vulnerabilities specific to the
                  application. This step helps in understanding the security
                  landscape.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Security Control Review:
                  </span>{" "}
                  Evaluate existing security controls and measures within the AI
                  application's architecture. Assess authentication,
                  authorization, data privacy, and ethical use.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Risk Severity Assessment:
                  </span>{" "}
                  Assess the severity of identified risks and vulnerabilities to
                  prioritize mitigation efforts effectively.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Reporting:</span> Summarize
                  findings and recommendations in a comprehensive report to be
                  shared with stakeholders.
                </li>
              </ul>
              <h3>Tabletop Exercise Questions</h3>
              <p>
                Conducting tabletop exercises involves questioning GenAI product
                vendors across various domains. This exercise focuses on
                essential aspects such as authentication, authorization, bias
                mitigation, data privacy, and ethical use. By rigorously
                examining these elements, organizations can ensure comprehensive
                security and ethical considerations before integrating GenAI
                products and services.
              </p>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/Tabletop.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
              </div>
              <h3>Understanding Internal Architecture / Technology Stack</h3>
              <p>
                The internal architecture of GenAI applications typically
                follows a common pattern across three model types: Consumer,
                Customer, and Employee. Each model comprises three key
                components:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Front End:</span> This
                  component facilitates user interactions through a web
                  framework, ensuring accessibility and user-friendliness.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Back End:</span> The engine
                  powering GenAI applications includes Large Language Model
                  (LLM) frameworks like Langchain and prominent LLMs such as
                  OpenAI. Accessible via an API gateway, the back end is a
                  critical part of the architecture.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Infrastructure:</span> GenAI
                  applications are hosted in secure environments, forming the
                  infrastructure where security controls and measures must be
                  implemented effectively.
                </li>
              </ul>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/understandingIA.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
              </div>
              <h3>Evaluation Framework</h3>
              <p>
                Based on the internal architecture discussed above,
                organizations can establish a comprehensive evaluation framework
                for security controls. This framework covers multiple facets:
              </p>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/Evaluation.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
              </div>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Front End Controls:</span>{" "}
                  Evaluate authentication, access control, data validation, and
                  response sanitization to ensure robust front-end security.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Back End Controls:</span>{" "}
                  Assess the LLM framework and models for safeguarding data
                  privacy, protecting against adversarial attacks, and ensuring
                  the integrity of single-tenant models.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Infrastructure Controls:
                  </span>{" "}
                  Conduct rigorous validation, including Business Continuity
                  Planning (BCP), Disaster Recovery (DR), and continuous
                  monitoring, to ensure the security and resilience of GenAI
                  applications.
                </li>
              </ul>
              <h3>Connecting the Dots</h3>
              <p>
                Putting the methodology and security evaluation framework into
                action involves an end-to-end architecture review process. This
                review comprises seven key steps:
              </p>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/ConnectingDots.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
              </div>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Step 1: Engagement Initiation:
                  </span>{" "}
                  Request the product team to submit a review ticket with basic
                  details to initiate the process.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Step 2: Scoping and Information Gathering:
                  </span>{" "}
                  Conduct a tabletop exercise, collaboratively brainstorming the
                  application and asking questions derived from the
                  questionnaire. Both the product team and the infosec team
                  share responsibility in this step.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Step 3: Risk Assessment:
                  </span>{" "}
                  Utilize the STRIDE methodology to conduct threat modeling,
                  create a data flow diagram, identify potential threats, threat
                  agents, and establish trust zones. The infosec team leads this
                  step.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Step 4: Reporting:</span>{" "}
                  Summarize and prioritize findings, preparing a report to be
                  shared with stakeholders.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Step 5: Signoff:</span> Based
                  on the findings, approve or deny the request. If there are no
                  critical or high-severity issues, approve; otherwise, deny.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Step 6: Exception/Risk Acceptance:
                  </span>{" "}
                  In cases where identified issues cannot be addressed, an
                  exception/risk acceptance process is initiated, seeking
                  approval from relevant stakeholders.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Step 7: Signoff with Exception/Risk Acceptance:
                  </span>{" "}
                  Once all stakeholders grant approval, document accepted risks,
                  and approve the request for implementation.
                </li>
              </ul>
              <h2>Use Case 1 : GenAI Email Plugin</h2>
              <p className="mb-4">
                Let's delve into two real-world use cases to illustrate the
                architecture review process in action: In this scenario, the
                product team expressed interest in integrating a GenAI email
                plugin designed to assist in email drafting. The security
                architecture review process unfolded as follows:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">Engagement Initiation:</span>{" "}
                  The infosec team initiated the engagement by requesting the
                  product team to create a review ticket with high-level
                  information.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Scoping and Information Gathering:
                  </span>{" "}
                  A tabletop exercise revealed that the vendor's chosen LLM for
                  the email plugin was multitenant. This discovery raised
                  concerns about data security.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Risk Assessment:</span> A
                  comprehensive risk assessment, including a dataflow diagram,
                  was carried out. It identified a critical finding related to
                  the multitenant LLM model that had the potential to compromise
                  data security. As a result, the request was denied.
                </li>
              </ul>
              <h2>Use Case 2: GenAI Private Chatbot</h2>
              <p className="mb-4">
                In this scenario, the product team expressed a desire to
                integrate a GenAI private chatbot into their system. The
                security architecture review process proceeded as follows:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Scoping and Information Gathering:
                  </span>{" "}
                  During the tabletop exercise, it was revealed that the
                  vendor's chosen LLM for the chatbot was single-tenant, a
                  security advantage. Additionally, the application had robust
                  input validation and output sanitization measures to ensure
                  user prompts' security and integrity.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Risk Assessment:</span> A
                  thorough risk assessment was conducted, complete with a
                  dataflow diagram that delineated assets, potential threat
                  agents, and trust zones. The resulting report delivered a
                  clean bill of health, with zero critical or high findings,
                  leading to the approval of the product team's request.
                </li>
              </ul>
              <p>
                These real-world use cases highlight the practical application
                of the security architecture review process, demonstrating how
                it can effectively evaluate and secure GenAI applications.
              </p>
              <h2>Recommendations</h2>
              <h3>Seven Pillars for Success</h3>
              <div className="my-6 rounded-xl overflow-hidden shadow-md">
                <img
                  src="/blog-images/SevenPillars.png"
                  alt="Diagram"
                  className="w-full h-auto"
                />
              </div>
              <p className="mb-4">
                As organizations embrace AI adoption, particularly GenAI, it's
                crucial to establish a robust foundation for security. Here are
                seven essential pillars for success in securing AI-based
                products and services:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Infrastructure Security:
                  </span>{" "}
                  Just as we secure physical spaces, organizations must ensure
                  the security of their digital infrastructure. This includes
                  network security, data center security, and cloud security.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Identity and Access Management (IAM):
                  </span>{" "}
                  IAM functions as the security team, ensuring that only
                  authorized individuals can access digital assets. Implementing
                  strong IAM policies and controls is paramount to data
                  protection.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Data Security:</span> Data is
                  often the most valuable asset. Protect it from theft or damage
                  through encryption, access controls, data masking, and regular
                  audits.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Application Security:</span>{" "}
                  Safeguard AI applications to prevent unauthorized access and
                  data breaches. Implement security measures such as code
                  reviews, vulnerability assessments, and secure coding
                  practices.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Logging and Monitoring:</span>{" "}
                  Establish a vigilant digital watchman by implementing
                  comprehensive logging and monitoring solutions. Early
                  detection of anomalies and threats is crucial to swift
                  response.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Incident Response:</span>{" "}
                  Prepare for emergencies by developing an incident response
                  plan. Define roles, responsibilities, and actions to take in
                  case of a security incident.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">Governance:</span> Create a
                  rulebook for AI usage within your organization. Ensure that AI
                  is used safely, ethically, and in compliance with regulations
                  and industry standards.
                </li>
                <li className="text-gray-800">
                  <span className="font-semibold">
                    Safeguarding AI Adoption:
                  </span>{" "}
                  In today's digital landscape, safeguarding AI adoption is not
                  a choice but a necessity. As organizations navigate the
                  ever-changing AI landscape, staying proactive, vigilant, and
                  secure is paramount. The recommendations outlined in these
                  seven pillars provide a strong shield to protect organizations
                  in the world of AI technology.
                </li>
              </ul>
              <h2>Conclusion</h2>
              <p className="mb-4">
                In this comprehensive blog, we have explored the critical
                aspects of conducting a security architecture review for
                AI-based products and services, with a specific focus on
                Generative AI. From understanding the unique challenges and
                threats to proposing effective solutions and recommendations, we
                have provided a roadmap for organizations to navigate the
                complexities of AI adoption securely.
              </p>
              <p>
                As AI continues to transform industries and drive innovation,
                organizations must remain steadfast in their commitment to
                security. The proactive measures outlined in this blog are
                essential for safeguarding sensitive data, ensuring ethical AI
                use, and protecting against evolving threats.
              </p>
              <p>
                In conclusion, the path to AI success begins with a robust
                security foundation. By following the principles and strategies
                outlined in this white paper, organizations can harness the
                transformative power of AI while maintaining the highest
                standards of security and integrity.
              </p>
              <h2>References</h2>
              <ul className="pl-6 mb-6 space-y-4">
                <li className="text-gray-800">
                  <span className="font-semibold">OECD AI Principles</span> -{" "}
                  <a
                    href="https://oecd.ai/en/ai-principles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indrasol-blue hover:underline"
                  >
                    https://oecd.ai/en/ai-principles
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    The OECD Principles on Artificial Intelligence promote AI
                    that is innovative and trustworthy and that respects human
                    rights and democratic values.
                  </p>
                </li>

                <li className="text-gray-800">
                  <span className="font-semibold">
                    NIST AI Risk Management Framework
                  </span>{" "}
                  -{" "}
                  <a
                    href="https://www.nist.gov/itl/ai-risk-management-framework"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indrasol-blue hover:underline"
                  >
                    https://www.nist.gov/itl/ai-risk-management-framework
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    The NIST AI Risk Management Framework provides guidance on
                    managing risks in the design, development, use, and
                    evaluation of AI products, services, and systems.
                  </p>
                </li>

                <li className="text-gray-800">
                  <span className="font-semibold">
                    Deloitte AI Governance Framework
                  </span>{" "}
                  -{" "}
                  <a
                    href="https://www2.deloitte.com/us/en/pages/consulting/articles/ai-governance-responsible-ai.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indrasol-blue hover:underline"
                  >
                    https://www2.deloitte.com/us/en/pages/consulting/articles/ai-governance-responsible-ai.html
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Deloitte's framework for responsible AI implementation and
                    governance in enterprises.
                  </p>
                </li>

                <li className="text-gray-800">
                  <span className="font-semibold">
                    AI4People Global Governance Framework
                  </span>{" "}
                  -{" "}
                  <a
                    href="https://www.eismd.eu/ai4people"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indrasol-blue hover:underline"
                  >
                    https://www.eismd.eu/ai4people
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    AI4People is Europe's first global forum on the social
                    impacts of artificial intelligence, focusing on developing
                    ethical frameworks for responsible AI.
                  </p>
                </li>

                <li className="text-gray-800">
                  <span className="font-semibold">
                    Gartner's AI Governance Framework
                  </span>{" "}
                  -{" "}
                  <a
                    href="https://www.gartner.com/en/documents/4017057/ai-governance-framework"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indrasol-blue hover:underline"
                  >
                    https://www.gartner.com/en/documents/4017057/ai-governance-framework
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Gartner's comprehensive framework for governing AI systems
                    throughout their lifecycle.
                  </p>
                </li>
              </ul>
              <h2>About the Author</h2>
              <p>
                Satish Govindappa is a highly accomplished professional with an
                extensive background in cloud security and product architecture.
                With over two decades of experience, Satish has established
                himself as a prominent figure in the industry, serving as a
                Board Member and Chapter Leader for the Cloud Security Alliance
                SFO Chapter.
              </p>{" "}
              ​
              <p>
                He holds a master's degree in computer applications (MCA),
                specializing in cybersecurity and cyber law. Additionally,
                Satish has earned a Master of Business Administration (MBA)
                degree, further enhancing his expertise in the intersection of
                technology and business strategy.
              </p>
              <p>
                {" "}
                ​ His expertise lies in designing, architecting, and reviewing
                both cloud, non-cloud and ai/genai products and services. Satish
                has a proven track record of successfully implementing robust
                security measures and ensuring the integrity and confidentiality
                of sensitive data.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                #{blog.category}
              </span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                #Security
              </span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                #BestPractices
              </span>
            </div>

            {/* Related posts section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sampleBlogs
                  .filter(
                    (relatedBlog) =>
                      relatedBlog.id !== blog.id &&
                      relatedBlog.category === blog.category
                  )
                  .slice(0, 3)
                  .map((relatedBlog) => (
                    <Link to={`/blog/${relatedBlog.slug}`} key={relatedBlog.id}>
                      <BlogCard blog={relatedBlog} />
                    </Link>
                  ))}
              </div>
            </div>

            {/* Back to blog button */}
            <div className="text-center mt-12 mb-16">
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors"
              >
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default CyberBlogDetailPage;
