import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [carouselProducts, setCarouselProducts] = useState([]);

  useEffect(() => {
    api.getCategories().then(({ categories }) => setCategories(categories));
    api.getProducts().then(({ products }) =>
      setCarouselProducts(products.filter((p) => p.images?.[0]))
    );
  }, []);

  const loopProducts = carouselProducts.length > 1
    ? [...carouselProducts, ...carouselProducts]
    : carouselProducts;

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper-dim pb-[5%]">
        <div className="max-w-container mx-auto px-5 md:px-10 grid md:grid-cols-2 items-center min-h-[86vh]">
          <motion.div
            initial="hidden"
            animate="show"
            className="order-2 md:order-1 py-16 md:py-0"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-widest2 text-wine uppercase mb-5">
              The Studio Edit
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl md:text-6xl text-plum leading-[1.08] text-balance mb-6"
            >
              Paper, ink and a little bit of sparkle.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-stone text-base md:text-lg max-w-md mb-9 leading-relaxed">
              Artistry Avenue makes stationery worth slowing down for hand-finished
              journals, fine pens and desk objects that turn writing into a small ritual.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex items-center gap-6">
              <Link
                to="/shop"
                className="bg-plum text-paper text-sm tracking-wide px-8 py-4 rounded-pill hover:bg-wine transition-colors duration-300 ease-silk"
              >
                Shop the Edit
              </Link>
              <Link to="/about" className="text-sm text-plum link-grow flex items-center gap-1.5">
                Our story 
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 md:order-2 relative h-[50vh] md:h-[80vh]"
          >
            <img
              src="/stationery/diary/blueberry_notebook_flatlay_1.webp"
              alt="Blueberry notebook from the Artistry Avenue stationery collection"
              className="w-full h-full object-cover rounded pt-9 "
            />
            <div className="absolute -bottom-6 -left-6 hidden md:flex w-28 h-28 rounded-full bg-paper items-center justify-center shadow-lift">
              <div className="w-20 h-20 seal-ring rounded-full flex flex-col items-center justify-center text-center">
                <span className="font-display text-wine text-sm leading-none">Hand</span>
                <span className="font-display text-wine text-sm leading-none">Finished</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-container mx-auto px-5 md:px-10 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Explore</p>
            <h2 className="font-display text-3xl text-plum">Shop by Category</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm text-plum link-grow">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-soft aspect-[3/4] bg-paper-dim">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-silk group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-paper">
                  <h3 className="font-display text-lg">{c.name}</h3>
                  <p className="text-xs text-paper/80 mt-0.5 hidden sm:block">{c.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-blush py-24">
        <div className="max-w-container mx-auto px-5 md:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Studio Favourites</p>
              <h2 className="font-display text-3xl text-plum">Current Obsessions</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm text-plum link-grow">
              Shop all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-hidden">
            <div className="obsessions-marquee flex gap-5 w-max">
              {loopProducts.map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  className="w-[calc((100vw-3.75rem)/2)] shrink-0 md:w-[calc((min(100vw,1400px)-5rem-3.75rem)/4)]"
                >
                  <ProductCard product={p} imageAspect="aspect-[3/4]" imageLoading="eager" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </PageTransition>
  );
}
