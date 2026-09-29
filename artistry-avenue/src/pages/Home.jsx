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
    async function loadHomeData() {
      try {
        const [categoryData, productData] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);
        setCategories(categoryData.categories || []);
        const products = productData.products || productData;
        setCarouselProducts(products.filter((product) => product.images?.[0]));
      } catch {
        setCategories([]);
        setCarouselProducts([]);
      }
    }

    loadHomeData();
  }, []);

  const loopProducts = carouselProducts.length > 1
    ? [...carouselProducts, ...carouselProducts]
    : carouselProducts;

  return (
    <PageTransition>
      {/* Hero */}
      <section
        className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-paper-dim bg-cover bg-center px-5 py-20 text-center md:px-10"
        style={{ backgroundImage: "url('/main_img.png')" }}
      >
        <div className="absolute inset-0 z-0 bg-black/55" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-widest2 text-white/90 uppercase mb-5">
              The Studio Edit
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.08] text-balance mb-6 drop-shadow-lg"
            >
              Bring a touch of magic to your everyday desk
            </motion.h1>
            
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center items-center gap-2">
              <Link
                to="/shop"
                className="bg-wine-light text-paper text-sm tracking-wide px-8 py-4 rounded-pill hover:bg-wine transition-colors duration-300 ease-silk"
              >
                Shop the Edit
              </Link>
              <Link to="/about" className="bg-wine-light text-sm text-white px-8 py-4 rounded-pill hover:bg-wine transition-colors duration-300 ease-silk ">
                Our story 
              </Link>
            </motion.div>
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
