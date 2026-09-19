import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Heart, ShoppingBag, Package, MessageCircle, Truck } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

const statusLabels = {
  received: "Received",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Account() {
  const { user, logout, updateProfile } = useAuth();
  const { count: wishCount } = useWishlist();
  const { count: cartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    api
      .getOrders()
      .then(({ orders }) => setOrders(orders))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoaded(true));
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSave(e) {
    e.preventDefault();
    updateProfile({ name });
    setEditing(false);
    showToast("Profile updated");
  }

  return (
    <PageTransition>
      <div className="max-w-container mx-auto px-5 md:px-10 py-14">
        <p className="text-xs tracking-widest2 text-wine uppercase mb-2">Account</p>
        <h1 className="font-display text-4xl text-plum mb-10">Hello, {user.name.split(" ")[0]}</h1>

        <div className="grid md:grid-cols-[280px_1fr] gap-12">
          <aside>
            <div className="w-20 h-20 rounded-full bg-wine text-paper flex items-center justify-center text-2xl font-display mb-5">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-stone hover:text-wine"
            >
              <LogOut size={15} /> Sign out
            </button>
          </aside>

          <div className="flex flex-col gap-10">
            <section className="border border-hairline rounded-soft p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-plum">Profile Details</h2>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="text-xs text-wine link-grow">
                    Edit
                  </button>
                )}
              </div>
              {editing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-sm">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-stone">Full Name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-b border-plum/30 focus:border-wine py-2 text-sm text-plum outline-none"
                    />
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-plum text-paper text-xs px-5 py-2.5 rounded-pill hover:bg-wine transition-colors">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="text-xs text-stone">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-2 text-sm text-stone">
                  <p><span className="text-plum">Name:</span> {user.name}</p>
                  <p><span className="text-plum">Email:</span> {user.email}</p>
                </div>
              )}
            </section>

            <section className="grid sm:grid-cols-2 gap-5">
              <Link
                to="/wishlist"
                className="border border-hairline rounded-soft p-6 flex items-center justify-between hover:border-wine transition-colors"
              >
                <div>
                  <h3 className="font-display text-lg text-plum mb-1">Wishlist</h3>
                  <p className="text-xs text-stone">{wishCount} saved item{wishCount !== 1 && "s"}</p>
                </div>
                <Heart size={22} className="text-wine" />
              </Link>
              <Link
                to="/cart"
                className="border border-hairline rounded-soft p-6 flex items-center justify-between hover:border-wine transition-colors"
              >
                <div>
                  <h3 className="font-display text-lg text-plum mb-1">Shopping Bag</h3>
                  <p className="text-xs text-stone">{cartCount} item{cartCount !== 1 && "s"} in bag</p>
                </div>
                <ShoppingBag size={22} className="text-wine" />
              </Link>
            </section>

            <section className="border border-hairline rounded-soft p-6">
              <h2 className="font-display text-xl text-plum mb-5">Order History</h2>
              {!ordersLoaded ? (
                <p className="text-sm text-stone">Loading…</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-stone">
                  No past orders yet. Once you place an order, it will appear here for easy tracking.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-hairline">
                  {orders.map((order) => (
                    <li key={order.id} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="text-sm text-plum font-display text-base">{order.id}</p>
                          <p className="text-xs text-stone mt-0.5">
                            {new Date(order.created_at).toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-wine">{formatPrice(order.total)}</p>
                          <span className="text-[10px] tracking-widest2 uppercase text-stone">
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone mb-3">
                        {order.payment_method === "whatsapp" ? (
                          <>
                            <MessageCircle size={13} className="text-[#25D366]" /> Ordered via WhatsApp ·{" "}
                            {order.payment_status === "paid" ? "Confirmed" : "Awaiting confirmation"}
                          </>
                        ) : (
                          <>
                            <Truck size={13} /> Cash on Delivery ·{" "}
                            {order.payment_status === "paid" ? "Paid" : "Pay on arrival"}
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs text-stone">
                            <span className="flex items-center gap-2">
                              <Package size={12} className="text-gold" />
                              {item.name} {item.color && `(${item.color})`} × {item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
