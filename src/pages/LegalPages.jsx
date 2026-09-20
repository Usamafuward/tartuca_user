import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="bg-light min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary font-bold mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark">Privacy Policy</h1>
              <p className="text-sm text-gray-400">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>
              At Tartuca ("we", "our", or "us"), we value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data when using our website and dining services.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">1. Information We Collect</h2>
            <p>
              We collect information that you directly provide when placing an online order, booking a table, creating an account, or submitting a customer review. This includes your name, email address, phone number, delivery address, order details, and special dietary preferences.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To prepare and deliver your orders accurately.</li>
              <li>To reserve and manage your table bookings at our restaurant.</li>
              <li>To communicate order status, reservation confirmations, and service updates.</li>
              <li>To continually enhance our culinary menu and customer service.</li>
            </ul>
            <h2 className="text-lg font-bold text-dark pt-2">3. Security of Your Data</h2>
            <p>
              We implement industry-standard security protocols to safeguard your personal data. We do not sell or lease your personal information to third parties.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">4. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact our support team at <a href="mailto:privacy@tartuca.com" className="text-primary font-medium hover:underline">privacy@tartuca.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="bg-light min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary font-bold mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark">Terms of Service</h1>
              <p className="text-sm text-gray-400">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>
              Welcome to Tartuca. By visiting our restaurant, browsing our website, or using our delivery and reservation services, you agree to comply with the following Terms of Service.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">1. Table Reservations</h2>
            <p>
              We hold reserved tables for up to 15 minutes past the scheduled reservation time. If your party is delayed, please inform us as soon as possible. We reserve the right to release tables if guests do not arrive within this grace window.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">2. Online Orders & Delivery</h2>
            <p>
              Delivery times are estimates and may vary depending on kitchen volume, weather, and courier traffic. Orders placed through our system are finalized once confirmed by our kitchen.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">3. Cancellations & Refunds</h2>
            <p>
              Table reservations may be cancelled free of charge at any time. For food orders, please contact our restaurant directly if an error occurred with your order so we can promptly make it right.
            </p>
            <h2 className="text-lg font-bold text-dark pt-2">4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and password. Tartuca reserves the right to suspend accounts that violate our usage policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
