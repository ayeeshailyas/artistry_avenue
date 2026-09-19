import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 py-32 min-h-[60vh] flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 seal-ring rounded-full flex items-center justify-center">
          <span className="font-display text-2xl text-wine">?</span>
        </div>
        <h1 className="font-display text-3xl text-plum">This page has wandered off</h1>
        <p className="text-stone max-w-sm">
          The page you're looking for doesn't exist, or may have moved. Let's get
          you back to something worth reading.
        </p>
        <Link to="/" className="bg-plum text-paper text-sm px-7 py-3.5 rounded-pill hover:bg-wine transition-colors">
          Back to Home
        </Link>
      </div>
    </PageTransition>
  );
}
