
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | MiniFyn',
  description: 'Learn more about MiniFyn and our mission to simplify your digital life with powerful online tools.',
  alternates: {
    canonical: 'https://www.minifyn.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="prose prose-invert mx-auto">
        <h1 className="text-4xl font-bold mb-6">About MiniFyn</h1>

        <p className="lead text-lg mb-8">
          Welcome to MiniFyn! We are a dedicated team passionate about creating intuitive, efficient, and reliable online tools designed to simplify your digital tasks. In today's fast-paced world, we understand the need for quick and effective solutions, and that's precisely what we aim to deliver.
        </p>
        
        <p className="text-md text-muted-foreground">
            MiniFyn is owned and operated by Sylvester Kumar Das (UDYAM-KL-12-0136086).
        </p>

        <h2 className="text-3xl font-semibold mt-10 mb-4">Our Mission</h2>
        <p className="mb-6">
          Our core mission at MiniFyn is to empower individuals, developers, and businesses by providing a suite of powerful, easy-to-use online utilities. We strive to streamline everyday digital processes, making complex tasks accessible and manageable for everyone. Whether you're a seasoned professional or just starting, our tools are built with your productivity in mind.
        </p>

        <h2 className="text-3xl font-semibold mt-10 mb-4">What We Offer</h2>
        <p className="mb-6">
          MiniFyn offers a growing collection of essential online tools, including:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li><strong>URL Shortener:</strong> Transform long, cumbersome URLs into short, shareable links, complete with analytics.</li>
          <li><strong>QR Code Generator:</strong> Create custom QR codes for various purposes, from website links to contact information.</li>
          <li><strong>Code Minifier:</strong> Optimize your code (HTML, CSS, JavaScript) by removing unnecessary characters, improving website performance.</li>
          <li><strong>JSON Formatter:</strong> Beautify and validate your JSON data, making it easier to read and debug.</li>
          <li><strong>JWT Debugger:</strong> Decode and verify JSON Web Tokens, assisting developers in understanding and troubleshooting authentication flows.</li>
        </ul>
        <p className="mb-6">
          We are continuously working to expand our offerings, bringing you more innovative tools to enhance your digital experience.
        </p>

        <h2 className="text-3xl font-semibold mt-10 mb-4">Our Commitment to You</h2>
        <p className="mb-6">
          At MiniFyn, user satisfaction and data security are our top priorities. We are committed to:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li><strong>Reliability:</strong> Ensuring our tools are always available and perform consistently.</li>
          <li><strong>Simplicity:</strong> Designing interfaces that are intuitive and easy to navigate, even for complex functionalities.</li>
          <li><strong>Privacy:</strong> Protecting your data with robust security measures and transparent privacy practices, as detailed in our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.</li>
          <li><strong>Continuous Improvement:</strong> Regularly updating our tools and adding new features based on user feedback and technological advancements.</li>
        </ul>

        <h2 className="text-3xl font-semibold mt-10 mb-4">Get in Touch</h2>
        <p className="mb-6">
          We value your feedback and are always here to help. If you have any questions, suggestions, or need support, please don't hesitate to <a href="/contact" className="text-blue-400 hover:underline">contact us</a>. Your input helps us make MiniFyn even better.
        </p>

        <p className="text-lg mt-8">
          Thank you for choosing MiniFyn. We look forward to helping you simplify your digital world!
        </p>
      </div>
    </div>
  );
}
