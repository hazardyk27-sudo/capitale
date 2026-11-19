import { Switch, Route, Redirect, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { MobileActionPanel } from "./components/MobileSharedLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

type MetaPixelWindow = Window & {
  fbq?: (...args: unknown[]) => void;
};

type RedditPixelWindow = Window & {
  rdt?: (...args: unknown[]) => void;
};

function MetaPixelPageViews() {
  const [location] = useLocation();
  const lastLocation = useRef<string | null>(null);

  useEffect(() => {
    // The global base code in index.html records the first PageView. This
    // observer only records distinct client-side route changes.
    if (lastLocation.current === location) return;
    const isInitialLocation = lastLocation.current === null;
    lastLocation.current = location;
    if (isInitialLocation) return;

    const pixelWindow = window as MetaPixelWindow;
    pixelWindow.fbq?.("track", "PageView");
  }, [location]);

  return null;
}

function RedditPixelPageVisits() {
  const [location] = useLocation();
  const lastLocation = useRef<string | null>(null);

  useEffect(() => {
    // The global base code in index.html records the first PageVisit. This
    // observer only records distinct client-side route changes.
    if (lastLocation.current === location) return;
    const isInitialLocation = lastLocation.current === null;
    lastLocation.current = location;
    if (isInitialLocation) return;

    const pixelWindow = window as RedditPixelWindow;
    pixelWindow.rdt?.("track", "PageVisit");
  }, [location]);

  return null;
}

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const Landing = lazy(() => import("@/pages/landing"));
const Today = lazy(() => import("@/pages/today"));
const Matches = lazy(() => import("@/pages/matches"));
const Coupons = lazy(() => import("@/pages/coupons"));
const CouponDetail = lazy(() => import("@/pages/coupon-detail"));
const AdminCoupons = lazy(() => import("@/pages/admin-coupons"));
const AdminBugun = lazy(() => import("@/pages/admin-bugun"));
const Admin = lazy(() => import("@/pages/admin"));
const AdminSocialMedia = lazy(() => import("@/pages/admin-social-media"));
const AdminSoftware = lazy(() => import("@/pages/admin-software"));
const History = lazy(() => import("@/pages/history"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const EmailVerification = lazy(() => import("@/pages/email-verification"));
const VerificationPending = lazy(() => import("@/pages/verification-pending"));
const Plans = lazy(() => import("@/pages/plans"));
const FreeBet = lazy(() => import("@/pages/free-bet"));
const Membership = lazy(() => import("@/pages/membership"));
const Promotion = lazy(() => import("@/pages/instagram"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Terms = lazy(() => import("@/pages/terms"));

function GlobalMobileNav() {
  const [location] = useLocation();
  // Landing page has its own MobileActionPanel; skip admin, internal & plans (has its own checkout bar)
  if (
    location === "/" ||
    location.startsWith("/admin") ||
    location.startsWith("/profit") ||
    location === "/plans" ||
    location === "/paketler" ||
    location === "/instagram" ||
    location === "/Promotion" ||
    location === "/promotion" ||
    location.startsWith("/promotion/")
  ) return null;
  return (
    <div className="md:hidden">
      {/* Spacer so fixed panel doesn't cover page content */}
      <div style={{ height: "80px" }} aria-hidden="true" />
      <MobileActionPanel />
    </div>
  );
}

function AdminScrollRestoration() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    if (!location.startsWith("/admin")) return;

    const key = `admin-scroll:${window.location.pathname}${window.location.search}`;
    const saved = Number(sessionStorage.getItem(key));
    const target = Number.isFinite(saved) && saved > 0 ? saved : 0;
    let restored = false;
    let frame = 0;
    let fallbackTimeout = 0;
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          if (!restored) frame = window.requestAnimationFrame(restore);
        })
      : null;

    const restore = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (target <= maxScroll || target === 0) {
        window.scrollTo(0, Math.min(target, maxScroll));
        restored = true;
        resizeObserver?.disconnect();
        return;
      }
      fallbackTimeout = window.setTimeout(() => {
        if (!restored) restore();
      }, 100);
    };
    resizeObserver?.observe(document.documentElement);
    frame = window.requestAnimationFrame(restore);
    const stopRetrying = window.setTimeout(() => {
      if (!restored) {
        window.scrollTo(0, Math.min(target, Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
        restored = true;
        resizeObserver?.disconnect();
      }
    }, 5000);

    const save = () => {
      if (!restored) return;
      sessionStorage.setItem(key, String(Math.round(window.scrollY)));
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", save);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallbackTimeout);
      window.clearTimeout(stopRetrying);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
      save();
    };
  }, [location]);

  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public Bet Capitale pages */}
      <Route path="/" component={Landing} />
      <Route path="/today" component={Today} />
      <Route path="/bugun"><Redirect to="/today" /></Route>
      <Route path="/history" component={History} />
      <Route path="/gecmis"><Redirect to="/history" /></Route>
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/nasil-calisir"><Redirect to="/how-it-works" /></Route>
      <Route path="/plans" component={Plans} />
      <Route path="/paketler"><Redirect to="/plans" /></Route>
      <Route path="/terms" component={Terms} />
      <Route path="/sartlar"><Redirect to="/terms" /></Route>
      <Route path="/free-bet" component={FreeBet} />
      <Route path="/login" component={Login} />
      <Route path="/giris"><Redirect to="/login" /></Route>
      <Route path="/register" component={Register} />
      <Route path="/kayit"><Redirect to="/register" /></Route>
      <Route path="/email-verification" component={EmailVerification} />
      <Route path="/email-dogrulama"><Redirect to="/email-verification" /></Route>
      <Route path="/verification-pending" component={VerificationPending} />
      <Route path="/dogrulama-bekliyor"><Redirect to="/verification-pending" /></Route>
      <Route path="/membership" component={Membership} />
      <Route path="/promotion/x" component={Promotion} />
      <Route path="/promotion/meta" component={Promotion} />
      <Route path="/promotion/insta" component={Promotion} />
      <Route path="/promotion/ads" component={Promotion} />
      <Route path="/promotion" component={Promotion} />
      <Route path="/Promotion"><Redirect to="/promotion" /></Route>
      <Route path="/instagram"><Redirect to="/promotion" /></Route>
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Existing tracker / admin pages — preserved */}
      <Route path="/profit" component={Home} />
      <Route path="/matches" component={Matches} />
      <Route path="/coupons" component={Coupons} />
      <Route path="/coupons/:id" component={CouponDetail} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/coupons" component={AdminCoupons} />
      <Route path="/admin/today" component={AdminBugun} />
      <Route path="/admin/social-media" component={AdminSocialMedia} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MetaPixelPageViews />
        <RedditPixelPageVisits />
        <AdminScrollRestoration />
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#FCFCFB" }} />}>
          <Router />
        </Suspense>
        <GlobalMobileNav />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
