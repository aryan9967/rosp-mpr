import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About MediAid</h3>
            <p className="text-sm text-gray-200">
              MediAid is a cutting-edge platform designed to provide emergency medical assistance, hospital locators, and AI-powered symptom analysis to save lives when seconds count.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/emergency-sos" className="text-sm text-gray-200 hover:text-white transition-colors">
                  Emergency SOS
                </Link>
              </li>
              <li>
                <Link to="/hospital-locator" className="text-sm text-gray-200 hover:text-white transition-colors">
                  Hospital Locator
                </Link>
              </li>
              <li>
                <Link to="/symptom-checker" className="text-sm text-gray-200 hover:text-white transition-colors">
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link to="/first-aid-guide" className="text-sm text-gray-200 hover:text-white transition-colors">
                  First Aid Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-200">Email: support@medicaid.com</li>
              <li className="text-sm text-gray-200">Phone: +1 (123) 456-7890</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300/20 mt-8 pt-8">
          <p className="text-sm text-center text-gray-200">
            &copy; {new Date().getFullYear()} MediAid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;