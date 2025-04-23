import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Eye,
  ChevronLeft,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react";

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

// Sample data
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
    coverImage: "/api/placeholder/800/400",
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
    coverImage: "/api/placeholder/800/400",
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
    coverImage: "/api/placeholder/800/400",
    category: "AI Security",
    author: "Dr. Alex Chen",
    publishDate: "March 28, 2025",
    readTime: "6 min read",
    slug: "prompt-injection-dangers",
  },
];

// Modern BlogCard component with animation and improved UI
const BlogCard = ({ blog }) => {
  const handleCardClick = () => {
    console.log(`Navigating to ${blog.slug}`);
    // Navigation would happen here in a real app
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-blue-500/10 backdrop-blur-sm text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-lg mb-6 flex-grow line-clamp-2">
          {blog.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <span className="text-xs text-gray-700 font-medium">
              {blog.author}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {blog.readTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content section component to improve structure
const ContentSection = ({ title, children, id }) => (
  <div className="mb-8" id={id}>
    {title && (
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-6 bg-blue-600 rounded mr-2"></div>
        {title}
      </h2>
    )}
    <div className="text-gray-700 leading-relaxed">{children}</div>
  </div>
);

// Image component with optimized display
const OptimizedImage = ({ src, alt, caption }) => (
  <div className="my-6 rounded-xl overflow-hidden shadow-sm">
    <div className="bg-gray-50 p-1">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto max-h-64 object-contain rounded-lg"
      />
      {caption && (
        <p className="text-sm text-gray-500 italic text-center py-2">
          {caption}
        </p>
      )}
    </div>
  </div>
);

// Main Blog Detail Page component
const CyberBlogDetailPage = () => {
  const [blog] = useState(sampleBlogs[0]); // Using the first blog as an example

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Hero Section with Featured Image */}
      <div className="relative h-80 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                {blog.category}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {blog.publishDate}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {blog.readTime}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{blog.author}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-gray-500 mb-8">
                <a href="/" className="hover:text-blue-600">
                  Home
                </a>
                <ChevronRight className="h-4 w-4 mx-2" />
                <a href="/Resources/blogs2" className="hover:text-blue-600">
                  Blog
                </a>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-700 truncate max-w-xs">
                  {blog.title}
                </span>
              </div>

              {/* Quick navigation */}
              <div className="mb-10 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-3">
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <a
                    href="#abstract"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" /> Abstract
                  </a>
                  <a
                    href="#scope"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" /> Scope
                  </a>
                  <a
                    href="#overview"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" /> Overview
                  </a>
                  <a
                    href="#introduction"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" /> Introduction
                  </a>
                  <a
                    href="#problem"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" /> Problem Statement
                  </a>
                  <a
                    href="#understanding"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" /> Understanding
                    GenAI
                  </a>
                </div>
              </div>

              {/* Blog introduction */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {blog.excerpt}
                </p>
              </div>

              {/* Blog content sections */}
              <ContentSection title="Abstract" id="abstract">
                <p className="mb-4">
                  In the era of transformative technologies, Generative AI
                  (GenAI) has emerged as a powerful force, redefining how we
                  interact with data and information. It has unlocked the
                  potential for innovation across various domains, from content
                  generation to problem-solving. However, harnessing the
                  capabilities of GenAI comes with the responsibility of
                  ensuring the security and integrity of the applications built
                  upon it.
                </p>
                <p className="mb-4">
                  This blog delves into the crucial process of conducting a
                  secure architecture review for GenAI-based applications. It
                  explores the evolving landscape of GenAI technology, the
                  standards that govern it, and the threats that challenge its
                  secure implementation. Moreover, it outlines a systematic
                  approach to performing architecture reviews, providing
                  insights into engagement initiation, information gathering,
                  risk analysis, and more.
                </p>
              </ContentSection>

              <ContentSection title="Scope" id="scope">
                <p className="mb-4">
                  The scope of this blog is to provide a comprehensive guide to
                  conducting secure architecture reviews for applications
                  powered by GenAI. In an era where AI-driven innovations are
                  reshaping industries and enhancing human capabilities, it is
                  paramount to ensure that the development and deployment of
                  GenAI-based applications adhere to the highest standards of
                  security and integrity.
                </p>
              </ContentSection>

              <ContentSection title="Overview" id="overview">
                <p className="mb-4">
                  Our journey begins with a foundational understanding of the
                  GenAI landscape, distinguishing it from conventional AI-based
                  applications. We delve into the unique challenges and risks
                  associated with GenAI, presenting real-world examples and
                  highlighting the critical need for rigorous security measures.
                </p>
                <h3 className="font-semibold mb-3">
                  The subsequent sections of this blog are structured as
                  follows:
                </h3>
                <OptimizedImage
                  src="/blog-images/overview.png"
                  alt="Overview diagram"
                  caption={undefined}
                />
              </ContentSection>

              <ContentSection title="Introduction" id="introduction">
                <p className="mb-4">
                  In today's fast-paced business landscape, the demand for
                  AI-based applications, particularly GenAI, has surged. These
                  applications hold immense potential, capable of accelerating
                  processes by up to tenfold. However, they bring with them a
                  substantial risk—the potential leakage of sensitive company
                  information. This risk arises from their unique capability of
                  self-learning, which can accidently expose critical data.
                </p>
              </ContentSection>

              <ContentSection title="Problem Statement" id="problem">
                <p className="mb-4">
                  The core issue we're confronting revolves around this dilemma.
                  On one hand, there's a compelling need for AI applications to
                  drive efficiency and innovation. On the other hand, ensuring
                  the security of sensitive data is paramount. We find ourselves
                  in need of a robust evaluation methodology, standards, and
                  processes to safely integrate Gen AI applications into our
                  organizations.
                </p>
                <p>
                  Today, we embark on a journey to explore precisely how we can
                  strike the right balance between harnessing the power of AI
                  and safeguarding our vital information.
                </p>
              </ContentSection>

              <ContentSection title="Understanding GenAI" id="understanding">
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-600">
                  <h4 className="font-semibold mb-2">
                    Key Differences between GenAI and AI-Based Applications
                  </h4>
                  <p className="text-gray-700">
                    GenAI distinguishes itself from traditional AI-based
                    applications in several fundamental ways including purpose,
                    output, data usage, and application areas.
                  </p>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      1
                    </div>
                    <div>
                      <span className="font-semibold">Purpose:</span>{" "}
                      Traditional AI applications simulate human intelligence to
                      perform specific tasks, such as recommendation systems or
                      automation. In contrast, GenAI goes beyond tasks; it
                      generates data it was trained on.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      2
                    </div>
                    <div>
                      <span className="font-semibold">Output:</span> Traditional
                      AI provides logical responses based on patterns and data.
                      GenAI, on the other hand, generates novel content, be it
                      text, images, or other forms of data.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      3
                    </div>
                    <div>
                      <span className="font-semibold">Data Usage:</span>{" "}
                      Traditional AI leverages data to make informed decisions
                      or recommendations. GenAI, however, can inadvertently
                      expose sensitive data, making data privacy a critical
                      concern.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-6 h-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      4
                    </div>
                    <div>
                      <span className="font-semibold">Application Areas:</span>{" "}
                      Traditional AI is commonly found in recommendation
                      systems, process automation, and data analysis. GenAI
                      excels in creative tasks like text and image generation,
                      content creation, and even mimicking human-like
                      conversations.
                    </div>
                  </li>
                </ul>

                <h3 className="font-semibold text-xl mb-4 mt-8">
                  Categories of GenAI Models
                </h3>
                <p className="text-sm">
                  GenAI models encompass a variety of applications, each
                  tailored to specific use cases. These models can typically be
                  categorized into three main groups:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition-colors">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Consumer Model
                    </h4>
                    <p className="text-sm">
                      These models are harnessed by third-party GenAI
                      applications, such as browser or email plugins. They aim
                      to elevate user experiences by enhancing various
                      functionalities. For example, autocomplete features in
                      emails or content suggestions in writing applications.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition-colors">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Internal Model
                    </h4>
                    <p className="text-sm">
                      This category involves the utilization of private GenAI
                      models within an organization for internal purposes. For
                      instance, organizations employ private GPTs (Generative
                      Pre-trained Transformers) to safeguard their data and
                      ensure security while leveraging the power of GenAI.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition-colors">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Customer Model
                    </h4>
                    <p className="text-sm">
                      Businesses leverage this category to offer tailored
                      services to their customers. It involves the deployment of
                      in-house Large Language Models (LLMs) to provide
                      personalized interactions and solutions. Examples include
                      chatbots that assist customers or AI-generated content on
                      e-commerce websites.
                    </p>
                    <p className="text-sm">
                      Understanding these categories is crucial for assessing
                      the security implications of GenAI applications, as each
                      category presents unique challenges and risks.
                    </p>
                  </div>
                </div>
              </ContentSection>

              {/* Continue with other sections */}
              <ContentSection title="Threats" id={undefined}>
                <p className="mb-4">
                  In the realm of AI-based products and services, understanding
                  the potential threats is paramount to effective security.
                  Here, we explore some of the key threats organizations may
                  face:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                      <div className="w-1 h-4 bg-red-600 rounded mr-2"></div>
                      Input Manipulation
                    </h4>
                    <p className="text-sm">
                      Changing words or asking tricky questions can lead to
                      incorrect or harmful responses. For instance, a medical
                      chatbot might misinterpret a health query, potentially
                      providing inaccurate medical advice.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-orange-600 mb-2 flex items-center">
                      <div className="w-1 h-4 bg-orange-600 rounded mr-2"></div>
                      Adversarial Attacks
                    </h4>
                    <p className="text-sm">
                      Small changes to input data, such as adding glasses or
                      makeup, can deceive AI systems into not recognizing
                      individuals. This can have serious implications for
                      security and access control.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-yellow-600 mb-2 flex items-center">
                      <div className="w-1 h-4 bg-yellow-600 rounded mr-2"></div>
                      Data Poisoning Attack
                    </h4>
                    <p className="text-sm">
                      Introducing false or misleading data into the training
                      dataset can compromise the accuracy and reliability of AI
                      systems. This can lead to biased predictions or
                      compromised decision-making.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-blue-600 mb-2 flex items-center">
                      <div className="w-1 h-4 bg-blue-600 rounded mr-2"></div>
                      Model Inversion Attack
                    </h4>
                    <p className="text-sm">
                      Attackers may attempt to reverse-engineer AI models to
                      obtain sensitive information, potentially leading to
                      privacy breaches or intellectual property theft.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-blue-600 mb-2 flex items-center">
                      <div className="w-1 h-4 bg-blue-600 rounded mr-2"></div>
                      Transfer Learning Attack
                    </h4>
                    <p className="text-sm">
                      In this scenario, an attacker manipulates an AI model by
                      transferring knowledge gained from one domain to another.
                      This can result in the AI system producing incorrect or
                      harmful outcomes when applied to new tasks. ​
                    </p>
                    <p className="text-sm">
                      Understanding these threats is critical, as they have
                      far-reaching implications for the security, privacy, and
                      integrity of AI-based products and services. To mitigate
                      these risks effectively, organizations must employ robust
                      security measures and stay vigilant in the face of
                      evolving threats. ​
                    </p>
                  </div>
                </div>
              </ContentSection>

              <ContentSection title="Challenges" id={undefined}>
                <p className="text-sm">
                  The landscape of GenAI presents organizations with unique
                  challenges that demand careful consideration:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition-colors">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Information Leakage
                    </h4>
                    <p className="text-sm">
                      GenAI models, when not appropriately controlled, have the
                      potential to generate outputs that inadvertently leak
                      sensitive information. For instance, a GenAI model trained
                      on financial data could inadvertently produce reports
                      containing confidential financial details, risking data
                      exposure.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition-colors">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Privacy Concerns
                    </h4>
                    <p className="text-sm">
                      Consider an AI-driven healthcare application that
                      generates patient diagnoses based on medical records.
                      Privacy concerns arise regarding unauthorized access to
                      personal health information, necessitating strict controls
                      to safeguard sensitive data.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition-colors">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      Legal Concerns
                    </h4>
                    <p className="text-sm">
                      The use of AI in generating legal documents or providing
                      legal advice introduces complexities in determining
                      liability in cases of errors or misleading content. Legal
                      ambiguities may arise, and organizations must navigate
                      this landscape carefully.
                    </p>
                  </div>
                </div>
              </ContentSection>

              {/* More sections - just a sample */}
              <ContentSection title="Solution" id={undefined}>
                <p className="mb-4">
                  Now that we have a comprehensive understanding of the
                  challenges and threats associated with AI-based products and
                  services, let's explore effective solutions and strategies to
                  address these concerns.
                </p>

                <h3> 1. Security Architecture Review Methodology</h3>
                <p className="mb-4">
                  The GenAI architecture review methodology comprises five key
                  steps:
                </p>

                <OptimizedImage
                  src="/blog-images/SecurityArchitecture.png"
                  alt="Security Architecture Diagram"
                  caption={undefined}
                />
                <div className="space-y-3 my-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      1
                    </div>
                    <p>
                      <span className="font-semibold">Intake Process:</span>{" "}
                      Begin by gathering essential information about the AI
                      application under review.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      2
                    </div>
                    <p>
                      <span className="font-semibold">Threat Modeling:</span>{" "}
                      Identify potential threats and vulnerabilities specific to
                      the application.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      3
                    </div>
                    <p>
                      <span className="font-semibold">
                        Security Control Review:
                      </span>{" "}
                      Evaluate existing security controls within the AI
                      application's architecture.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      4
                    </div>
                    <p>
                      <span className="font-semibold">
                        Risk Severity Assessment:
                      </span>{" "}
                      Assess the severity of identified risks to prioritize
                      mitigation efforts.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      5
                    </div>
                    <p>
                      <span className="font-semibold">Reporting:</span>{" "}
                      Summarize findings and recommendations for stakeholders.
                    </p>
                  </div>

                  <h3>2. Tabletop Exercise Questions</h3>
                  <p className="mb-4">
                    Conducting tabletop exercises involves questioning GenAI
                    product vendors across various domains. This exercise
                    focuses on essential aspects such as authentication,
                    authorization, bias mitigation, data privacy, and ethical
                    use. By rigorously examining these elements, organizations
                    can ensure comprehensive security and ethical considerations
                    before integrating GenAI products and services.
                  </p>

                  <OptimizedImage
                    src="/blog-images/Tabletop.png"
                    alt="Security Architecture Diagram"
                    caption={undefined}
                  />

                  <h3>
                    3. Understanding Internal Architecture / Technology Stack
                  </h3>
                  <p className="mb-4">
                    The internal architecture of GenAI applications typically
                    follows a common pattern across three model types: Consumer,
                    Customer, and Employee. Each model comprises three key
                    components:
                  </p>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      1
                    </div>
                    <p>
                      <span className="font-semibold">Front End:</span> This
                      component facilitates user interactions through a web
                      framework, ensuring accessibility and user-friendliness.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      2
                    </div>
                    <p>
                      <span className="font-semibold">Back End:</span> The
                      engine powering GenAI applications includes Large Language
                      Model (LLM) frameworks like Langchain and prominent LLMs
                      such as OpenAI. Accessible via an API gateway, the back
                      end is a critical part of the architecture.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      3
                    </div>
                    <p>
                      <span className="font-semibold">Infrastructure:</span>{" "}
                      GenAI applications are hosted in secure environments,
                      forming the infrastructure where security controls and
                      measures must be implemented effectively.
                    </p>
                  </div>

                  <OptimizedImage
                    src="/blog-images/understandingIA.png"
                    alt="Security Architecture Diagram"
                    caption={undefined}
                  />

                  <h3>4. Evaluation Framework</h3>
                  <p className="mb-4">
                    Based on the internal architecture discussed above,
                    organizations can establish a comprehensive evaluation
                    framework for security controls. This framework covers
                    multiple facets:
                  </p>

                  <OptimizedImage
                    src="/blog-images/Evaluation.png"
                    alt="Security Architecture Diagram"
                    caption={undefined}
                  />

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      1
                    </div>
                    <p>
                      <span className="font-semibold">Front End Controls:</span>{" "}
                      Evaluate authentication, access control, data validation,
                      and response sanitization to ensure robust front-end
                      security.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      2
                    </div>
                    <p>
                      <span className="font-semibold">Back End Controls:</span>{" "}
                      Assess the LLM framework and models for safeguarding data
                      privacy, protecting against adversarial attacks, and
                      ensuring the integrity of single-tenant models.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      3
                    </div>
                    <p>
                      <span className="font-semibold">
                        Infrastructure Controls:
                      </span>{" "}
                      Conduct rigorous validation, including Business Continuity
                      Planning (BCP), Disaster Recovery (DR), and continuous
                      monitoring, to ensure the security and resilience of GenAI
                      applications.
                    </p>
                  </div>

                  <h3>4. Connecting the Dots</h3>
                  <p className="mb-4">
                    Putting the methodology and security evaluation framework
                    into action involves an end-to-end architecture review
                    process. This review comprises seven key steps:
                  </p>

                  <OptimizedImage
                    src="/blog-images/ConnectingDots.png"
                    alt="Security Architecture Diagram"
                    caption={undefined}
                  />

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S1:
                    </div>
                    <p>
                      <span className="font-semibold">
                        Engagement Initiation:
                      </span>
                      Request the product team to submit a review ticket with
                      basic details to initiate the process.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S2:
                    </div>
                    <p>
                      <span className="font-semibold">
                        Scoping and Information Gathering:
                      </span>{" "}
                      Conduct a tabletop exercise, collaboratively brainstorming
                      the application and asking questions derived from the
                      questionnaire. Both the product team and the infosec team
                      share responsibility in this step.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S3:
                    </div>
                    <p>
                      <span className="font-semibold">Risk Assessment:</span>{" "}
                      Utilize the STRIDE methodology to conduct threat modeling,
                      create a data flow diagram, identify potential threats,
                      threat agents, and establish trust zones. The infosec team
                      leads this step.
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S4:
                    </div>
                    <p>
                      <span className="font-semibold">Reporting:</span>{" "}
                      Summarize and prioritize findings, preparing a report to
                      be shared with stakeholders
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S5:
                    </div>
                    <p>
                      <span className="font-semibold">Signoff:</span> Based on
                      the findings, approve or deny the request. If there are no
                      critical or high-severity issues, approve; otherwise,
                      deny.
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S6:
                    </div>
                    <p>
                      <span className="font-semibold">
                        Exception/Risk Acceptance:
                      </span>{" "}
                      In cases where identified issues cannot be addressed, an
                      exception/risk acceptance process is initiated, seeking
                      approval from relevant stakeholders.
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      S7:
                    </div>
                    <p>
                      <span className="font-semibold">
                        Signoff with Exception/Risk Acceptance:
                      </span>{" "}
                      Once all stakeholders grant approval, document accepted
                      risks, and approve the request for implementation.
                    </p>
                  </div>
                </div>
              </ContentSection>

              <ContentSection
                title="Use Case 1 : GenAI Email Plugin"
                id={undefined}
              >
                <p className="mb-4">
                  Let's delve into two real-world use cases to illustrate the
                  architecture review process in action: In this scenario, the
                  product team expressed interest in integrating a GenAI email
                  plugin designed to assist in email drafting. The security
                  architecture review process unfolded as follows:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li className="text-gray-800">
                    <span className="font-semibold">
                      Engagement Initiation:
                    </span>{" "}
                    The infosec team initiated the engagement by requesting the
                    product team to create a review ticket with high-level
                    information.
                  </li>
                  <li className="text-gray-800">
                    <span className="font-semibold">
                      Scoping and Information Gathering:
                    </span>{" "}
                    A tabletop exercise revealed that the vendor's chosen LLM
                    for the email plugin was multitenant. This discovery raised
                    concerns about data security.
                  </li>
                  <li className="text-gray-800">
                    <span className="font-semibold">Risk Assessment:</span> A
                    comprehensive risk assessment, including a dataflow diagram,
                    was carried out. It identified a critical finding related to
                    the multitenant LLM model that had the potential to
                    compromise data security. As a result, the request was
                    denied.
                  </li>
                </ul>
              </ContentSection>

              <ContentSection
                title="Use Case 2: GenAI Private Chatbot"
                id={undefined}
              >
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
              </ContentSection>

              <ContentSection title="Recommendations" id={undefined}>
                <h3>Seven Pillars for Success</h3>
                <OptimizedImage
                    src="/blog-images/SevenPillars.png"
                    alt="Security Architecture Diagram"
                    caption={undefined}
                  />
                <p className="mb-4">
                  As organizations embrace AI adoption, particularly GenAI, it's
                  crucial to establish a robust foundation for security. Here
                  are seven essential pillars for success in securing AI-based
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
                    authorized individuals can access digital assets.
                    Implementing strong IAM policies and controls is paramount
                    to data protection.
                  </li>
                  <li className="text-gray-800">
                    <span className="font-semibold">Data Security:</span> Data
                    is often the most valuable asset. Protect it from theft or
                    damage through encryption, access controls, data masking,
                    and regular audits.
                  </li>
                  <li className="text-gray-800">
                    <span className="font-semibold">Application Security:</span>{" "}
                    Safeguard AI applications to prevent unauthorized access and
                    data breaches. Implement security measures such as code
                    reviews, vulnerability assessments, and secure coding
                    practices.
                  </li>
                  <li className="text-gray-800">
                    <span className="font-semibold">
                      Logging and Monitoring:
                    </span>{" "}
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
                    rulebook for AI usage within your organization. Ensure that
                    AI is used safely, ethically, and in compliance with
                    regulations and industry standards.
                  </li>
                  <li className="text-gray-800">
                    <span className="font-semibold">
                      Safeguarding AI Adoption:
                    </span>{" "}
                    In today's digital landscape, safeguarding AI adoption is
                    not a choice but a necessity. As organizations navigate the
                    ever-changing AI landscape, staying proactive, vigilant, and
                    secure is paramount. The recommendations outlined in these
                    seven pillars provide a strong shield to protect
                    organizations in the world of AI technology.
                  </li>
                </ul>
              </ContentSection>

              <ContentSection title="Conclusion" id={undefined}>
                <p>
                  In this comprehensive blog, we have explored the critical
                  aspects of conducting a security architecture review for
                  AI-based products and services, with a specific focus on
                  Generative AI. From understanding the unique challenges and
                  threats to proposing effective solutions and recommendations,
                  we have provided a roadmap for organizations to navigate the
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
                  security foundation. By following the principles and
                  strategies outlined in this white paper, organizations can
                  harness the transformative power of AI while maintaining the
                  highest standards of security and integrity.
                </p>
              </ContentSection>

              <ContentSection title="References" id={undefined}>
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
              </ContentSection>

              {/* Social sharing */}
              <div className="border-t border-gray-100 pt-6 mt-10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Share this article
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <Bookmark className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <Heart className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <MessageCircle className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  #{blog.category}
                </span>
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  #Security
                </span>
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  #BestPractices
                </span>
              </div>

              {/* Author bio */}
              <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  About the Author
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{blog.author}</h4>
                    <p className="text-gray-600 text-sm mt-2">
                      Satish Govindappa is a highly accomplished professional
                      with an extensive background in cloud security and product
                      architecture. With over two decades of experience, Satish
                      has established himself as a prominent figure in the
                      industry, serving as a Board Member and Chapter Leader for
                      the Cloud Security Alliance SFO Chapter.
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      He holds a master's degree in computer applications
                      (MCA),specializing in cybersecurity and cyber law.
                      Additionally,Satish has earned a Master of Business
                      Administration (MBA) degree, further enhancing his
                      expertise in the intersection of technology and business
                      strategy.
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                      His expertise lies in designing, architecting, and
                      reviewing both cloud, non-cloud and ai/genai products and
                      services. Satish has a proven track record of successfully
                      implementing robust security measures and ensuring the
                      integrity and confidentiality of sensitive data.
                    </p>
                    <a
                      href="https://www.linkedin.com/in/hkgsatish/"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Satish's LinkedIn profile"
                    >
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation between posts */}
            {/* <div className="flex justify-between mt-8">
              <a
                href="#"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Article
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                Next Article
                <ChevronRight className="h-4 w-4" />
              </a>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              {/* Related posts */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {sampleBlogs.slice(1, 4).map((relatedBlog) => (
                    <a href="#" key={relatedBlog.id} className="block group">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {/* <img
                            // src={relatedBlog.coverImage}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                          /> */}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                            {relatedBlog.title}
                          </h4>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {relatedBlog.readTime}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Cybersecurity
                  </a>
                  <a
                    href="#"
                    className="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Machine Learning
                  </a>
                  <a
                    href="#"
                    className="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Security Architecture
                  </a>
                  <a
                    href="#"
                    className="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    AI Security
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to blog button */}
      <div className="text-center py-12">
        <a
          href="/Resources/blogs2"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Blog
        </a>
      </div>
    </div>
  );
};

export default CyberBlogDetailPage;
