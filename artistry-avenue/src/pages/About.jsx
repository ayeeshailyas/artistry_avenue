import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function About() {
  return (
    <PageTransition>
      <section className="max-w-3xl mx-auto px-5 md:px-10 py-20 md:py-28">
        <p className="text-xs tracking-widest2 text-wine uppercase mb-3">Our Story</p>
        <h1 className="font-display text-4xl text-plum mb-8 leading-tight">
          Stationery made the slow way
        </h1>
        <div className="flex flex-col gap-6 text-stone leading-relaxed">
          <p>
            Artistry Avenue began on a kitchen table with a bottle of wine-coloured
            ink and a stack of paper that didn't feel special enough. We wanted
            notebooks that made you want to write in them, cards worth keeping, and
            small desk objects that felt considered rather than convenient.
          </p>
          <p>
            Every journal is hand-bound in small batches, every wax seal is pressed
            by hand, and every marbled cover is genuinely one of one. We work with a
            small circle of paper mills and bindery studios who care about the same
            details we do — the weight of a page, the way ink sits on cotton stock,
            the click of a wax seal cooling.
          </p>
          <p>
            The name comes from the idea of an avenue: a place you walk down slowly,
            noticing things. That's what we want stationery to feel like again.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <p className="font-display text-3xl text-wine mb-1">2019</p>
            <p className="text-xs text-stone uppercase tracking-widest2">Studio founded</p>
          </div>
          <div>
            <p className="font-display text-3xl text-wine mb-1">100%</p>
            <p className="text-xs text-stone uppercase tracking-widest2">Hand-finished</p>
          </div>
          <div>
            <p className="font-display text-3xl text-wine mb-1">12k+</p>
            <p className="text-xs text-stone uppercase tracking-widest2">Journals sent home</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/shop" className="bg-plum text-paper text-sm px-8 py-4 rounded-pill hover:bg-wine transition-colors">
            Explore the Shop
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
