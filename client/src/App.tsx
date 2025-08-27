import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@shared/state/auth-store";
import { onAuthStateChange } from "@/firebase/services/auth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import AdminDashboard from "@/pages/admin/dashboard";
import Profile from "@/pages/profile";

// Components
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AuthGuard from "@/components/auth/auth-guard";
import AdminGuard from "@/components/auth/admin-guard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="brill-prime-theme">
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/products" component={Products} />
              <Route path="/products/:id" component={ProductDetail} />
              <Route path="/cart" component={Cart} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              
              {/* Protected routes */}
              <Route path="/checkout">
                <AuthGuard>
                  <Checkout />
                </AuthGuard>
              </Route>
              <Route path="/orders">
                <AuthGuard>
                  <Orders />
                </AuthGuard>
              </Route>
              <Route path="/profile">
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin">
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </Route>
              
              {/* 404 fallback */}
              <Route>
                <div className="container mx-auto px-4 py-8 text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="text-primary hover:underline">
                    Return Home
                  </a>
                </div>
              </Route>
            </Switch>
          </main>
          <Footer />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}