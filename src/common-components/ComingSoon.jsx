import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ComingSoon = ({ sectionName }) => {
  return (
    <div className="bg-yellow-100 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl border border-orange-300 p-8 max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          {sectionName} - Coming Soon!
        </h1>
        <p className="text-lg text-gray-700">
          We&apos;re working hard to bring you the <span className="font-semibold text-orange-500">{sectionName}</span> section. Stay tuned for updates!
        </p>
        <p className="mt-4 text-gray-600">
          In the meantime, feel free to explore other sections of CyberShield.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/"
            className="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition font-semibold"
          >
            Go to Home
          </Link>
          <Link
            to="/quiz"
            className="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition font-semibold"
          >
            Take a Quiz
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-gray-600 text-sm">
        © 2025 CyberShield. All rights reserved.
      </footer>
    </div>
  );
};
ComingSoon.propTypes = {
  sectionName: PropTypes.string.isRequired,
};

export default ComingSoon;