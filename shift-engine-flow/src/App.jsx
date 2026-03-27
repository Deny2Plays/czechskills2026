import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Layouts
import FrontendLayout from './components/FrontendLayout';
import AdminLayout from './components/AdminLayout';

// Frontend Pages
import Home from './pages/Home';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import FAQHub from './pages/FAQHub';
import FAQCategoryDetail from './pages/FAQCategoryDetail';
import FAQItemDetail from './pages/FAQItemDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import PostsList from './pages/admin/PostsList';
import PostEditor from './pages/admin/PostEditor';
import FAQManager from './pages/admin/FAQManager';
import CategoriesManager from './pages/admin/CategoriesManager';
import TagsManager from './pages/admin/TagsManager';
import TenantsManager from './pages/admin/TenantsManager';
import RedirectsManager from './pages/admin/RedirectsManager';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Only redirect to login for admin routes
      if (window.location.pathname.startsWith('/admin')) {
        navigateToLogin();
        return null;
      }
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Frontend Routes */}
      <Route element={<FrontendLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogListing />} />
        <Route path="/blog/:category/:slug" element={<BlogDetail />} />
        <Route path="/faq" element={<FAQHub />} />
        <Route path="/faq/:categorySlug" element={<FAQCategoryDetail />} />
        <Route path="/faq/:categorySlug/:itemSlug" element={<FAQItemDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/posts" element={<PostsList />} />
        <Route path="/admin/posts/edit/:id" element={<PostEditor />} />
        <Route path="/admin/faq" element={<FAQManager />} />
        <Route path="/admin/categories" element={<CategoriesManager />} />
        <Route path="/admin/tags" element={<TagsManager />} />
        <Route path="/admin/tenants" element={<TenantsManager />} />
        <Route path="/admin/redirects" element={<RedirectsManager />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App