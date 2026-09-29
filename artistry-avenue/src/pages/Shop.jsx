import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop() {
  const { category } = useParams();
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectiveCategory = category || "all";

  useEffect(() => {
    api.getCategories().then(({ categories }) => setCategories(categories));
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const params = {};
      if (effectiveCategory !== "all") params.category = effectiveCategory;
      if (sort !== "featured") params.sort = sort;

      try {
        const data = await api.getProducts(params);
        setList(data.products || data);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [effectiveCategory, sort]);

  const currentLabel =
    categories.find((c) => c.slug === effectiveCategory)?.name || "All Products";

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-14">
        <div className="mb-10">
          <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Shop</p>
          <h1 className="font-display text-4xl text-plum">{currentLabel}</h1>
          <p className="text-stone text-sm mt-2">{loading ? "Loading…" : `${list.length} pieces`}</p>
        </div>

        <div className="flex items-center justify-between mb-8 md:hidden">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm text-plum border border-hairline px-4 py-2 rounded-pill"
          >
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-12">
          <aside className="hidden md:block">
            <h3 className="text-xs tracking-widest2 text-plum uppercase mb-4">Category</h3>
            <ul className="flex flex-col gap-3 mb-10">
              <li>
                <Link
                  to="/shop"
                  className={`text-sm ${
                    effectiveCategory === "all" ? "text-wine" : "text-stone hover:text-plum"
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/shop/${c.slug}`}
                    className={`text-sm ${
                      effectiveCategory === c.slug ? "text-wine" : "text-stone hover:text-plum"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="h-px bg-hairline mb-6" />
            <h3 className="text-xs tracking-widest2 text-plum uppercase mb-4">Sort By</h3>
            <ul className="flex flex-col gap-3">
              {sortOptions.map((o) => (
                <li key={o.value}>
                  <button
                    onClick={() => setSort(o.value)}
                    className={`text-sm text-left ${
                      sort === o.value ? "text-wine" : "text-stone hover:text-plum"
                    }`}
                  >
                    {o.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            {!loading && list.length === 0 ? (
              <div className="py-24 text-center text-stone text-sm">
                No pieces here yet — check back soon.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <div className="absolute inset-0 bg-plum/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-paper rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto thin-scroll">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-plum">Filter & Sort</h3>
              <button onClick={() => setFilterOpen(false)} aria-label="Close">
                <X size={18} className="text-plum" />
              </button>
            </div>
            <h4 className="text-xs tracking-widest2 text-plum uppercase mb-3">Category</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              <Link
                to="/shop"
                onClick={() => setFilterOpen(false)}
                className={`text-xs px-4 py-2 rounded-pill border ${
                  effectiveCategory === "all" ? "border-wine text-wine" : "border-hairline text-stone"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/shop/${c.slug}`}
                  onClick={() => setFilterOpen(false)}
                  className={`text-xs px-4 py-2 rounded-pill border ${
                    effectiveCategory === c.slug ? "border-wine text-wine" : "border-hairline text-stone"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <h4 className="text-xs tracking-widest2 text-plum uppercase mb-3">Sort By</h4>
            <div className="flex flex-col gap-2">
              {sortOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setSort(o.value); setFilterOpen(false); }}
                  className={`text-sm text-left py-1.5 ${
                    sort === o.value ? "text-wine" : "text-stone"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
